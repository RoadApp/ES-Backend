const express = require('express');

const server = express();
const bodyParser = require('body-parser');

server.listen(5000);
server.use(bodyParser.json());

module.exports = server;
