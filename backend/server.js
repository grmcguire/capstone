const express = require('express');
const cors = require('cors');
const { getAllComments, addComment } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get all comments
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await getAllComments();
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// Get comments for a specific photo
app.get('/api/comments/:photoId', (req, res) => {
  const { photoId } = req.params;
  const comments = readComments();
  res.json(comments[photoId] || []);
});

// Add a new comment
app.post('/api/comments', async (req, res) => {
  const { photoId, text } = req.body;
  
  if (!photoId || !text) {
    return res.status(400).json({ error: 'Photo ID and comment text are required' });
  }
  
  try {
    const newComment = {
      photoId,
      text,
      date: new Date().toISOString()
    };
    
    const savedComment = await addComment(newComment);
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});