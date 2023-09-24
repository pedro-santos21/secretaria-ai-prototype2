
/*

CONFIG SCRIPT TO SETUP LOGGING

Currently using "winston" lib

*/

/*
WINSTON LOGGING LEVELS:
{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.verbose('verbose');
logger.debug('debug');
logger.silly('silly');

*/

/* 
    winston-mongodb - transport logs to MongoDB.
    winston-syslog - transport logs to Syslog.
    winston-telegram - send logs to Telegram.
    @logtail/winston - send logs to Logtail.
    winston-mysql - store logs in MySQL.
*/

const winston = require('winston');
const { combine, timestamp, printf, colorize, align, errors } = winston.format;
require('winston-daily-rotate-file');

export function SetupWinstonLogger() 
{
    const fileRotateTransport = new winston.transports.DailyRotateFile({
        filename: '../logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        level: 'error'
      });

    const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        colorize({ all: true }),
        timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info:any) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console(), 
        fileRotateTransport
    ],
    exceptionHandlers: [
        fileRotateTransport
      ],
      rejectionHandlers: [
        fileRotateTransport
      ],
    });

    logger.exitOnError = false;

    return logger;
}

module.exports = SetupWinstonLogger;