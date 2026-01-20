const db = require('../../config/db');

const GetPlans = (req, res) => {
  const { orgId } = req.query;

  console.log("orgId",orgId);
  

  const subscriptionSql = `
    SELECT P.PLAN_ID, P.PRICE
    FROM TC_ORG_SUBSCRIPTIONS S
    JOIN GA_SUBSCRIPTION_PLANS P 
      ON S.PLAN_ID = P.PLAN_ID
    WHERE S.ORG_ID = ?
      AND S.STATUS = 'A'
    ORDER BY S.ORG_SUBSCRIPTION_ID DESC
    LIMIT 1
  `;

  db.query(subscriptionSql, [orgId], (subErr, subResult) => {
    if (subErr) {
      return res.status(500).json({ message: "Subscription check failed" });
    }

    let condition = `P.STATUS = 'A'`;

    // 👉 If active FREE plan exists → hide free plan
    if (subResult.length > 0) {
      condition += ` AND P.PRICE > 0`;
    }

    const plansSql = `
      SELECT 
        P.PLAN_ID,
        P.PLAN_CODE,
        P.PLAN_NAME,
        P.DESCRIPTION,
        P.PRICE,
        P.DURATION_DAYS,
        P.MAX_EMPLOYEES,
        F.FEATURE_TEXT
      FROM GA_SUBSCRIPTION_PLANS P
      LEFT JOIN GA_SUBSCRIPTION_PLAN_FEATURES F
        ON P.PLAN_ID = F.PLAN_ID
      WHERE ${condition}
      ORDER BY P.PLAN_ID
    `;

    db.query(plansSql, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Plans fetch failed" });
      }

      // ✅ GROUP FEATURES USING MAP
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

      return res.status(200).json({
        data: Array.from(plansMap.values())
      });
    });
  });
};

module.exports = { GetPlans };
