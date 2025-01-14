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

router.post('/create', authenticateToken, async (req, res) => {
    const {title, url, img} = req.body;

    // Validate the input
    if (!title || !url || !img) {
        return res.status(400).json({message: 'Title and url are required'});
    }

    try {
        // Insert the new content into the database
        const result = await pool.query(
            'INSERT INTO contents (title, url,img) VALUES ($1, $2, $3) RETURNING *',
            [title, url, img],
        );

        // Respond with the newly created content
        res.status(201).json({
            message: 'Content created successfully',
            data: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

router.put('/update', authenticateToken, async (req, res) => {
    const {id, title, url, img} = req.body;

    // Validate the input
    if (!id || !title || !url || !img) {
        return res.status(400).json({message: 'ID, title, url, and img are required'});
    }

    try {
        // Update the content in the database
        const result = await pool.query(
            `
                UPDATE contents
                SET title = $1,
                    url   = $2,
                    img   = $3
                WHERE id = $4 RETURNING *
            `,
            [title, url, img, id]
        );

        // Check if the content was found and updated
        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Content not found'});
        }

        // Respond with the updated content
        res.status(200).json({
            message: 'Content updated successfully',
            data: result.rows[0],
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server error'});
    }
});

module.exports = router;
