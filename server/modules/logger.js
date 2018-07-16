const util = require('util');

module.exports = {
  logger: null,
  init: function(winston) {
    const {
      combine,
      timestamp,
      label,
      printf
    } = winston.format;

    const consoleFormat = printf(info => {
      return util.format('%s [%s] %s', info.timestamp.padEnd(20), info.label.padEnd(15), info.message);
    });

    const jsonFormat = printf(info => {
      return `{ 'date':'${info.timestamp}','label':'${info.label}','level':'${info.level}','message':'${info.message}'`;
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        jsonFormat
      ),
      transports: [
        new winston.transports.File({
          filename: './logs/error.log',
          level: 'error',
          json: true
        }),
        new winston.transports.File({
          filename: './logs/combined.log',
          level: 'debug',
          json: true
        }),
        new winston.transports.File({
          name: 'devices',
          filename: './logs/devices.log',
          level: 'verbose',
          json: true,
          silent: true
        })
      ]
    });
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        json: false,
        colorize: true,
        level: 'silly',
        format: combine(
          timestamp(),
          consoleFormat
        ),
      }));
    }
  }
}
