const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test', // Replace with your DB name
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected');
});


app.get('/', (req, res) => {
  db.query('SELECT * FROM users WHERE email = "nilesh@gmail.com"', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));