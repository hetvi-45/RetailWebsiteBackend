const jwt = require('jsonwebtoken');
const config = require('./config');

// Middleware function to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  // Verify the token
  jwt.verify(token, config.secretKey, (error, decoded) => {
    if (error) {
      res.render('/');
      return res.status(401).json({ message: 'Invalid token.' });
    }

    const currentTimestamp = Date.now() / 1000; // Convert to seconds

    if (decoded.exp < currentTimestamp) {
      
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Attach the decoded token payload to the request object
    req.user = decoded;

    next();
  });
};

module.exports = verifyToken;