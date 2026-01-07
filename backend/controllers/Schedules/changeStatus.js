const schedule = require('node-schedule');
const { checkStatus } = require('../Login/checkStatus');

schedule.scheduleJob(
  { rule: '59 23 * * *', tz: 'Asia/Kolkata' }, // runs AT 11:59

  async () => {
    try {
      console.log(' Weekly scheduler triggered');
    // window.alert("triggering change Sttus")
      await checkStatus();
    } catch (err) {
      console.error('Scheduler error:', err);
    }
  }
);




