const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "log.txt");

const logRequest = (req) => {
  const { method, url, body } = req;
  const timestamp = new Date().toISOString();

  const logEntry = `[${timestamp}] ${method} ${url} \nRequest Body: ${JSON.stringify(
    body
  )}\n\n`;

  // Append log to log.txt file
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
};

module.exports = logRequest;
