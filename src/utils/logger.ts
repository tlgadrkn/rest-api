import logger from 'pino'; // pino is a logger library that
import dayjs from 'dayjs';

const log = logger({
  //   prettyPrint: true,
  base: {
    pid: false,
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default log;
// This logger is configured to print pretty JSON logs to the console with a timestamp.
