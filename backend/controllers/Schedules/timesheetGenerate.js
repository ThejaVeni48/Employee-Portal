const schedule = require('node-schedule');
const { generateFutureWeeks } = require('../../controllers/Timesheets/generateFutureWeeks');

schedule.scheduleJob(
  { rule: '59 23 * * *', tz: 'Asia/Kolkata' }, // runs AT 11:59

  // HERE 59 DENOTES  MINUTES, 23 MEANS HOURS 
  async () => {
    try {
      console.log(' Weekly scheduler triggered');
      await generateFutureWeeks();
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }
);
