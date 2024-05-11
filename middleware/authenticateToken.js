const jwt = require('jsonwebtoken');

function authenticateToken(request, reply, done) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ error: 'Access token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return reply.status(403).send({ error: 'Invalid token' });
    }
    
    // Add the userId to the request object for later use in route handlers
    request.userId = decoded.userId;
    done();
  });
}

module.exports = authenticateToken;
