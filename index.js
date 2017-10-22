import bot from './bot';
import {close as closeDb} from './databases';

bot().then(closeDb);
