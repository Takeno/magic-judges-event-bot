// @flow
import config from '../../config.json';
import {translate} from '../i18n';
import type {Language} from '../i18n';

export default function t(
    key: $Keys<Language>,
    substitutions?: {[string]: string},
): string {
    return translate(config.language)(key, substitutions);
}
