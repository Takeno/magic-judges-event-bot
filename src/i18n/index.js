// @flow
export type Language = {|
    closing: string,
    when: string,
    where: string,
    content: string,
|};

export type Substitutions = {[string]: string};

// Cheers to Polyglot.js for this interpolation function
// https://github.com/airbnb/polyglot.js/blob/master/index.js
function interpolate(phrase: string, substitutions: ?Substitutions): string {
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

function translate(
    language: Language,
): (key: $Keys<Language>, substitutions?: Substitutions) => string {
    return (key, substitutions) => interpolate(language[key], substitutions);
}

export {translate};
