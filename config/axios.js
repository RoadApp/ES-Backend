// may be invalid after deploy
const ONESIGNAL_KEY =
  process.env.ONESIGNAL_REST_API_KEY ||
  'ZDQyOWUwMTctNmNlMi00MTI4LTg0NzctYmMxZDA4NWQyNGEy';

const axios = require('axios').create({
  baseURL: 'https://onesignal.com/api/v1/notifications',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Basic ${ONESIGNAL_KEY}`
  }
});

module.exports = axios;
