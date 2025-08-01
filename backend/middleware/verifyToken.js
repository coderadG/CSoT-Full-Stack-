const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  console.log("📩 Received token from client:", token); // ✅ Log received token

  if (!token) return res.status(401).json({ message: 'Access denied: No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    console.log("✅ Token verified successfully:", decoded); // ✅ Log decoded payload
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.name, err.message); // ✅ Log why it failed
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;

