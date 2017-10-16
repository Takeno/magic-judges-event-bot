import request from 'request-promise';
import config from '../config.json';

function formatDiscordDescription(event) {
    return `**Quando:** ${event.eventDate}
**Dove:** ${event.location}
**Chiusura application:** ${event.applicationClose}`;
}

export default function postEvent(event) {
    if (process.env.DRY_RUN) {
        console.log('Posting ', event);
        return true;
    }

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
