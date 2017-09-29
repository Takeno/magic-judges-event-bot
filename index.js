import request from 'request-promise';
import {saveParsedEvent, isEventAlreadyParsed} from './db';
import fetchEvents, {GRAND_PRIX, PRO_TOUR, ITALY_AND_MALTA} from './utils/fetch-events';

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
    }).then(() => event);
}

Promise.all([fetchEvents([GRAND_PRIX, PRO_TOUR]), fetchEvents(undefined, [ITALY_AND_MALTA])])
    // Flat responses
    .then(responses => responses.reduce((acc, arr) => acc.concat(arr), []))
    // Get only events not already sent
    .then(events => events.filter(event => !isEventAlreadyParsed(event)))
    // Sent items
    .then(events => Promise.all(events.map(event => postEvent(event))))
    // Save sent items
    .then(events => events.forEach(event => saveParsedEvent(event)));
