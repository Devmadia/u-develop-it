// import the sqlite3 package to connect to the SQLite database
const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./db/election.db', err => { // created a new object, db, "election.db"
    if (err) {
      return console.error(err.message); // callback function informs if there's an error in the connection
    }
  
    console.log('Connected to the election database.'); // success message will appear if the connection was made correctly
});

module.exports = db;