const express = require('express');

// import the sqlite3 package to connect to the SQLite database
const sqlite3 = require('sqlite3').verbose();

// port designation and add expression
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./db/election.db', err => { // created a new object, db, "election.db"
    if (err) {
      return console.error(err.message); // callback function informs if there's an error in the connection
    }
  
    console.log('Connected to the election database.'); // success message will appear if the connection was made correctly
});

// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // If there was no error, then err is null and the response is sent back using the following statement
      res.json({
        message: 'success',
        data: rows
      });
    });
});

// Get single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates 
                 WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
});

// // Test the Express.js Connection
// app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello World'
//     });
// });

//  test the connection to the database by using a SQLite method to execute SQL commands
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// GET a single candidate
// db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
//     if(err) {
//       console.log(err);
//     }
//     console.log(row);
// });

// Delete a candidate
// db.run(`DELETE FROM candidates WHERE id = ?`, 1, function(err, result) {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result, this, this.changes);
// });

// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
//               VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function(err, result) {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result, this.lastID);
// });

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
}); 

/* ensure the Express.js server doesn't start before the connection 
to the database has been established, wrap the Express.js server 
connection located at the bottom of the server.js file in an event 
handler */

// Start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
});

// start the Express.js server on port 3001
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });