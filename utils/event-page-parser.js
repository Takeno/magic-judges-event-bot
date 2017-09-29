const cheerio = require('cheerio');

export default function parseEventsPage(html) {
    const $ = cheerio.load(html);
    const openedEvents = $('#open_table').find('tbody > tr');

    return openedEvents.get().map(parseEventRow);
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
