import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import logger from '../utils/logger';

const adapter = new FileSync(__dirname + '/../../data/db.json');
const db = low(adapter);

db.defaults({processedEvents: []}).write();

export async function saveParsedEvent(event) {
    logger.debug('Saving %d to lowdb', event.id);
    if (process.env.DRY_RUN) {
        return true;
    }

    return db
        .get('processedEvents')
        .push({id: event.id})
        .write();
}

export async function checkUnparsedEvents(event) {
    const check = db
        .get('processedEvents')
        .find({id: event.id})
        .value();

    logger.debug('Checking %d in lowdb with result: %s', event.id, !!check);

    return !check && event;
}

export async function close() {}
