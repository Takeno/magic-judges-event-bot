import request from 'request-promise';
import {saveParsedEvent, checkUnparsedEvents} from './db';
import fetchEvents, {Types, Countries} from './utils/fetch-events';

const DISCORD_WEBHOOK =
    'https://discordapp.com/api/webhooks/363350165232418847/hGgfhpWzqguAtMgXctd8xz7KL4WK7p6oGQgpj0dERfKX6jWWbW-q5J5pYrIQ8k4X-zlg';

function formatDiscordDescription(event) {
    return `**Quando:** ${event.eventDate}
**Dove:** ${event.location}
**Chiusura application:** ${event.applicationClose}`;
}

function postEvent(event) {
    return request({
        url: DISCORD_WEBHOOK,
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
    const responses = await Promise.all([
        fetchEvents([Types.GRAND_PRIX, Types.PRO_TOUR]),
        fetchEvents(undefined, [Countries.ITALY_AND_MALTA]),
    ]);

    // flat array
    let events = responses.reduce((acc, arr) => acc.concat(arr), []);

    // Get only events not already sent
    events = await removeEventsAlreadyParsed(events);

    // Send items
    await Promise.all(events.map(postEvent));

    await events.map(saveParsedEvent);
}

runBot();
