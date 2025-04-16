const fs = require('fs');
const path = require('path');

// Data file path - in Vercel serverless functions, we need to use /tmp for writable storage
const dataPath = path.join('/tmp', 'comments.json');

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

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET request - return all comments
  if (req.method === 'GET') {
    const comments = readComments();
    res.status(200).json(comments);
    return;
  }

  // POST request - add a new comment
  if (req.method === 'POST') {
    const { photoId, text } = req.body;
    
    if (!photoId || !text) {
      res.status(400).json({ error: 'Photo ID and comment text are required' });
      return;
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
    return;
  }

  // If we get here, method not allowed
  res.status(405).json({ error: 'Method not allowed' });
};