import {saveParsedEvent, checkUnparsedEvents} from './db';
import {configToEvents} from './utils/fetch-events';
import postEvent from './utils/discord-sender';
import config from './config.json';

async function removeEventsAlreadyParsed(events) {
    const checked = await Promise.all(
        events.map(event => checkUnparsedEvents(event))
    );

    return checked.filter(c => !!c);
}

export default async function runBot() {
    // const responses = await Promise.all([
    //     fetchEvents([Types.GRAND_PRIX, Types.PRO_TOUR]),
    //     fetchEvents(undefined, [Countries.ITALY_AND_MALTA]),
    // ]);

    const responses = await Promise.all(configToEvents(config.events));

    // flat array
    let events = responses.reduce((acc, arr) => acc.concat(arr), []);

    // Get only events not already sent
    events = await removeEventsAlreadyParsed(events);

    // Send items
    await Promise.all(events.map(postEvent));

    await events.map(saveParsedEvent);
}
