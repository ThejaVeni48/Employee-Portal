const schedule = require('node-schedule');
const db = require('../../config/db');

const runWeeklyJob = () => {
  console.log('Weekly job running at Sunday 10 PM');
  // DB logic here
};

schedule.scheduleJob(
  { rule: '2 0 0 * * 0', tz: 'Asia/Kolkata' },
  runWeeklyJob
);

module.exports = { runWeeklyJob };
