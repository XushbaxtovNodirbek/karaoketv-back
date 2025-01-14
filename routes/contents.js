const authenticateToken = require('../middleware/authenticateToken');
const router = express.Router();
const pool = require('../db');
const express = require("express");

router.get('/getAll', authenticateToken, async (req, res) => {
    const result = await pool.query('SELECT * FROM contents');
    res.status(200).json(result);
})

module.exports = router;
