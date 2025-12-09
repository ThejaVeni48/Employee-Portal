const db = require('../../config/db');

const createHolidays = (req, res) => {
  const { orgId, holidayName, code,startDate, endDate, days, status, email } = req.body;

  if (!orgId || !holidayName || !startDate) {
    return res.status(400).json({ message: "orgId, holidayName, and startDate are required" });
  }

  console.log("orgId", orgId);
  console.log("holidayName", holidayName);
  console.log("startDate", startDate);
  console.log("endDate", endDate);
  console.log("days", days);
  console.log("code", code);
  console.log("email", email);

  // Step 1: Check if holiday already exists
  const checkSql = `
    SELECT COUNT(HOL_NO) AS COUNT
    FROM TC_HOLIDAYS 
    WHERE ORG_ID = ? AND HOL_NAME = ? AND START_DATE = ?
  `;

  db.query(checkSql, [orgId, holidayName, startDate], (checkError, checkResult) => {
    if (checkError) {
      console.log("CheckError", checkError);
      return res.status(500).json({ error: checkError, status: 500 });
    }

    if (checkResult[0].COUNT > 0) {
      return res.status(400).json({ message: 'Holiday already exists for this company', status: 400 });
    }

    // Step 2: Generate HOL_NO per company
    const holNoSql = `
      SELECT IFNULL(MAX(HOL_NO), 0) + 1 AS nextHolNo
      FROM TC_HOLIDAYS
      WHERE ORG_ID = ?
    `;

    db.query(holNoSql, [orgId], (holNoError, holNoResult) => {
      if (holNoError) {
        console.log("HOL_NO generation error", holNoError);
        return res.status(500).json({ error: holNoError });
      }

      const holNo = holNoResult[0].nextHolNo;
      console.log("Generated HOL_NO:", holNo);

      // Step 3: Insert new holiday
      const insertSql = `
        INSERT INTO TC_HOLIDAYS 
        (HOL_NO, ORG_ID, HOL_NAME,HOL_CODE, START_DATE, END_DATE, DAYS, CREATED_BY)
        VALUES (?, ?, ?, ?, ?, ?, ?,?)
      `;

      db.query(
        insertSql,
        [holNo, orgId, holidayName, code,startDate, endDate, days,  email],
        (insertError, insertResult) => {
          if (insertError) {
            console.log("InsertError", insertError);
            return res.status(500).json({ error: insertError });
          }

          return res.status(201).json({ message: "Holiday created successfully", hol_no: holNo, data: insertResult,status:201 });
        }
      );
    });
  });
};

module.exports = { createHolidays };
