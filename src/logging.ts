import { TransformableInfo } from 'logform';
import winston from 'winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import config from './config';

const {
  format, transports, createLogger,
} = winston;

const customFormat = format.printf(
  ({
    level, message, timestamp, label,
  }: TransformableInfo) => {
    const msg = `${timestamp} [${level}] [${label}]: ${message}`;
    return msg;
  },
);

function logger(filename: string) {
  const opt: ConsoleTransportOptions = {
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.simple(),
      customFormat,
    ),
  };

  const lg = createLogger({
    level: 'debug',
    format: format.combine(
      format.label({ label: `baseback-${filename}` }),
      format.timestamp(),
      format.json(),
    ),
    transports: [
      new transports.Console(opt),
      new transports.File({
        filename: config.server.log.infoFile,
        maxsize: 1024 * 1024 * 5,
        maxFiles: 3,
        tailable: true,
      }),
    ],
  });

  return lg;
}

export default {
  logger,
};
