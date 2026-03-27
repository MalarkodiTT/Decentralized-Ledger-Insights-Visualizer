const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // XAMPP default password empty
    database: 'blockchain_db'
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected... ✅");
});

// Blocks-ah fetch panna GET route
app.get('/get-blocks', (req, res) => {
    const sql = "SELECT * FROM blocks ORDER BY block_index ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// New block-ah save panna POST route
app.post('/add-block', (req, res) => {
    const { block_index, timestamp, data, previous_hash, hash } = req.body;
    const sql = "INSERT INTO blocks (block_index, timestamp, data, previous_hash, hash) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [block_index, timestamp, JSON.stringify(data), previous_hash, hash], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Block added to DB!" });
    });
});

app.listen(5000, () => console.log("Server running on port 5000 🚀"));