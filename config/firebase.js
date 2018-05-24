const admin = require('firebase-admin');

// eslint-disable-next-line max-len
const serviceAccount = require('./road-a37bb-firebase-adminsdk-54lyc-1d147f088a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = () => admin;
