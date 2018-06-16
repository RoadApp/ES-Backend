const mongoose = require('mongoose');

module.exports = (uri) => {
  mongoose.connect(uri);

  const firstUser = () => {
    const User = mongoose.model('User');
    User.findOne({ email: 'italomlporoca@hotmail.com' }, (err, user) => {
      if (!user) {
        const newUser = new User();
        newUser.fullName = 'Italo Menezes';
        newUser.email = 'italomlporoca@hotmail.com';
        newUser.password = newUser.generateHash('123456');
        newUser.save((error) => {
          if (error) {
            console.log(error);
          } else {
            console.log('First user created!');
          }
        });
      }
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
