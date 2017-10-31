// @flow
import request from 'request-promise';
import config from '../../config.json';
import logger from '../utils/logger';
import type {Event} from './types.js.flow';
import {translate} from '../i18n';

function formatDiscordDescription(event: $FlowFixMe, language: string = 'en') {
    const t = translate(language);
    return `**${t('when', 'When:')}** ${event.eventDate}
**${t('where', 'Where:')}** ${event.location}
**${t('closing', 'Applications close:')}** ${event.applicationClose}`;
}

export default function postEvent(event: Event) {
    logger.info('Posting event to discord: ', event);
    if (process.env.DRY_RUN) {
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
                    description: formatDiscordDescription(
                        event,
                        config.language,
                    ),
                    type: 'rich',
                    url: event.url,
                },
            ],
        }),
    });
}
