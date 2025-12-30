const schedule = require('node-schedule');
const { generateFutureWeeks } = require('../../controllers/Timesheets/generateFutureWeeks');

schedule.scheduleJob(
  { rule: '*/10 * * * * *', tz: 'Asia/Kolkata' }, // Sunday 10 PM
  async () => {
    try {
      console.log(' Weekly scheduler triggered');
      await generateFutureWeeks();
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }
);
