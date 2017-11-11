// @flow
import type {Database} from '../utils/types.js.flow';

let db: Database;
if (process.env.DB === 'redis') {
    db = require('./redis');
} else {
    db = require('./lowdb');
}

module.exports = db;
