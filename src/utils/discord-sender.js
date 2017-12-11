// @flow
import request from 'request-promise';
import config from '../../config.json';
import logger from '../utils/logger';
import type {Event} from './types.js.flow';
import t from './translate';

function formatDiscordDescription(event: Event) {
    return `**${t('when')}** ${event.eventDate}
**${t('where')}** ${event.location}
**${t('closing')}** ${event.applicationClose}`;
}

function formatContent(event: Event) {
    return t('content', {
        eventName: event.name,
        eventClose: event.applicationCloseRemaining,
    });
}

function formatDryRunLog(description: string, content: string): string {
    return `DRY_RUN selected.
Posted event infos:
Description:
${description}
Content:
${content}`;
}

export default function postEvent(event: Event) {
    logger.info('Posting event to discord: ', event);
    const description = formatDiscordDescription(event);
    const content = formatContent(event);

    if (process.env.DRY_RUN) {
        logger.debug(formatDryRunLog(description, content));
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
