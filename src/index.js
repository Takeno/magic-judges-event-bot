import bot from './bot';
import {close as closeDb} from './databases';
import logger from './utils/logger';

logger.info('Start bot');

bot().then(closeDb);
