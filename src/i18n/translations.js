// @flow
import fs from 'fs';
import type {Language} from './index';

function getLanguageFromJson(filename: string): Language {
    return require(`../../translations/${filename}`);
}

function checkLanguage(language: Language): Array<string> {
    const i18nKeys = ['when', 'where', 'closing', 'content'];
    return i18nKeys.reduce((acc, k) => {
        if (!language.hasOwnProperty(k)) {
            return acc.concat([k]);
        } else {
            return acc;
        }
    }, []);
}

export function getTranslation(langCode: string): Language {
    const language = getLanguageFromJson(`${langCode}.json`);
    const missingKeys = checkLanguage(language);
    if (missingKeys.length > 0) {
        throw new Error(
            `${langCode}.json doesn't contain '${missingKeys.join(', ')}' key${
                missingKeys.length > 1 ? 's' : ''
            }`
        );
    }
    return language;
}

export function checkAllLanguages(): {[string]: Array<string>} {
    const files = fs.readdirSync('./translations');
    return files.reduce((acc, file) => {
        if (!file.match(/\.json$/)) {
            return acc;
        }
        const lang = getLanguageFromJson(file);
        return {
            ...acc,
            [file]: checkLanguage(lang),
        };
    }, {});
}
