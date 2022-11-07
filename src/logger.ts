import winston from 'winston'
import { transports, format } from 'winston'

const customFormat = format.printf(
  ({
    level,
    message,
    timestamp,
  }: {
    level: string
    message: string
    timestamp: string
  }) => {
    return `${timestamp} ${level}: ${message}`
  }
)

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.json(), format.timestamp(), customFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  )
}

export default logger
