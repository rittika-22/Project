const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the pool from db.js

const app = express();
app.use(cors());
app.use(express.json());

// Example Route: Get all desserts
app.get('/api/sweet_desserts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sweet_desserts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/sweet_desserts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sweet_desserts');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Add new dessert to SQL (Employee Panel)
app.post('/api/sweet_desserts', async (req, res) => {
    try {
        const { name, price, rating, image } = req.body;
        const [result] = await pool.query(
            'INSERT INTO sweet_desserts (name, price, rating, image) VALUES (?, ?, ?, ?)',
            [name, price, rating, image]
        );
        // Send back the auto-generated ID
        res.status(201).json({ message: "Item added!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove dessert from SQL (Employee Panel)
app.delete('/api/sweet_desserts/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM sweet_desserts WHERE id = ?', [req.params.id]);
        res.json({ message: "Item deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/sweet_desserts/:id', async (req, res) => {
    try {
        const { name, price, rating, image } = req.body;
        await pool.query(
            'UPDATE sweet_desserts SET name=?, price=?, rating=?, image=? WHERE id=?',
            [name, price, rating, image, req.params.id]
        );
        res.json({ message: "Item updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});