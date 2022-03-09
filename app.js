const express = require('express');
const jwt = require('jsonwebtoken');


const app = express();

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to home page'
  });
});

// creating a route I wish to protect
app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  // creating a mock user
  const user = {
    id: 1,
    username: 'james',
    email: 'james@gmail.com'
  }

  jwt.sign({user}, 'secretkey',  (err, token) => {
    res.json({
      token
    });
  });
});

// Format of Token
// Authorization: Bearer <access_token>
// Verify Token
function verifyToken(req, res, next) {
// Get auth header value
const bearerHeader = req.headers['authorization'];

// Check if bearer is undefined
if(typeof bearerHeader !== 'undefined'){
  // Split at the space
  const bearer = bearerHeader.split(' ');
    // Get token from array.
    const bearerToken = bearer[1];
    // Set the Token
    req.token = bearerToken;
    // Next middleware
    next();
} else {
  // Forbidden
  res.sendStatus(403);
};
};

app.listen(5000, () => console.log('Server starts listening on port 5000'));
