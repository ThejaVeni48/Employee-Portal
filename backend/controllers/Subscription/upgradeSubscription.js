const db = require('../../config/db')

const upgradeSubscription = (req, res) => {
  const { orgId, newPlanId,email } = req.body;

  if (!orgId || !newPlanId ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // 1️⃣ Fetch current active subscription
    const getActiveSql = `
      SELECT *
      FROM TC_ORG_SUBSCRIPTIONS
      WHERE ORG_ID = ?
        AND STATUS = 'A'
      ORDER BY ORG_SUBSCRIPTION_ID DESC
      LIMIT 1
    `;

    db.query(getActiveSql, [orgId], (err, activeResult) => {
      if (err || activeResult.length === 0)
        return rollback(err || "No active subscription");

      const oldSub = activeResult[0];

      // 2️⃣ Get new plan details
      const planSql = `
        SELECT *
        FROM GA_SUBSCRIPTION_PLANS
        WHERE PLAN_ID = ?
          AND STATUS = 'A'
      `;

      db.query(planSql, [newPlanId], (err, planResult) => {
        if (err || planResult.length === 0)
          return rollback(err || "Plan not found");

        const plan = planResult[0];

        const today = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.DURATION_DAYS);

        // 3️⃣ Inactivate old subscription
        const inactivateSql = `
          UPDATE TC_ORG_SUBSCRIPTIONS
          SET STATUS = 'I',
              LAST_UPDATED_BY = ?
          WHERE ORG_SUBSCRIPTION_ID = ?
        `;

        db.query(inactivateSql, [email, oldSub.ORG_SUBSCRIPTION_ID], (err) => {
          if (err) return rollback(err);

          // 4️⃣ Insert new subscription
          const insertSql = `
            INSERT INTO TC_ORG_SUBSCRIPTIONS
            (ORG_ID, PLAN_ID, START_DATE, END_DATE, STATUS, PURCHASED_COST, MAX_EMPLOYEES,CREATED_BY)
            VALUES (?, ?, ?, ?, 'A', ?, ?,?)
          `;

          db.query(
            insertSql,
            [orgId, newPlanId, today, endDate, plan.PRICE,plan.MAX_EMPLOYEES, email],
            (err, result) => {
              if (err) return rollback(err);

              // 5️⃣ Insert history
              const historySql = `
                INSERT INTO TC_ORG_SUBSCRIPTION_HISTORY
                (ORG_SUBSCRIPTION_ID, ORG_ID, PLAN_ID, START_DATE, END_DATE, STATUS, PURCHASED_COST, CREATED_BY)
                VALUES (?, ?, ?, ?, ?, 'A', ?, ?)
              `;

              db.query(
                historySql,
                [
                  result.insertId,
                  orgId,
                  newPlanId,
                  today,
                  endDate,
                  plan.PRICE,
                  email,
                ],
                (err) => {
                  if (err) return rollback(err);

                  db.commit(() => {
                    res.status(200).json({
                      message: "Subscription upgraded successfully",
                    });
                  });
                }
              );
            }
          );
        });
      });
    });

    function rollback(error) {
      db.rollback(() => {
        console.error(error);
        res.status(500).json({ message: "Upgrade failed" });
      });
    }
  });
};

module.exports = { upgradeSubscription };
