const authenticateToken = require('../middleware/authenticateToken');
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getAll', authenticateToken, async (req, res) => {
    const {page = 1, limit = 10, search = ''} = req.query;

    // Calculate the offset
    const offset = (page - 1) * limit;

    try {
        // Search query with pagination
        const result = await pool.query(
            `
                SELECT *
                FROM contents
                WHERE title ILIKE $1
                   OR content ILIKE $1
                ORDER BY id
                    LIMIT $2
                OFFSET $3
            `,
            [`%${search}%`, parseInt(limit), parseInt(offset)]
        );

        // Total count of rows matching the search query
        const countResult = await pool.query(
            `
                SELECT COUNT(*)
                FROM contents
                WHERE title ILIKE $1
                   OR content ILIKE $1
            `,
            [`%${search}%`]
        );
        const total = parseInt(countResult.rows[0].count);

        res.status(200).json({
            data: result.rows,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});


module.exports = router;
