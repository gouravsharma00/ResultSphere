const jwt = require('jsonwebtoken');

/**
 * Middleware to protect secure routes.
 * Extracts the JWT from the Authorization header and verifies it.
 */
const authMiddleware = (req, res, next) => {
    // 1. Extract the token from the header (Format: "Bearer <token>")
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. No valid token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // 3. Attach the decoded payload (student ID) to the request object for the next routes
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

/**
 * Strict RBAC Middleware for Admin routes.
 * Verifies the JWT and strictly checks that the user holds the 'admin' role.
 */
const requireAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. No valid token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden. Admin access required.' });
        }
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired admin token.' });
    }
};

module.exports = { authMiddleware, requireAdmin };