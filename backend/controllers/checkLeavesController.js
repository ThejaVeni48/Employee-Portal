
const db = require("../config/db");

// this api is checking for the leaves applied for that week or not

const checkLeaves= (req, res) => {
  const { dates, empId, companyId } = req.body;

  console.log("dates for check leaves", dates);

  const placeholders = dates.map(() => "?").join(",");
  console.log("placeholders for check leaves", placeholders);

  const sql = `
    SELECT * FROM LEAVES_REQUESTS 
    WHERE EMP_ID = ? AND COMPANY_ID = ? AND START_DATE AND END_DATE IN (${placeholders})
    `;
  console.log("sql", sql);

  db.query(sql, [empId, companyId, ...dates], (error, result) => {
    if (error) {
      console.log("error cooured for check leaves", error);
      return res.status(500).json({ data: result });
    }
    // console.log("leaves",result);
    
    if (result.length > 0 ) {
      console.log("result for check leaves", result);
      return res.status(200).json({ data: result });
    } 
    else {
      console.log("result for check leaves", result);
      return res.status(200).json({ data: result });
    }
  });
};

module.exports = {checkLeaves};
