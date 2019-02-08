const { Client } = require('pg');
const express = require('express');

// create an express application
const app = express();
app.use(express.json());
// create a postgresql client
const client = new Client({
    database: 'social-media'
});

// route handlers go here
app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        console.log(result)
        res.send(result.rows);
    });
});

app.post('/users', (req, res) => {
    const text = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
    const values = [req.body.user, req.body.bio];
    client.query(text, values, (err, result) => {
        res.send(result.rows[0])
    });
})

app.get('/users/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    client.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
        console.log(result)
        res.send(result.rows[0]);
    });
})

// start a server that listens on port 3000 and connects the sql client on success
app.listen(3000, () => {
    client.connect();
});