import request from 'request-promise';
import {saveParsedEvent, checkUnparsedEvents} from './db';
import {configToEvents} from './utils/fetch-events';
import config from './config.json';

function formatDiscordDescription(event) {
    return `**Quando:** ${event.eventDate}
**Dove:** ${event.location}
**Chiusura application:** ${event.applicationClose}`;
}

function postEvent(event) {
    return request({
        url: config.DISCORD_WEBHOOK || process.env.DISCORD_WEBHOOK,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: `È aperta l'application per **${event.name}**! Chiuderà tra: *${event.applicationCloseRemaining}*`,
            // https://discordapp.com/developers/docs/resources/channel#embed-object
            embeds: [
                {
                    title: event.name,
                    description: formatDiscordDescription(event),
                    type: 'rich',
                    url: event.url,
                },
            ],
        }),
    });
}

async function removeEventsAlreadyParsed(events) {
    const checked = await Promise.all(
        events.map(event => checkUnparsedEvents(event))
    );

    return checked.filter(c => !!c);
}

async function runBot() {
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

runBot();
