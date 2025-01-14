const authenticateToken = require('../middleware/authenticateToken');
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');
require('dotenv').config();

// Login route
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        // Check if user exists in the database
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user || user.password !== password) {
            return res.status(401).json({message: 'Invalid username or password'});
        }

        // Generate JWT token
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

router.get('/hello', authenticateToken, (req, res) => {
    res.status(200).json({message: 'Hello World!'});
});

module.exports = router;
