require('dotenv').config();
const development = require('./development');
const production = require('./production');

const config = {
  development,
  production,
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
