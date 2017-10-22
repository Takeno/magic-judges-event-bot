import pino from 'pino';

const pretty = pino.pretty();
pretty.pipe(process.stdout);
const logger = pino(
    {
        name: 'app',
        safe: true,
        level: process.env.LOGGER || 'info',
    },
    pretty
);

export default logger;
