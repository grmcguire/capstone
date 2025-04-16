const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataPath = path.join(__dirname, 'comments.json');

// Helper function to read comments data
const readComments = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath, JSON.stringify({}), 'utf8');
      return {};
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading comments:', error);
    return {};
  }
};

// Helper function to write comments data
const writeComments = (data) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing comments:', error);
    return false;
  }
};

// Get all comments
app.get('/api/comments', (req, res) => {
  const comments = readComments();
  res.json(comments);
});

// Get comments for a specific photo
app.get('/api/comments/:photoId', (req, res) => {
  const { photoId } = req.params;
  const comments = readComments();
  res.json(comments[photoId] || []);
});

// Add a new comment
app.post('/api/comments', (req, res) => {
  const { photoId, text } = req.body;
  
  if (!photoId || !text) {
    return res.status(400).json({ error: 'Photo ID and comment text are required' });
  }
  
  const comments = readComments();
  const newComment = {
    id: Date.now(),
    text,
    date: new Date().toISOString(),
    photoId
  };
  
  // Update comments
  const photoComments = comments[photoId] || [];
  comments[photoId] = [...photoComments, newComment];
  
  if (writeComments(comments)) {
    res.status(201).json(newComment);
  } else {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});