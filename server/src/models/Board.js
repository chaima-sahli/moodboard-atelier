import { db } from '../config/firebase.js';

const COLLECTION = 'boards';

export const Board = {
  // Create a new board
  create: async (userId, data) => {
    const boardData = {
      userId,
      title: data.title || 'Untitled Board',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        backgroundColor: data.settings?.backgroundColor || '#ffffff',
        gridSize: data.settings?.gridSize || 20,
        snapToGrid: data.settings?.snapToGrid ?? true,
      },
      frames: data.frames || [],
    };

    const docRef = await db.collection(COLLECTION).add(boardData);
    return { id: docRef.id, ...boardData };
  },

  // Get all boards for a user
  getAll: async (userId) => {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Get single board with elements
  getById: async (boardId, userId) => {
    const doc = await db.collection(COLLECTION).doc(boardId).get();
    
    if (!doc.exists) {
      throw new Error('Board not found');
    }

    const boardData = doc.data();
    
    // Verify ownership
    if (boardData.userId !== userId) {
      throw new Error('Unauthorized access');
    }

    // Get elements subcollection
    const elementsSnapshot = await db
      .collection(COLLECTION)
      .doc(boardId)
      .collection('elements')
      .orderBy('zIndex', 'asc')
      .get();

    const elements = elementsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      id: doc.id,
      ...boardData,
      elements,
    };
  },

  // Update board
  update: async (boardId, userId, updates) => {
    const docRef = db.collection(COLLECTION).doc(boardId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error('Board not found');
    }

    if (doc.data().userId !== userId) {
      throw new Error('Unauthorized access');
    }

    await docRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },

  // Delete board (and all elements)
  delete: async (boardId, userId) => {
    const docRef = db.collection(COLLECTION).doc(boardId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      throw new Error('Board not found');
    }

    if (doc.data().userId !== userId) {
      throw new Error('Unauthorized access');
    }

    // Delete all elements in subcollection
    const elementsSnapshot = await docRef.collection('elements').get();
    const batch = db.batch();
    
    elementsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    batch.delete(docRef);
    await batch.commit();
  },
};