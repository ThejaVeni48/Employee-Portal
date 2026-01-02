const db = require("../config/db");


function generateCompanyId(companyName) {
  return new Promise((resolve, reject) => {
    const prefix = companyName.slice(0, 2).toUpperCase();
    const checkSql = `SELECT COUNT(*) AS total FROM TC_ORG_REGISTRATIONS`;

    db.query(checkSql, (err, result) => {
      if (err) return reject(err);

      const count = result[0].total;
      const nextNumber = (count + 1).toString().padStart(3, "0");
      const companyId = `${prefix}-${nextNumber}`;

      resolve(companyId);
    });
  });
}




function generateTimesheetCode(companyName) {
  const name = companyName.slice(0, 3).toUpperCase();
  const num = Math.floor(10 + Math.random() * 90);
  console.log("name for timesheet:", name);
  console.log("num for timesheet:", num);
  return `${name}-${num}`;
}

const companyRegister = async (req, res) => {
  const { fullName, companyName, email,address1,country,city,sector,timezone,contactno,planId } = req.body;


  console.log("planId",planId);
  

  const companyId = await generateCompanyId(companyName);
  const timesheetCode = generateTimesheetCode(companyName);

 

  

  const checkCompanyExists = `
    SELECT * FROM TC_ORG_REGISTRATIONS 
    WHERE ORG_NAME = ?`;

  db.query(checkCompanyExists, [companyName], (err, results) => {
    if (err) {
      console.error("Error checking existing company:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res.status(400).json({
        message: "Company with this name or email already exists",
        status: 400,
      });
    }
    const status = 'P';

    const attemptsLogins = 0;

    const insertSql = `
      INSERT INTO TC_ORG_REGISTRATIONS 
      (ORG_ID,STATUS,ADMIN_NAME,ORG_NAME,SECTOR, ADDRESS1,COUNTRY,CITY,TIMEZONE, ORG_PHONE_NUMBER,ORG_EMAIL,CREATED_BY)
      VALUES (?, ?,?, ?, ?, ?,?,?,?,?,?,?)`;

    db.query(
      insertSql,
      [
        companyId,
        status,
        fullName,
        companyName,
        sector,
        address1,
        country,
        city,
        timezone,
        contactno,
        email,
        email
        
      ],
      (error, result) => {
        if (error) {
          console.error("Error inserting company:", error);
          return res.status(500).json({ message: "Insertion error", error });
        }

        console.log("Company registration successful:", result);

if(result.affectedRows > 0)         {
          const insertSubscriptions = `INSERT INTO TC_ORG_SUBSCRIPTIONS (ORG_ID,PLAN_ID,STATUS,CREATED_BY)
          VALUES (?,?,?,?)`;

          db.query(insertSubscriptions,[companyId,planId,'P',email],(insertError,insertResult)=>{
            if(insertError)
            {
              console.log("Insert Error",insertError);
              return res.status(500).json({data:insertError})
              
            }
            console.log("insertResult",insertResult);
            
return res.status(201).json({
  data: result,          
  companyId,              
  timesheetCode,          
  message: "Your company is registered successfully",
  status: 201,
});

          })
        }

       
      }
    );
  });
};

module.exports = { companyRegister };
