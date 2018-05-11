var server = require('./config/serverConfig.js');

server.get('/', function (req, res) {
   console.log('server check');
   res.json({"message": "Server On"});
});