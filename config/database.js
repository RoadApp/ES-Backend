const mongoose = require('mongoose');

module.exports = (uri) => {
  const myDB = mongoose.connect(uri);

  const firstUser = async () => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const User = mongoose.model('User');
    try {
      const users = await User.find().exec();
      if (!users.length) {
        const newUser = new User();
        newUser.fullName = 'Admin Example';
        newUser.birthDate = new Date('1997-01-01');
        newUser.cnhExpiration = new Date('2019-01-01');
        newUser.email = 'admin@email.com';
        newUser.password = newUser.generateHash('eutenhoumviolaorosa');
        await newUser.save();
        console.log('First user created!');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  mongoose.connection.on('connected', () => {
    firstUser().then(() => {
      console.log(`Mongoose! Connected in ${uri}`);
    });
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

  return myDB;
};
