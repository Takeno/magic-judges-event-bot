// @flow
import request from 'request-promise';
import logger from '../utils/logger';
import parseEventsPage from './event-page-parser';
import type {ConfigurationInput, Events} from './types.js.flow';

// events type
export const Types = {
    BAZAAR_OF_MOXEN: 20,
    GRAND_PRIX: 2,
    GRAND_PRIX_TRIAL: 16,
    JUDGE_CONFERENCE: 11,
    MKM_SERIES: 22,
    NATIONALS: 12,
    OTHERS: 13,
    PPTQ: 17,
    PRERELEASE: 6,
    PRO_TOUR: 1,
    PTQ: 3,
    RPTQ: 18,
    STARCITYGAMES_OPEN_SERIES: 9,
    STARCITYGAMES_TOUR: 21,
    TCGPLAYER_DIAMOND_OPEN: 19,
    WMCQ: 15,
    Worlds: 10,
};

// events nation
export const Countries = {
    AUSTRALIA_NEW_ZEALAND: 24,
    BENELUX: 12,
    BRASILE: 11,
    CANADA: 1,
    CINA: 21,
    EUROPE_CENTRAL: 25,
    EUROPE_EAST: 14,
    EUROPE_NORTH: 15,
    FRANCIA: 16,
    GERMAN_COUNTRIES: 13,
    HISPANIC_AMERICA_NORTH: 29,
    HISPANIC_AMERICA_SOUTH: 10,
    IBERIA: 19,
    ITALY_AND_MALTA: 17,
    GIAPPONE: 22,
    NESSUNO: 26,
    RUSSIAN_COUNTRIES: 18,
    SOUTHEAST_ASIA: 23,
    UK_IRELAND_SOUTH_AFRICA: 20,
    USA_CENTRAL: 4,
    USA_GREAT_LAKES: 28,
    USA_MIDATLANTIC: 8,
    USA_NORTH: 27,
    USA_NORTHEAST: 7,
    USA_NORTHWEST: 2,
    USA_SOUTH: 6,
    USA_SOUTHEAST: 9,
    USA_SOUTHWEST: 3,
};

export default function fetchEvents(
    types: Array<number> = [],
    countries: Array<number> = []
): Promise<Events> {
    const ENDPOINT = 'https://apps.magicjudges.org/events/';

    let query = [];
    query = types.filter(t => !!t).map(type => `filter_type=${type}`);
    query = query.concat(countries.map(country => `filter_region=${country}`));

    const querystring = query.join('&');

    logger.info(`Requesting ${ENDPOINT}?${querystring}`);

    return request(`${ENDPOINT}?${querystring}`).then(body =>
        parseEventsPage(body)
    );
}

export function configToEvents(
    data: Array<ConfigurationInput>
): Array<Promise<Events>> {
    return data.map(({types = [], countries = []}) => {
        return fetchEvents(
            types.map(k => {
                if (!Types[k]) {
                    throw new Error('Unkown type ' + k);
                }
                return Types[k];
            }),
            countries.map(k => {
                if (!Countries[k]) {
                    throw new Error('Unkown country ' + k);
                }
                return Countries[k];
            })
        );
    });
}
