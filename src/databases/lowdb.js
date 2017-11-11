// @flow
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import logger from '../utils/logger';
import type {Event} from '../utils/types.js.flow';

const adapter = new FileSync(__dirname + '/../../data/db.json');
const db = low(adapter);

db.defaults({processedEvents: []}).write();

export function saveParsedEvent(event: Event): Promise<any> {
    logger.debug('Saving %d to lowdb', event.id);
    if (process.env.DRY_RUN) {
        return Promise.resolve(true);
    }

    return db
        .get('processedEvents')
        .push({id: event.id})
        .write();
}

export function checkUnparsedEvents(event: Event): Promise<boolean | Event> {
    const check = db
        .get('processedEvents')
        .find({id: event.id})
        .value();

    logger.debug('Checking %d in lowdb with result: %s', event.id, !!check);

    return Promise.resolve(!check && event);
}

export function close(): void {}
