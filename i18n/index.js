// @flow
import en from './en';
import it from './it';

export type Language = {|
    closing?: string,
    when?: string,
    where?: string,
|};

const translations = {
    en,
    it,
};

function translator(
    dicts: $Exact<typeof translations>,
): (
    language: string,
) => (key: $Keys<Language>, defaultMessage: string) => string {
    return language => (key, defaultMessage) =>
        (dicts[language] && dicts[language][key]) || defaultMessage;
}

const translate = translator(translations);

export {translate};
