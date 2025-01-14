const authenticateToken = require('../middleware/authenticateToken');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getAll', authenticateToken, async (req, res) => {
    const result = await pool.query('SELECT * FROM contents');
    res.status(200).json(result);
})

module.exports = router;
