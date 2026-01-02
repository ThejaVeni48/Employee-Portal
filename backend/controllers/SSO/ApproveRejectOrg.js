const db = require("../../config/db");
const moment = require("moment");
const { generatePassword } = require("../../helpers/functions");

const ApproveRejectOrg = (req, res) => {
  const { companyId, status, userId } = req.body;

  const today = moment().format("YYYY-MM-DD");
  const endDate = moment(today).add(30, "days").format("YYYY-MM-DD");
  const password = generatePassword();
  const system = "SYSTEM";

  db.beginTransaction((txErr) => {
    if (txErr) {
      return res.status(500).json({ message: "Transaction error", error: txErr });
    }

    /* ===================== APPROVE FLOW ===================== */
if (status === "A") {
  const approveOrgSql = `
    UPDATE TC_ORG_REGISTRATIONS
    SET STATUS = ?, PASSWORD = ?, APPROVED_DATE = ?, AUTHORIZED_BY = ?, ATTEMPTS_LOGIN = 0
    WHERE ORG_ID = ?
  `;

  db.query(
    approveOrgSql,
    ["A", password, today, userId, companyId],
    (err) => {
      if (err) return rollback(err);

      // ========================= FETCH PLAN COST =========================
      const fetchPlanCostSql = `
        SELECT P.PRICE, S.PLAN_ID,P.MAX_EMPLOYEES, S.ORG_SUBSCRIPTION_ID
        FROM TC_ORG_SUBSCRIPTIONS S
        JOIN GA_SUBSCRIPTION_PLANS P ON S.PLAN_ID = P.PLAN_ID
        WHERE S.ORG_ID = ?
      `;

      db.query(fetchPlanCostSql, [companyId], (err, planResult) => {
        if (err || planResult.length === 0)
          return rollback(err || "Plan not found");

        const { PRICE: planCost, PLAN_ID, ORG_SUBSCRIPTION_ID,MAX_EMPLOYEES:maxEmp } = planResult[0];

        console.log("PLANrESULT",planResult);
        

        // ========================= UPDATE SUBSCRIPTION WITH PLAN COST  =========================
        const updateSubscriptionSql = `
          UPDATE TC_ORG_SUBSCRIPTIONS
          SET START_DATE = ?, END_DATE = ?, STATUS = ?, PURCHASED_COST = ?, MAX_EMPLOYEES = ?,LAST_UPDATED_BY = ?
          WHERE ORG_ID = ?
        `;

        db.query(
          updateSubscriptionSql,
          [today, endDate, "A", planCost,maxEmp,  userId, companyId],
          (err, updateResult) => {
            if (err || updateResult.affectedRows === 0)
              return rollback(err || "Subscription update failed");

            // ========================= INSERT SUBSCRIPTION HISTORY =========================
            const insertHistorySql = `
              INSERT INTO TC_ORG_SUBSCRIPTION_HISTORY
              (ORG_SUBSCRIPTION_ID, ORG_ID, PLAN_ID, START_DATE, END_DATE, STATUS, PURCHASED_COST,MAX_EMPLOYEES, CREATED_BY)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)
            `;

            db.query(
              insertHistorySql,
              [
                ORG_SUBSCRIPTION_ID,
                companyId,
                PLAN_ID,
                today,
                endDate,
                "A",
                planCost,
                maxEmp,
                userId,
              ],
              (err) => {
                if (err) return rollback(err);

                insertOrgMasters(); 
              }
            );
          }
        );
      });
    }
  );
}


    /* ===================== REJECT FLOW ===================== */
    else if (status === "R") {
      const rejectSql = `
        UPDATE TC_ORG_REGISTRATIONS
        SET STATUS = ?, APPROVED_DATE = ?, AUTHORIZED_BY = ?
        WHERE ORG_ID = ?
      `;

      db.query(rejectSql, ["R", today, userId, companyId], (err, result) => {
        if (err) return rollback(err);

        db.commit(() => {
          res.status(200).json({
            message: "Organization rejected successfully",
            data: result,
          });
        });
      });
    }

    /* ===================== INSERT MASTER DATA ===================== */
    function insertOrgMasters() {
      const rolesSql = `
        INSERT INTO TC_ORG_ROLES
        (ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, CREATED_BY, CREATION_DATE, ORG_ID)
        SELECT ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, ?, ?, ?
        FROM GA_ROLES
      `;

      db.query(rolesSql, [system, today, companyId], (err) => {
        if (err) return rollback(err);

        const desgnSql = `
          INSERT INTO TC_ORG_DESIGNATIONS
          (DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS, ROLE_ID, CREATED_BY, CREATION_DATE, ORG_ID)
          SELECT DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS, ROLE_ID, ?, ?, ?
          FROM GA_DESIGNATIONS
        `;

        db.query(desgnSql, [system, today, companyId], (err) => {
          if (err) return rollback(err);

          const accessSql = `
            INSERT INTO TC_ORG_ACCESS
            (ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, CREATED_BY, CREATION_DATE, ORG_ID)
            SELECT ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, ?, ?, ?
            FROM GA_ACCESS_CONTROL
          `;

          db.query(accessSql, [system, today, companyId], (err) => {
            if (err) return rollback(err);

            const leavesSql = `
              INSERT INTO TC_ORG_LEAVES
              (LEAVE_TYPE, LEAVE_CODE, LEAVE_DESC, LEAVE_STATUS, CREATED_BY, CREATION_DATE, ORG_ID)
              SELECT LEAVE_TYPE, LEAVE_CODE, LEAVE_DESC, LEAVE_STATUS, ?, ?, ?
              FROM GA_LEAVES
            `;

            db.query(leavesSql, [system, today, companyId], (err) => {
              if (err) return rollback(err);

              db.commit(() => {
                res.status(200).json({
                  message: "Organization approved and activated successfully",
                });
              });
            });
          });
        });
      });
    }

    /* ===================== ROLLBACK ===================== */
    function rollback(error) {
      db.rollback(() => {
        console.error("Transaction failed:", error);
        res.status(500).json({
          message: "Approval process failed",
          error,
        });
      });
    }
  });
};

module.exports = { ApproveRejectOrg };
