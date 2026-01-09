// this api is used for creating new shifts by the org admin  (org level shifts)

const db = require("../../config/db");

const createShifts = (req, res) => {
  const { shiftName,
        shiftType,
        shiftCode,
        shiftDetailType,
        category,
        duration,
        desc,
        startTime,
        endTime,
        email,
    periodType ,
orgId} =
    req.body;

  const status = "A";

  // step1:chekcing  if the same shift code exists

  const checkSql = `SELECT * FROM TC_ORG_SHIFTS WHERE ORG_ID = ? AND SHIFT_CODE = ? AND SHIFT_NAME = ?`;

  db.query(checkSql, [orgId, shiftCode,shiftName], (checkError, checkResult) => {
    if (checkError) {
      console.log("checkError", checkError);
      return res.status(500).json({ message: "Db error" });
    }
    // if present throw alert
    if (checkResult.length > 0) {
      return res
        .status(409)
        .json({ data: " Alreaady exists", status: 409 });
    }

    // if not present insert into shifts table

    if (checkResult.length === 0) {
      const insertSql = `INSERT INTO TC_ORG_SHIFTS
(SHIFT_NAME, SHIFT_TYPE, SHIFT_CODE, PERIOD_TYPE, START_TIME, END_TIME, DURATION, CATEGORY, SHIFT_DETAIL_TYPE, DESCRIPTION, ORG_ID,STATUS, CREATED_BY)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      db.query(
        insertSql,
        [shiftName, shiftType, shiftCode, periodType,startTime,endTime,duration,category,shiftDetailType,desc, orgId, status,email],
        (insertError, insertResult) => {
          if (insertError) {
            console.log("insertError", insertError);
            return res.status(500).json({ message: "Db error" });
          }
          return res.status(200).json({
            message: "Shift added successfully",
            status: 201,
          });
        }
      );
    }
  });
};

module.exports = { createShifts };
