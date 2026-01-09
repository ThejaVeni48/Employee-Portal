const db = require("../../config/db");
const moment = require("moment");
const { generatePassword } = require("../../helpers/functions");

const ApproveRejectOrg = (req, res) => {
  const { companyId, status, userId } = req.body;

  const today = moment().format("YYYY-MM-DD");
  const endDate = moment(today).add(30, "days").format("YYYY-MM-DD");
  const password = generatePassword();
  const system = "SYSTEM";

  db.beginTransaction(err => {
    if (err) return res.status(500).json(err);

    if (status !== "A") return rejectOrg();

    approveOrg();

    /* ================= APPROVE ================= */
    function approveOrg() {
      const sql = `
        UPDATE TC_ORG_REGISTRATIONS
        SET STATUS='A', PASSWORD=?, APPROVED_DATE=?, AUTHORIZED_BY=?, ATTEMPTS_LOGIN=0
        WHERE ORG_ID=?
      `;
      db.query(sql, [password, today, userId, companyId], err => {
        if (err) return rollback(err);
        updateSubscription();
      });
    }

    function updateSubscription() {
      const sql = `
        SELECT S.ORG_SUBSCRIPTION_ID, S.PLAN_ID, P.PRICE, P.MAX_EMPLOYEES
        FROM TC_ORG_SUBSCRIPTIONS S
        JOIN GA_SUBSCRIPTION_PLANS P ON S.PLAN_ID=P.PLAN_ID
        WHERE S.ORG_ID=? LIMIT 1
      `;
      db.query(sql, [companyId], (err, r) => {
        if (err || !r.length) return rollback("Subscription not found");

        const { ORG_SUBSCRIPTION_ID, PLAN_ID, PRICE, MAX_EMPLOYEES } = r[0];

        const upd = `
          UPDATE TC_ORG_SUBSCRIPTIONS
          SET START_DATE=?, END_DATE=?, STATUS='A',
              PURCHASED_COST=?, MAX_EMPLOYEES=?, LAST_UPDATED_BY=?
          WHERE ORG_SUBSCRIPTION_ID=?
        `;
        db.query(upd,
          [today, endDate, PRICE, MAX_EMPLOYEES, userId, ORG_SUBSCRIPTION_ID],
          err => {
            if (err) return rollback(err);
            insertRoles();
          }
        );
      });
    }

    /* ================= ROLES ================= */
    function insertRoles() {
      const sql = `
        INSERT INTO TC_ORG_ROLES
        (ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, CREATED_BY, CREATION_DATE, ORG_ID)
        SELECT ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, ?, ?, ?
        FROM GA_ROLES
      `;
      db.query(sql, [system, today, companyId], err => {
        if (err) return rollback(err);
        insertDesignations();
      });
    }

    /* ================= DESIGNATIONS ================= */
    function insertDesignations() {
      const sql = `
        SELECT D.DESGN_NAME, D.DESGN_DESC, D.DESGN_CODE, D.DESGN_STATUS, R.ROLE_CODE
        FROM GA_DESIGNATIONS D
        JOIN GA_ROLES R ON R.ROLE_ID = D.ROLE_ID
      `;
      db.query(sql, (err, rows) => {
        if (err) return rollback(err);

        db.query(
          `SELECT ROLE_ID, ROLE_CODE FROM TC_ORG_ROLES WHERE ORG_ID=?`,
          [companyId],
          (err, orgRoles) => {
            if (err) return rollback(err);

            const roleMap = {};
            orgRoles.forEach(r => roleMap[r.ROLE_CODE] = r.ROLE_ID);

            const values = rows
              .map(d => {
                const roleId = roleMap[d.ROLE_CODE];
                if (!roleId) return null;
                return [
                  d.DESGN_NAME,
                  d.DESGN_DESC,
                  d.DESGN_CODE,
                  d.DESGN_STATUS,
                  roleId,
                  system,
                  today,
                  companyId
                ];
              })
              .filter(Boolean);

            if (!values.length) return rollback("No designations to insert");

            const insertSql = `
              INSERT INTO TC_ORG_DESIGNATIONS
              (DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS,
               ROLE_ID, CREATED_BY, CREATION_DATE, ORG_ID)
              VALUES ?
            `;
            db.query(insertSql, [values], err => {
              if (err) return rollback(err);
              insertAccess();
            });
          }
        );
      });
    }

    /* ================= ACCESS ================= */
    function insertAccess() {
      const sql = `
        INSERT INTO TC_ORG_ACCESS
        (ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, CREATED_BY, CREATION_DATE, ORG_ID)
        SELECT ACCESS_NAME, ACCESS_DESC, ACCESS_CODE, STATUS, ?, ?, ?
        FROM GA_ACCESS_CONTROL
      `;
      db.query(sql, [system, today, companyId], err => {
        if (err) return rollback(err);
        insertLeaves();
      });
    }

    /* ================= LEAVES ================= */
    function insertLeaves() {
      const sql = `
        INSERT INTO TC_ORG_LEAVE_TYPES
        (LEAVE_TYPE, LEAVE_CODE, LEAVE_STATUS, CREATED_BY, CREATION_DATE, ORG_ID)
        SELECT LEAVE_TYPE, LEAVE_CODE, LEAVE_STATUS, ?, ?, ?
        FROM GA_LEAVES
      `;
      db.query(sql, [system, today, companyId], err => {
        if (err) return rollback(err);
        insertShifts();
      });
    }

    /* ================= SHIFTS ================= */
    function insertShifts() {
      const sql = `
        INSERT INTO TC_SHIFTS
        (SHIFT_NAME, SHIFT_TYPE, SHIFT_CODE, CREATED_BY, ORG_ID)
        SELECT SHIFT_NAME, SHIFT_TYPE, SHIFT_CODE, ?, ?
        FROM GA_SHIFTS
      `;
      db.query(sql, [system, companyId], err => {
        if (err) return rollback(err);
        commitSuccess();
      });
    }

    /* ================= REJECT ================= */
    function rejectOrg() {
      const sql = `
        UPDATE TC_ORG_REGISTRATIONS
        SET STATUS='R', APPROVED_DATE=?, AUTHORIZED_BY=?
        WHERE ORG_ID=?
      `;
      db.query(sql, [today, userId, companyId], err => {
        if (err) return rollback(err);
        commitSuccess("Organization rejected successfully");
      });
    }

    /* ================= FINAL ================= */
    function commitSuccess(msg = "Organization approved and activated successfully") {
      db.commit(() => {
        res.status(200).json({ message: msg });
      });
    }

    function rollback(error) {
      db.rollback(() => {
        console.error(error);
        res.status(500).json({
          message: "Approval process failed",
          error: error?.sqlMessage || error
        });
      });
    }
  });
};

module.exports = { ApproveRejectOrg };
