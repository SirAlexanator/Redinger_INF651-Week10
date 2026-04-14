// Import required modules
const express = require('express');
const path = require('path');

// Create Express app
const app = express();

// Port
const PORT = 3000;

/* =========================
   IMPORT MIDDLEWARE
========================= */
const logger = require('./middleware/logger'); // optional if you made one
const errorHandler = require('./middleware/errorHandler');

app.use(logger);

/* =========================
   BASIC ROUTE
========================= */
app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to your first Express server.');
});

/* =========================
   ROUTING EXAMPLES
========================= */

// Dynamic parameter
app.get('/user/:name', (req, res) => {
    res.send(`Hello, ${req.params.name}`);
});

// Multiple parameters
app.get('/user/:userId/book/:bookId', (req, res) => {
    const { userId, bookId } = req.params;
    res.send(`User ID: ${userId}, Book ID: ${bookId}`);
});

// Optional parameter (Express 5 syntax)
app.get('/optional/:id{0,1}', (req, res) => {
    const userId = req.params.id || 'No ID provided';
    res.send(`User ID: ${userId}`);
});

// POST
app.post('/submit', (req, res) => {
    res.send('Form Submitted Successfully');
});

// PUT
app.put('/update', (req, res) => {
    res.send('Data Updated Successfully');
});

// DELETE
app.delete('/delete', (req, res) => {
    res.send('Data Deleted Successfully');
});

/* =========================
   REDIRECTION
========================= */

app.get('/old-page', (req, res) => {
    res.redirect(301, '/new-page');
});

app.get('/new-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

/* =========================
   MULTIPLE HANDLERS
========================= */

function firstHandler(req, res, next) {
    console.log('First handler executed');
    req.data = 'Data from first handler';
    next();
}

function secondHandler(req, res, next) {
    console.log('Second handler executed');
    req.data += ' | Data from second handler';
    next();
}

function finalHandler(req, res) {
    console.log('Final handler executed');
    res.send(`Final Response: ${req.data}`);
}

app.get('/multi', firstHandler, secondHandler, finalHandler);

/* =========================
   INLINE HANDLERS
========================= */

app.get('/process',
    (req, res, next) => {
        req.processing = 'Step 1 completed';
        next();
    },
    (req, res, next) => {
        req.processing += ' -> Step 2 completed';
        next();
    },
    (req, res) => {
        res.send(`Processing Result: ${req.processing} -> Step 3 completed`);
    }
);

/* =========================
   SERVE HTML FILE
========================= */

app.get(['/home', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/* =========================
   🚨 TEST ERROR ROUTE (REQUIRED)
========================= */

app.get('/error', (req, res, next) => {
    const err = new Error('This is a test error!');
    next(err);
});
/* =========================
   ERROR HANDLER (MUST BE LAST)
========================= */
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});