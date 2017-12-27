// @flow
import {checkAllLanguages} from '../src/i18n/translations';

const missingKeys = checkAllLanguages();
const errorMessages = Object.keys(missingKeys)
    .filter(
        // $FlowFixMe not sure why flow should infer that file is string | void
        file => missingKeys[file].length > 0
    )
    .map(
        file =>
            `${file} doesn't contain '${missingKeys[file].join(', ')}' key${
                missingKeys[file].length > 1 ? 's' : ''
            }`
    );

if (errorMessages.length > 0) {
    throw new Error(errorMessages.join(', '));
}
