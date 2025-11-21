// this api is used for showing the projects  in timesheets.


const db = require('../../config/db.js');



const getTProjects = (req,res)=>{

const { empId, date,companyId,role } = req.query; 


console.log("empId",empId);
console.log("date",date);


if(role ==="Employee")

{
  const query = `
    SELECT 
      P.PROJECT_ID, 
      P.PROJECT_NAME, 
      P.START_DATE, 
      P.END_DATE
    FROM PROJECTS P
    JOIN PROJECTS_ASSIGNMENTS PA
      ON P.PROJECT_ID = PA.PROJECT_ID
      AND P.COMPANY_ID = PA.COMPANY_ID
    WHERE 
      PA.EMP_ID = ? AND 
      PA.COMPANY_ID = ?
      AND ? BETWEEN P.START_DATE AND P.END_DATE;
  `;

  db.query(query, [empId,companyId, date], (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.json(results);
  });

}
else if(role === "Project Manager")
{
  const sql =`
SELECT 
      P.PROJECT_ID, 
      P.PROJECT_NAME, 
      P.START_DATE, 
      P.END_DATE
    FROM PROJECTS P
    WHERE 
P.PROJECT_MANAGER = ?
AND 
     P.COMPANY_ID = ?
      AND ? BETWEEN P.START_DATE AND P.END_DATE`;
       
      db.query(sql, [empId,companyId, date], (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ message: "Server error" });
    }
    console.log("result for fetching projects",results)
    res.json(results);
  });


}
else {
    // Default: return internal project if role is anything else
    res.json([
      {
        PROJECT_ID: "0",
        PROJECT_NAME: "Internal Project",
      },
    ]);
  }
};

module.exports = {getTProjects}