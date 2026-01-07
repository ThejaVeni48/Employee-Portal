const db = require('../../config/db');
const moment = require('moment');

// Wrap db.query in a Promise
const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const checkStatus = async () => {
  console.log("Triggering checkStatus...");

  try {
    // Get all active subscriptions
    const subscriptions = await queryAsync(
      `SELECT ORG_ID, END_DATE FROM TC_ORG_SUBSCRIPTIONS WHERE STATUS = 'A'`
    );

    const currentDate = moment();

    // Loop through each subscription
    for (const sub of subscriptions) {
      const endDate = moment(sub.END_DATE, "YYYY-MM-DD");

      if (currentDate.isAfter(endDate)) {
        console.log(`Subscription ended for ORG_ID: ${sub.ORG_ID}, updating status...`);

        await queryAsync(
          `UPDATE TC_ORG_SUBSCRIPTIONS SET STATUS = 'I' WHERE ORG_ID = ? AND STATUS = 'A'`,
          [sub.ORG_ID]
        );

        console.log(`Updated subscription status to inactive for ORG_ID: ${sub.ORG_ID}`);
      }
    }
  } catch (error) {
    console.error("Error in checkStatus:", error);
  }
};

module.exports = { checkStatus };
