if (process.env.DB === 'redis') {
    module.exports = require('./redis');
} else {
    module.exports = require('./lowdb');
}
