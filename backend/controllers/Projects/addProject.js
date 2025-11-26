// this api is used for creating a new project




const db = require('../../config/db');
const moment = require('moment');


const addProject = (req, res) => {
  const {          
    projectName, startDate, endDate, projectCode, projDesc,
    supportId, status, clientId, clientName, billable,
    hierachy, companyId, email, notes
  } = req.body;


  console.log("rea.nody",req.body);
  
  const now = moment().format('');

  const checkSql = `
      SELECT PROJ_ID FROM TC_PROJECTS_MASTER 
      WHERE ORG_ID = ? AND PROJ_CODE = ?
  `;

  db.query(checkSql, [companyId, projectCode], (err, rows) => {
    if (err) {
      console.log("Duplicate check error", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (rows.length > 0) {
      return res.status(400).json({ message: "Project code already exists" });
    }

    const insertSql = `
      INSERT INTO TC_PROJECTS_MASTER 
      (ORG_ID,PROJ_NAME,PROJ_CODE,PROJ_DESC,START_DATE,END_DATE,
      SUPPORT_IDENTIFIER,CURRENT_STATUS,CLIENT_ID,CLIENT_NAME,
      BILLABLE,HIERARCHY,CREATED_BY,CREATION_DATE,NOTES)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    db.query(insertSql, 
      [ companyId, projectName, projectCode, projDesc, startDate, endDate,
        supportId, status, clientId, clientName, billable, hierachy,
        email, now, notes],
      (error, result) => {
        if (error) {
          console.log("Error occured", error);
          return res.status(500).json({ data: error });
        }

        console.log("Project created", result);
        return res.status(201).json({ data: result });
      }
    );
  });
};



module.exports = {addProject}