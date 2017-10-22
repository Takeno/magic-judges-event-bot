import {saveParsedEvent, checkUnparsedEvents} from './databases';
import {configToEvents} from './utils/fetch-events';
import postEvent from './utils/discord-sender';
import logger from './utils/logger';
import config from './config.json';

async function removeEventsAlreadyParsed(events) {
    const checked = await Promise.all(
        events.map(event => checkUnparsedEvents(event))
    );

    return checked.filter(c => !!c);
}

export default (async function runBot() {
    // const responses = await Promise.all([
    //     fetchEvents([Types.GRAND_PRIX, Types.PRO_TOUR]),
    //     fetchEvents(undefined, [Countries.ITALY_AND_MALTA]),
    // ]);

    const responses = await Promise.all(configToEvents(config.events));
    // flat array
    let events = responses.reduce((acc, arr) => acc.concat(arr), []);

    logger.info('Parsed %d events from site', events.length);

    // Get only events not already sent
    events = await removeEventsAlreadyParsed(events);

    logger.info('There are %d new events never sent yet', events.length);

    // Send items
    await Promise.all(events.map(postEvent));

    await events.map(saveParsedEvent);
});
