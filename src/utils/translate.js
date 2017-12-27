// @flow
import config from '../../config.json';
import {translate} from '../i18n';
import {getTranslation} from '../i18n/translations';
import type {Language, Substitutions} from '../i18n';

const lang = getTranslation(config.language);
const translator = translate(lang);

export function t(key: $Keys<Language>, substitutions?: Substitutions): string {
    return translator(key, substitutions);
}
