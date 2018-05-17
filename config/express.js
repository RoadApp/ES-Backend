const express = require('express');
const load = require('express-load');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const server = express();

server.listen(5000);
server.use(bodyParser.json());

module.exports = () => {
  const app = express();

  app.set('port', process.env.PORT || 3000);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(helmet());

  load('models', { cwd: 'app' })
    .then('controllers')
    .then('routes')
    .into(app);

  return app;
};
