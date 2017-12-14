// @flow
import {translations} from './translations';

export type Language = {|
    closing: string,
    when: string,
    where: string,
    content: string,
|};

export type Translations = {[string]: Language};

function get(dict: {[string]: string}, key: string): string {
    return dict[key] || '';
}

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
    dicts: Translations,
): (
    language: string,
    key: $Keys<Language>,
    substitutions?: {[string]: string},
) => string {
    return (language, key, substitutions) => {
        const dict = dicts[language] || dicts.en;
        return interpolate(get(dict, key), substitutions);
    };
}

const translate = translator(translations);

export {translate};
