const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.slice(7);
    if (!token) return res.status(401).json({message: 'Access denied'});
    console.log('token', token);

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = verified; // Add user info to the request object
        console.log('verified', verified);
        next();
    } catch (err) {
        res.status(403).json({message: 'Invalid token'});
    }
};

module.exports = authenticateToken;
