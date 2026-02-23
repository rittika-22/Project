require('dotenv').config({ path: '../.env' }); // Look for .env one level up
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false // Necessary for Aiven
    }
});

// Verification log
pool.getConnection()
    .then(conn => {
        console.log("✅ Successfully connected to Aiven Cloud MySQL");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err.message);
    });

module.exports = pool;