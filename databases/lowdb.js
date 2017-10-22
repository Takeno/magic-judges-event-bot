const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(__dirname + '/../data/db.json');
const db = low(adapter);

db.defaults({processedEvents: []}).write();

export async function saveParsedEvent(event) {
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

    return !check && event;
}

export async function close() {}
