import { db } from '../config/firebase.js';

const COLLECTION = 'boards';

export const Element = {
  // Create element
  create: async (boardId, userId, data) => {
    // Verify board ownership
    const boardDoc = await db.collection(COLLECTION).doc(boardId).get();
    if (!boardDoc.exists || boardDoc.data().userId !== userId) {
      throw new Error('Unauthorized access');
    }

    const elementData = {
      boardId,
      frameId: data.frameId || null,
      type: data.type, // 'note', 'image', 'color', 'shape', 'link'
      position: data.position || { x: 0, y: 0 },
      size: data.size || { width: 200, height: 150 },
      rotation: data.rotation || 0,
      opacity: data.opacity ?? 1,
      zIndex: data.zIndex || 0,
      data: data.data || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db
      .collection(COLLECTION)
      .doc(boardId)
      .collection('elements')
      .add(elementData);

    return { id: docRef.id, ...elementData };
  },

  // Get all elements for a board
  getAll: async (boardId, userId) => {
    // Verify ownership
    const boardDoc = await db.collection(COLLECTION).doc(boardId).get();
    if (!boardDoc.exists || boardDoc.data().userId !== userId) {
      throw new Error('Unauthorized access');
    }

    const snapshot = await db
      .collection(COLLECTION)
      .doc(boardId)
      .collection('elements')
      .orderBy('zIndex', 'asc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Update element
  update: async (boardId, elementId, userId, updates) => {
    const docRef = db
      .collection(COLLECTION)
      .doc(boardId)
      .collection('elements')
      .doc(elementId);

    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('Element not found');
    }

    // Verify board ownership
    const boardDoc = await db.collection(COLLECTION).doc(boardId).get();
    if (!boardDoc.exists || boardDoc.data().userId !== userId) {
      throw new Error('Unauthorized access');
    }

    await docRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },

  // Bulk update elements (for multi-select)
  bulkUpdate: async (boardId, userId, elementIds, updates) => {
    // Verify board ownership
    const boardDoc = await db.collection(COLLECTION).doc(boardId).get();
    if (!boardDoc.exists || boardDoc.data().userId !== userId) {
      throw new Error('Unauthorized access');
    }

    const batch = db.batch();
    const results = [];

    for (const elementId of elementIds) {
      const docRef = db
        .collection(COLLECTION)
        .doc(boardId)
        .collection('elements')
        .doc(elementId);
      
      batch.update(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      
      results.push(docRef);
    }

    await batch.commit();
    return { success: true, count: elementIds.length };
  },

  // Delete element
  delete: async (boardId, elementId, userId) => {
    // Verify board ownership
    const boardDoc = await db.collection(COLLECTION).doc(boardId).get();
    if (!boardDoc.exists || boardDoc.data().userId !== userId) {
      throw new Error('Unauthorized access');
    }

    const docRef = db
      .collection(COLLECTION)
      .doc(boardId)
      .collection('elements')
      .doc(elementId);

    await docRef.delete();
  },
};