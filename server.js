const express = require('express');
const db = require('./db/database');

// port designation and add expression
const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// imports the inputCheck module
// const inputCheck = require('./utils/inputCheck');

// use apiRoutes
app.use('/api', apiRoutes);

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