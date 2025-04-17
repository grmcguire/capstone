const { MongoClient } = require('mongodb');

// MongoDB connection string - will be set via environment variable
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Database and collection names
const DB_NAME = 'photoGallery';
const COLLECTION_NAME = 'comments';

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(DB_NAME);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Get comments collection
async function getCommentsCollection() {
  const db = await connectDB();
  return db.collection(COLLECTION_NAME);
}

// Get all comments
async function getAllComments() {
  const collection = await getCommentsCollection();
  const comments = await collection.find({}).toArray();
  
  // Convert array to object format for compatibility with existing code
  const commentsObj = {};
  comments.forEach(comment => {
    if (!commentsObj[comment.photoId]) {
      commentsObj[comment.photoId] = [];
    }
    commentsObj[comment.photoId].push(comment);
  });
  
  return commentsObj;
}

// Add a new comment
async function addComment(comment) {
  const collection = await getCommentsCollection();
  const result = await collection.insertOne(comment);
  return { ...comment, _id: result.insertedId };
}

module.exports = {
  connectDB,
  getAllComments,
  addComment
}; 