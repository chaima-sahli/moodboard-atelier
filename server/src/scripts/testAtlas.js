import connectDB from '../config/database.js';
import mongoose from 'mongoose';

async function testAtlas() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await connectDB();
    console.log('✅ Connected successfully!');
    console.log('🎉 Your Atlas database is ready to use!\n');
    
    // Get the database
    const db = mongoose.connection.db;
    const testCollection = db.collection('test');
    
    // Create a test document
    await testCollection.insertOne({
      message: 'Hello Atlas!',
      timestamp: new Date(),
    });
    console.log('✅ Test document created successfully!');
    
    // Find and show it
    const docs = await testCollection.find({}).toArray();
    console.log('📄 Test documents:', docs);
    
    console.log('\n✅ MongoDB Atlas is working perfectly!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAtlas();