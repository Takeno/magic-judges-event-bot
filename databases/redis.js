import redis from 'redis';
import logger from '../utils/logger';

const client = redis.createClient(process.env.REDIS_URL);

const KEY = 'EVENT_';
// Save event for 45 days
// to keep database small
const TTL = 60 * 60 * 24 * 45;

export function saveParsedEvent(event) {
    if (process.env.DRY_RUN) {
        return true;
    }

    return new Promise((resolve, reject) => {
        client.setex(KEY + event.id, TTL, JSON.stringify(event), err => {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}

export function checkUnparsedEvents(event) {
    return new Promise((resolve, reject) => {
        client.get(KEY + event.id, (err, data) => {
            if (err) {
                logger.error('Error reading %d from redis:', event.id, err);
                return reject(err);
            }

            if (data) {
                logger.debug(
                    'Checking %d in redis with result: %s',
                    event.id,
                    true
                );
                return resolve(false);
            }

            logger.debug(
                'Checking %d in redis with result: %s',
                event.id,
                false
            );
            resolve(event);
        });
    });
}

export function close() {
    logger.debug('Closing redis connection');
    client.end(true);
}