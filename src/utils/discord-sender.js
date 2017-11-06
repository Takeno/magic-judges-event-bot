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
    const t = translate(config.language);
    const description = formatDiscordDescription(event, config.language);
    const content = t(
        'content',
        `Applications are open for **${event.name}**! Applications will close in: *${event.applicationCloseRemaining}*`,
        {
            eventName: event.name,
            eventClose: event.applicationCloseRemaining,
        },
    );

    if (process.env.DRY_RUN) {
        logger.debug(`DRY_RUN selected.
Posted event infos:
Description:
${description}
Content:
${content}`);
        return true;
    }

    return request({
        url: config.DISCORD_WEBHOOK || process.env.DISCORD_WEBHOOK,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content,
            // https://discordapp.com/developers/docs/resources/channel#embed-object
            embeds: [
                {
                    description,
                    title: event.name,
                    type: 'rich',
                    url: event.url,
                },
            ],
        }),
    });
}
