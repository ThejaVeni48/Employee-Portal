// this api is used for allocatig the timesheets to the newly added employee.

const db = require("../../config/db");

const allocateTimesheets = (req, res) => {
  const { empId, orgId, email, startDate } = req.body;

  console.log("empId",empId);
  console.log("orgId",orgId);
  console.log("email",email);
  console.log("startDate",startDate);
  

  // step 1: Checking if the employee has existing timesheets

  const checkSql = `SELECT * FROM TC_TIMESHEET WHERE EMP_ID = ? AND ORG_ID = ?`;

  db.query(checkSql, [empId, orgId], (checkError, checkResult) => {
    if (checkError) {
      console.log("error occured", checkError);
      return res.status(500).json({ data: checkError });
    }

    console.log("checkResult", checkResult);
    // return res.status(200).json({data:checkResult})

    if (checkResult.length > 0) {
      alert("cannot assign timesheets.employee is existing user.");
    }

    // step 2: since he does not has any existing timesheets, we need to assign the timesheets from there joinig date.

    if (checkResult.length === 0) {

const fetchTimesheets = `
  SELECT *
  FROM TC_MASTER
  WHERE ? BETWEEN WEEK_START AND WEEK_END
    AND ORG_ID = ?
`;

        db.query(fetchTimesheets,[startDate,orgId],(fetchError,fetchResult)=>{
            if(fetchError)
            {
                console.log("fetchError",fetchError);
                return res.status(500).json({data:fetchError})
                
            }

            console.log("fetchResult",fetchResult);


            const weekId = fetchResult[0].TC_MASTER_ID;

    // step3: now we need to allocate the timesheet to the employee.


    const allocateTimesheet  =  `INSERT INTO TC_TIMESHEET (TC_MASTER_ID,ORG_ID,EMP_ID)
    VALUES(?,?,?)`;

    db.query(allocateTimesheet,[weekId,orgId,empId],(allocateError,allocateResult)=>{
        if(allocateError)
        {
            console.log("allocateError",allocateError);
            return res.status(500).json({data:allocateError})
            
        }

        console.log("allocate Result",allocateResult);
        
    })
            
        })
    }
  });
};

module.exports = { allocateTimesheets };
