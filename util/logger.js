const winston = require('winston');
const path = require('path');

const logDirectory = process.env.NODE_ENV === 'test' ? '.' : '/var/log/webapp/';

// Define the custom Winston logger
const logger = winston.createLogger({
  // Set up the logger format
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  // Define the transports (where to log the messages to)
  transports: [
    // Define a file transport for error logs
    new winston.transports.File({
      filename: path.join(logDirectory, 'csye6225.error.log'),
      level: 'error',
    }),
    // Define a file transport for all logs
    new winston.transports.File({
      filename: path.join(logDirectory, 'csye6225.log'),
      level: 'info',
    }),
  ],
  exitOnError: false,
});

logger.stream = {
    write: function (message) {
      // Use the 'info' log level so the output will be picked up by both transports (console and file)
      logger.info(message.trim());
    },
};

// Export the logger so it can be used in other files
module.exports = logger;
