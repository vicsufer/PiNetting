

module.exports = {

  logger: null,

  init: function(winston) {
    const {
      combine,
      timestamp,
      label,
      printf
    } = winston.format;

    const myFormat = printf(info => {
      return `${info.timestamp} [${info.label}] ${info.level} -> ${info.message}`;
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        myFormat
      ),
      transports: [
        new winston.transports.File({
          filename: './logs/error.log',
          level: 'error'
        }),
        new winston.transports.File({
          filename: './logs/combined.log'
        })
      ]
    });
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        level: 'verbose',
        format: combine(
          timestamp(),
          myFormat
        ),
      }));
    }
  }
}
