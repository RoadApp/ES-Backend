const mongoose = require('mongoose');

module.exports = (uri) => {
  mongoose.connect(uri);

  const firstUser = () => {
    const User = mongoose.model('User');
    User.find()
      .exec()
      .then((users) => {
        if (!users.length) {
          User.findOne({ email: 'admin@email.com' }, (err, user) => {
            if (!user) {
              const newUser = new User();
              newUser.fullName = 'Admin Example';
              newUser.birthDate = new Date('1997-01-01');
              newUser.cnhExpiration = new Date('2019-01-01');
              newUser.email = 'admin@email.com';
              newUser.password = newUser.generateHash('eutenhoumviolaorosa');
              newUser.save((error) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log('First user created!');
                }
              });
            }
          });
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose! Connected in ${uri}`);
    firstUser();
  });

  mongoose.connection.on('disconnected', () => {
    console.log(`Mongoose! Disconnected from ${uri}`);
  });

  mongoose.connection.on('error', (error) => {
    console.log(`Mongoose! Connection Error: ${error}`);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose! Disconnected by application termination');
      process.exit(0);
    });
  });
};
