const http = require('http');
const app = require('./config/express')();
require('./config/database')('mongodb://localhost/esbackend');

const port = app.get('port');

http.createServer(app)
  .listen(port, () => {
    console.log(`Express Server listening on port ${port}`);
  });
