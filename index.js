const request = require('request-promise');
const cheerio = require('cheerio');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db.json');
const db = low(adapter);

db.defaults({processedEvents: []}).write();

const DISCORD_WEBHOOK =
    'https://discordapp.com/api/webhooks/363350165232418847/hGgfhpWzqguAtMgXctd8xz7KL4WK7p6oGQgpj0dERfKX6jWWbW-q5J5pYrIQ8k4X-zlg';

function fetchWorldEvents() {
    return request(
        'https://apps.magicjudges.org/events/?filter_type=2&filter_type=1'
    );
}

function fetchNationalEvents() {
    return request('https://apps.magicjudges.org/events/?filter_region=17');
}

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

function parseEventRow(tr) {
    const $tds = cheerio('td', tr);
    const name = $tds
        .eq(0)
        .children('a')
        .text();
    const url = $tds
        .eq(0)
        .children('a')
        .attr('href');
    const location = $tds.eq(2).text();
    const eventDate = $tds.eq(3).text();
    const applicationClose = $tds.eq(4).attr('data-sort');
    const applicationCloseRemaining = $tds.eq(4).text();

    const id = url.replace(/\/events\/([0-9]+)\//, '$1');

    return {
        id,
        name,
        url: `https://apps.magicjudges.org${url}`,
        location,
        eventDate,
        applicationClose,
        applicationCloseRemaining,
    };
}

function parseEvents(html) {
    const $ = cheerio.load(html);
    const openedEvents = $('#open_table').find('tbody > tr');

    return openedEvents.get().map(parseEventRow);
}

Promise.all([fetchWorldEvents(), fetchNationalEvents()])
    .then(responses => responses.map(parseEvents))
    .then(responses => responses.reduce((acc, arr) => acc.concat(arr), []))
    .then(events =>
        events.filter(
            event =>
                !db
                    .get('processedEvents')
                    .find({id: event.id})
                    .value()
        )
    )
    .then(events => Promise.all(events.map(event => postEvent(event))))
    .then(events =>
        events.forEach(event =>
            db
                .get('processedEvents')
                .push({id: event.id})
                .write()
        )
    );
