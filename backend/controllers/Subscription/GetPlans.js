const db = require('../../config/db');

const GetPlans = (req, res) => {
  const sql = `
    SELECT 
        P.PLAN_ID,
        P.PLAN_CODE,
        P.PLAN_NAME,
        P.DESCRIPTION,
        P.PRICE,
        P.DURATION_DAYS,
        P.MAX_EMPLOYEES,
        F.FEATURE_TEXT,
        F.FEATURE_ORDER
    FROM GA_SUBSCRIPTION_PLANS P
    LEFT JOIN GA_SUBSCRIPTION_PLAN_FEATURES F
      ON P.PLAN_ID = F.PLAN_ID
    WHERE P.STATUS = 'A'
    ORDER BY P.PLAN_ID, F.FEATURE_ORDER;
  `;

  db.query(sql, (error, result) => {
    if (error) {
      console.log("Error occured", error);
      return res.status(500).json({ data: error });
    }

    // Group features by PLAN_ID
    const plansMap = new Map();
    result.forEach(row => {
      if (!plansMap.has(row.PLAN_ID)) {
        plansMap.set(row.PLAN_ID, {
          PLAN_ID: row.PLAN_ID,
          PLAN_CODE: row.PLAN_CODE,
          PLAN_NAME: row.PLAN_NAME,
          DESCRIPTION: row.DESCRIPTION,
          PRICE: row.PRICE,
          DURATION_DAYS: row.DURATION_DAYS,
          MAX_EMPLOYEES: row.MAX_EMPLOYEES,
          FEATURES: []
        });
      }
      if (row.FEATURE_TEXT) {
        plansMap.get(row.PLAN_ID).FEATURES.push(row.FEATURE_TEXT);
      }
    });

    const plans = Array.from(plansMap.values());

    return res.status(200).json({ data: plans });
  });
};

module.exports = { GetPlans };
