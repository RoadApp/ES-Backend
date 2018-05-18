const firebaseAdmin = require('firebase-admin');

const auth = firebaseAdmin.auth();

exports.getUid = function (idToken, callback) {
  auth.verifyIdToken(idToken).then((decodedToken) => {
    const uid = decodedToken.uid;
    callback(null, uid);
  }).catch((error) => {
    console.log(error);
    const err = new Error('Authentication Error: invalid token');
    err.status = 400;
    callback(err);
  });
};

exports.getUserRecordById = function (uid, callback) {
  auth.getUser(uid).then((userRecord) => {
    callback(null, userRecord);
  }).catch((error) => {
    console.log(error);
    const err = new Error('Authentication Error: User not found');
    err.status = 400;
    callback(err);
  });
};

exports.blockUser = function (uid, callback) {
  auth.updateUser(uid, {
    disabled: true
  }).then((userRecord) => {
    callback(null, userRecord);
  }).catch((error) => {
    error.status = 400;
    callback(error);
  });
};

exports.unBlockUser = function (uid, callback) {
  auth.updateUser(uid, {
    disabled: false
  }).then((userRecord) => {
    callback(null, userRecord);
  }).catch((error) => {
    error.status = 400;
    callback(error);
  });
};


exports.createFirebaseUser = function (name, email, password, callback) {
  auth.createUser({
    email,
    emailVerified: false,
    password,
    displayName: name,
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false
  })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      callback(null, userRecord.uid);
    }).catch((error) => {
      console.log('Error creating new user:', error);
      error.status = 400;
      callback(error);
    });
};

exports.updateFirebaseUser = function (uid, toUpdate, callback) {
  auth.updateUser(uid, toUpdate).then((userRecord) => {
    callback(null, userRecord);
  }).catch((error) => {
    console.log(error);
    const err = new Error('Register Error. FirebaseUpdate Error');
    err.status = 400;
    console.log(err.message);
    callback(err);
  });
};

exports.deleteFirebaseUser = function (uid, callback) {
  auth.deleteUser(uid).then(() => {
    callback(null, 'ok');
  }).catch((error) => {
    error.status = 400;
    callback(error);
  });
};
