const schedule = require('node-schedule');

const runWeeklyJob = () => {
  console.log('Job running at:', new Date().toLocaleTimeString());
};

// Run every 10 seconds
const job = schedule.scheduleJob('*/10 * * * * *', runWeeklyJob);

// Stop after 1 minute
setTimeout(() => {
  job.cancel();
  console.log('Job stopped after 1 minute');
}, 60 * 1000);
