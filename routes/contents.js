const authenticateToken = require('../middleware/authenticateToken');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getAll', authenticateToken, async (req, res) => {
    const {page = 1, limit = 10} = req.query; // Default to page 1 and 10 items per page

    // Calculate the offset
    const offset = (page - 1) * limit;

    try {
        // Query the database with LIMIT and OFFSET for pagination
        const result = await pool.query(
            'SELECT * FROM contents ORDER BY id LIMIT $1 OFFSET $2',
            [parseInt(limit), parseInt(offset)]
        );

        // Optionally, get the total count of rows for metadata
        const countResult = await pool.query('SELECT COUNT(*) FROM contents');
        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            data: result.rows,
            meta: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});


module.exports = router;
