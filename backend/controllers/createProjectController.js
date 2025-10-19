const db = require('../config/db');
const moment = require('moment');

function checkStatus(startDate, endDate, today) {
  // Convert to moment objects for comparison
  const start = moment(startDate, 'YYYY-MM-DD');
  const end = moment(endDate, 'YYYY-MM-DD');
  const current = moment(today, 'YYYY-MM-DD');

  // Compare
  if (current.isBefore(start, 'day')) {
    return 'Not Started';
  } else if (current.isAfter(end, 'day')) {
    return 'Completed';
  } else {
    return 'Ongoing';
  }
}

const createProject = (req, res) => {
  const { projectName, startDate, endDate, dept, selectedPM,companyId } = req.body;


  console.log("SELECTEDpM",selectedPM);
  const todayDate = moment().format('YYYY-MM-DD');

  // Get status
  const status = checkStatus(startDate, endDate, todayDate);


  const getName = `SELECT DISPLAY_NAME FROM EMPLOYEES_DETAILS 
                      WHERE EMP_ID = ? AND COMPANY_ID = ?`;



    db.query(getName,[selectedPM,companyId],(nameError,nameResult)=>{
      if(nameError)
      {
        console.log("nameError",nameError);
        return res.status(500).json({data:nameError})
        
      }

      const projectLead = nameResult[0].DISPLAY_NAME;
      const sql = `
    INSERT INTO PROJECTS (PROJECT_NAME, START_DATE, END_DATE, DEPARTMENT, PROJECT_LEAD,EMPLOYEE_ID, COMPANY_ID,STATUS)
    VALUES (?, ?, ?, ?, ?, ?,?,?)
  `;

  db.query(sql, [projectName, startDate, endDate, dept, projectLead,selectedPM,companyId, status], (error, result) => {
    if (error) {
      console.error("Error occurred:", error);
      return res.status(500).json({ error });
    }

    console.log("Project inserted:", result);
    return res.status(201).json({ data: result, status });
  });

    })
  

  

  
};

module.exports = { createProject };
