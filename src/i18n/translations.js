// @flow
import fs from 'fs';
import type {Translations} from './index';

const files = fs.readdirSync('./src/translations');
const i18nKeys = ['when', 'where', 'closing', 'content'];

export const translations: Translations = files.reduce((dict, file) => {
    const json = require(`../translations/${file}`);
    i18nKeys.forEach(k => {
        if (!json[k]) {
            throw new Error(`${file} doesn't contain '${k}' key`);
        }
    });
    const locale = file.split('.').shift();
    dict[locale] = json;
    return dict;
}, {});
