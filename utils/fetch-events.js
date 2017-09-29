import request from 'request-promise';
import parseEventsPage from './event-page-parser';

// events type
export const BAZAAR_OF_MOXEN = 20;
export const GRAND_PRIX = 2;
export const GRAND_PRIX_TRIAL = 16;
export const JUDGE_CONFERENCE = 11;
export const MKM_SERIES = 22;
export const NATIONALS = 12;
export const OTHERS = 13;
export const PPTQ = 17;
export const PRERELEASE = 6;
export const PRO_TOUR = 1;
export const PTQ = 3;
export const RPTQ = 18;
export const STARCITYGAMES_OPEN_SERIES = 9;
export const STARCITYGAMES_TOUR = 21;
export const TCGPLAYER_DIAMOND_OPEN = 19;
export const WMCQ = 15;
export const Worlds = 10;

// events nation
export const AUSTRALIA_NEW_ZEALAND = 24;
export const BENELUX = 12;
export const BRASILE = 11;
export const CANADA = 1;
export const CINA = 21;
export const EUROPE_CENTRAL = 25;
export const EUROPE_EAST = 14;
export const EUROPE_NORTH = 15;
export const FRANCIA = 16;
export const GERMAN_COUNTRIES = 13;
export const HISPANIC_AMERICA_NORTH = 29;
export const HISPANIC_AMERICA_SOUTH = 10;
export const IBERIA = 19;
export const ITALY_AND_MALTA = 17;
export const GIAPPONE = 22;
export const NESSUNO = 26;
export const RUSSIAN_COUNTRIES = 18;
export const SOUTHEAST_ASIA = 23;
export const UK_IRELAND_SOUTH_AFRICA = 20;
export const USA_CENTRAL = 4;
export const USA_GREAT_LAKES = 28;
export const USA_MIDATLANTIC = 8;
export const USA_NORTH = 27;
export const USA_NORTHEAST = 7;
export const USA_NORTHWEST = 2;
export const USA_SOUTH = 6;
export const USA_SOUTHEAST = 9;
export const USA_SOUTHWEST = 3;

export default function fetchEvents(types = [], countries = []) {
    const ENDPOINT = 'https://apps.magicjudges.org/events/';

    let query = [];
    query = types.map(type => `filter_type=${type}`);
    query = query.concat(countries.map(country => `filter_region=${country}`));

    const querystring = query.join('&');

    return request(`${ENDPOINT}?${querystring}`).then(body => parseEventsPage(body));
}
