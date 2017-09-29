const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db.json');
const db = low(adapter);

db.defaults({processedEvents: []}).write();

export function saveParsedEvent(event) {
    return db
        .get('processedEvents')
        .push({id: event.id})
        .write();
}

export function isEventAlreadyParsed(event) {
    return db
        .get('processedEvents')
        .find({id: event.id})
        .value();
}
