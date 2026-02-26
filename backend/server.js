const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the pool from db.js

const app = express();
app.use(cors());
app.use(express.json());

// Example Route: Get all sweet desserts.........................................................................
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
//sweet deserts part completed here.................................................................................


//customer login and signup.......................................................................................
// CUSTOMER SIGNUP
app.post('/api/customer/signup', async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        await pool.query(
            'INSERT INTO customers (full_name, email, password) VALUES (?, ?, ?)',
            [full_name, email, password]
        );
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: "Email already registered." });
        } else {
            res.status(500).json({ error: "Database error." });
        }
    }
});

// CUSTOMER LOGIN
app.post('/api/customer/login', async (req, res) => {
    const { email, password } = req.body; // password here is already hashed from frontend
    try {
        const [rows] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
        if (rows.length === 0 || rows[0].password !== password) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        res.json({
            message: "Login successful",
            user: { id: rows[0].id, full_name: rows[0].full_name,email:rows[0].email }
        });
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});
//customer login and signup completed here..................................................................

//order_billing_system.............................................................................................
// --- NEW ORDER ROUTE ---
app.post('/api/place-order', async (req, res) => {
    // Destructure the data sent from the frontend
    const { email, name, items, total } = req.body;

    try {
        // We convert the items array into a JSON string for the database
        const itemsJSON = JSON.stringify(items);

        const [result] = await pool.query(
            'INSERT INTO orders (customer_email, customer_name, items, total_amount) VALUES (?, ?, ?, ?)',
            [email, name, itemsJSON, total]
        );

        res.status(201).json({
            success: true,
            message: "Order saved!",
            orderId: result.insertId
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to save order to database." });
    }
});
//order_billing_system......................................................................................... 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});