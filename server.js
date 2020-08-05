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
db.get(`SELECT * FROM candidates WHERE id = 1`, (err, row) => {
    if(err) {
      console.log(err);
    }
    console.log(row);
});

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