// @flow
import en from './en';
import it from './it';

export type Language = {|
    closing?: string,
    when?: string,
    where?: string,
    content?: string,
|};

const translations = {
    en,
    it,
};

// Cheers to Polyglot.js for this interpolation function
// https://github.com/airbnb/polyglot.js/blob/master/index.js
function interpolate(
    phrase: string,
    substitutions: ?{[key: string]: string},
): string {
    if (!substitutions) {
        return phrase;
    }
    const dollarRegex = /\$/g;
    const dollarBillsYall = '$$';
    const tokenRegex = /%\{(.*?)\}/g;
    const replace = String.prototype.replace;
    return replace.call(
        phrase,
        tokenRegex,
        (expression: string, argument: string): string => {
            if (
                !substitutions ||
                !substitutions[argument] ||
                substitutions[argument] == null
            ) {
                return expression;
            }
            return replace.call(
                substitutions[argument],
                dollarRegex,
                dollarBillsYall,
            );
        },
    );
}

function translator(
    dicts: $Exact<typeof translations>,
    interpolate: typeof interpolate,
): (
    language: string,
) => (
    key: $Keys<Language>,
    defaultMessage: string,
    substitutions: ?{[key: string]: string},
) => string {
    return language => (key, defaultMessage, substitutions) =>
        (dicts[language] &&
            dicts[language][key] &&
            interpolate(dicts[language][key], substitutions)) ||
        defaultMessage;
}

const translate = translator(translations, interpolate);

export {translate};
