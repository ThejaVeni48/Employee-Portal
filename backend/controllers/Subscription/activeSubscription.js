const db = require('../../config/db');

const activeSubscription = (req, res) => {
  const { orgId } = req.query;

  if (!orgId) {
    return res.status(400).json({
      message: "orgId is required"
    });
  }

  const sql = `
    SELECT 
      *
    FROM TC_ORG_SUBSCRIPTIONS
    WHERE ORG_ID = ?
    ORDER BY ORG_SUBSCRIPTION_ID DESC
    LIMIT 1
  `;

  db.query(sql, [orgId], (err, result) => {
    if (err) {
      console.error("Subscription fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "No subscription found for this organization"
      });
    }

    const subscription = result[0];

    const today = new Date();
    const endDate = new Date(subscription.END_DATE);

    // Expired subscription check
    if (subscription.STATUS !== 'A' || today > endDate) {
      return res.status(403).json({
        status: "EXPIRED",
        message: "Your subscription has expired. Please upgrade.",
        data: subscription
      });
    }

    // Active subscription
    return res.status(200).json({
      status: "ACTIVE",
      message: "Active subscription found",
      data: subscription
    });
  });
};

module.exports = { activeSubscription };
