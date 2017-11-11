// @flow
import {saveParsedEvent, checkUnparsedEvents} from './databases';
import {configToEvents} from './utils/fetch-events';
import postEvent from './utils/discord-sender';
import logger from './utils/logger';
import config from '../config.json';
import type {Events, Event} from './utils/types.js.flow';

async function removeEventsAlreadyParsed(events: Events): Events {
    const checked: Array<boolean | Event> = await Promise.all(
        events.map(event => checkUnparsedEvents(event))
    );

    // It seems that async function *MUST* return a Promise
    // for Flow.
    // https://github.com/facebook/flow/issues/2171
    // $FlowFixMe
    return checked.filter(c => !!c);
}

export default (async function runBot() {
    // const responses = await Promise.all([
    //     fetchEvents([Types.GRAND_PRIX, Types.PRO_TOUR]),
    //     fetchEvents(undefined, [Countries.ITALY_AND_MALTA]),
    // ]);
    try {
        const responses: Array<Events> = await Promise.all(
            configToEvents(config.events)
        );
        // flat array
        let events: Events = responses.reduce(
            (acc, arr) => acc.concat(arr),
            []
        );

        logger.info('Parsed %d events from site', events.length);

        // Get only events not already sent
        events = await removeEventsAlreadyParsed(events);

        logger.info('There are %d new events never sent yet', events.length);

        // Send items
        await Promise.all(events.map(postEvent));

        await Promise.all(events.map(saveParsedEvent));
    } catch (e) {
        logger.error(e);
    }
});
