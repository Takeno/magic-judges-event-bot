import redis from 'redis';

const client = redis.createClient(process.env.REDIS_URL);

const KEY = 'EVENT_';

export function saveParsedEvent(event) {
    if (process.env.DRY_RUN) {
        return true;
    }

    return new Promise((resolve, reject) => {
        client.set(KEY + event.id, event, err => {
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
                return reject(err);
            }

            if (data) {
                return resolve(false);
            }

            resolve(event);
        });
    });
}

export function close() {
    client.end(true);
}
