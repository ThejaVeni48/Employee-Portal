


const db =require('../../../config/db');



const createBranchHolidays = (req, res) => {
  const {
    orgId,
    holName,
    holCode,
    year,
    branchId,
    startDate,
    endDate,
    email,
  } = req.body;

  if (!orgId || !holName || !holCode || !startDate) {
    return res.status(400).json({
      message: "orgId, holName, holCode, startDate are required",
    });
  }

  const holidayYear =
    year || new Date(startDate).getFullYear();

  // 🔍 Duplicate holiday code check per org + year
  const dupSql = `
    SELECT hol_id
    FROM TC_BRANCH_HOLIDAYS
    WHERE org_id = ? AND hol_code = ? AND year = ?
  `;

  db.query(
    dupSql,
    [orgId, holCode, holidayYear],
    (dupErr, existing) => {
      if (dupErr) {
        console.error(dupErr);
        return res.status(500).json({
          message: "Duplicate check failed",
        });
      }

      if (existing.length > 0) {
        return res.status(409).json({
          message: "Holiday code already exists for this year",
        });
      }

      // ✅ Insert holiday
      const insertSql = `
        INSERT INTO TC_BRANCH_HOLIDAYS
        (
          org_id,
          hol_name,
          hol_code,
          year,
          branch_id,
          start_date,
          end_date,
          CREATED_BY
        )
        VALUES (?, ?, ?,?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          orgId,
          holName,
          holCode,
          holidayYear,
          branchId,
          startDate,
          endDate || startDate,
          email,
        ],
        (err, result) => {
          if (err) {
            console.error("Create holiday error:", err);
            return res.status(500).json({
              message: "Failed to create holiday",
            });
          }

          return res.status(201).json({
            message: "Holiday created successfully",
            holidayId: result.insertId,
          });
        }
      );
    }
  );
};



module .exports = {createBranchHolidays}