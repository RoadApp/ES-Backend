const http = require('http');
const app = require('./config/express')();
require('./config/passport')();
require('./config/database')('mongodb://localhost/road');

const port = app.get('port');

http.createServer(app).listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});
