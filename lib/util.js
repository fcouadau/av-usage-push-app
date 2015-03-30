// Module imports
var winston = require('winston');
var config = require('config');

// Configure logging
var NODE_ENV = process.env['NODE_ENV'] || 'development'
var log_level = config.get('debug_logs') ? 'debug' : 'info'
var log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ level: log_level, json: false, colorize: true }),
    new (winston.transports.DailyRotateFile)({ level: log_level, json: false, filename: 'log/' + NODE_ENV + '.log' })
  ]
});

// Return the configured logger
exports.getLogger = function() {
  return log;
}