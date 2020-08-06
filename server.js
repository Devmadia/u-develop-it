const express = require('express');
const db = require('./db/database');
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// imports the inputCheck module
const inputCheck = require('./utils/inputCheck');

// port designation and add expression
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// route for all parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: rows
      });
    });
});

// route that includes an id parameter for a single party
app.get('/api/party/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
    res.status(400).json({ error: errors });
    return;
    }
    const sql = `SELECT * FROM parties WHERE id = ?`;
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

// a delete route
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({ message: 'successfully deleted', changes: this.changes });
    });
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