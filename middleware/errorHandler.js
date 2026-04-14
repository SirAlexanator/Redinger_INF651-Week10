const fs = require('fs');
const path = require('path');

const errorHandler = (err, req, res, next) => {
    const logDir = path.join(__dirname, '..', 'logs');
    const logFile = path.join(logDir, 'errorLog.txt');

    // Create logs folder if it doesn't exist
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Create timestamp
    const timestamp = new Date().toISOString();

    // Format error log
    const errorLog = `
[${timestamp}]
Error Name: ${err.name}
Error Message: ${err.message}
----------------------------------------
`;

    // Write to file
    fs.appendFile(logFile, errorLog, (error) => {
        if (error) console.error('Failed to write log:', error);
    });

    // Send response to client
    res.status(500).send('Something went wrong!');
};

module.exports = errorHandler;