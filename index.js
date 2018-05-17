const server = require('./config/express');

server.get('/', (req, res) => {
  console.log('server check');
  res.json({ message: 'Server On' });
});
