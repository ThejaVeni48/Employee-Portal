const schedule = require('node-schedule');
const { generateFutureWeeks } = require('../../controllers/Timesheets/generateFutureWeeks');

schedule.scheduleJob(
  {  rule: '*/3 * * * *', tz: 'Asia/Kolkata' } , // runs for every 10 minutes
  async () => {
    try {
      console.log(' Weekly scheduler triggered');
      await generateFutureWeeks();
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }
);
