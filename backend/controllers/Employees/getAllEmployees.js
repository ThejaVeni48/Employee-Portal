
// this api is used for getting the all employees details of the company.
 

const db = require('../../config/db');

const getAllEmployees = (req, res) => {
  const { companyId} = req.query; 


  console.log("companyId getemployees controller",companyId);
  

  let sql = `
    SELECT * FROM TC_USERS WHERE ORG_ID = ?
  `;


 

  db.query(sql, companyId, (error, result) => {
    if (error) {
      console.log("Error occurred during getting employee list", error);
      return res.status(500).json({ success: false, message: "Database error", error });
    }

    // console.log("Result for employee list", result);
    return res.status(200).json({ success: true, data: result });
  });
};


module.exports = {getAllEmployees}