const http = require('http');
const { CronJob } = require('cron');
const app = require('./config/express')();

const mongoUri = process.env.MONGODB_URI;

require('./config/passport')();
require('./config/database')(mongoUri || 'mongodb://localhost/road');

const {
  utils: { notifications }
} = app;

const not1job = new CronJob({
  cronTime: '00 24 19 * * *',
  onTick: () => {
    notifications.sendNotification({
      template_id: notifications.templates.mileage,
      include_player_ids: ['4952210e-ddb9-421e-baaa-34bf92a58fa6']
    });
  },
  start: false,
  timeZone: 'America/Fortaleza'
});

not1job.start();

const port = app.get('port');

http.createServer(app).listen(port, () => {
  console.log(`Express Server listening on port ${port}`);
});
