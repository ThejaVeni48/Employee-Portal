const db = require("../../../config/db");

const getBranchHolidays = (req, res) => {
  const { orgId, branchId } = req.query;


  console.log("orgId",orgId);
  console.log("branchId",branchId);
  

  if (!orgId || !branchId) {
    return res.status(400).json({
      message: "orgId and branchId are required",
    });
  }

  const sql = `
    SELECT
      hol_id,
      hol_no,
      org_id,
      hol_name,
      hol_code,
      year,
      start_date,
      end_date,
      CREATION_DATE,
      CREATED_BY,
      LAST_UPDATED_BY,
      LAST_UPDATED_DATE
    FROM TC_BRANCH_HOLIDAYS
    WHERE org_id = ?
      AND branch_id = ?
    ORDER BY start_date ASC
  `;

  db.query(sql, [orgId, branchId], (err, rows) => {
    if (err) {
      console.error("Get branch holidays error:", err);
      return res.status(500).json({
        message: "Failed to fetch holidays",
      });
    }

    return res.status(200).json({
      data: rows,
    });
  });
};

module.exports = { getBranchHolidays };
