// @flow
import type {Language} from './index';

const it: Language = {
    when: 'Quando:',
    where: 'Dove:',
    closing: 'Chiusura application:',
    content:
        "È aperta l'application per **%{eventName}**! Chiuderà tra: *%{eventClose}*",
};

export default it;
