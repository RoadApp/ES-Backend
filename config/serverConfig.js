var express = require('express');
var server = module.exports = express();
var bodyParser = require('body-parser');

server.listen(5000);
server.use(bodyParser.json());
