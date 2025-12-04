const db = require('../../config/db');
const moment = require('moment');
// this api is used for customization of hierarchy of each employee
const addProject = (req, res) => {
  const {          
    projectName, startDate, endDate, projectCode, projDesc,
    supportId, status, clientId, clientName, billable,
    hierarchy, companyId, email, notes
  } = req.body;

  console.log("req.body", req.body);

  const billableValue = billable || 'NO';
  const hierarchyValue = hierarchy || 'NO';
  const notesValue = notes || 'NO';
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

    db.query(
      insertSql,
      [
        companyId,
        projectName,
        projectCode,
        projDesc,
        startDate,
        endDate,
        supportId,
        status,
        clientId,
        clientName,
        billableValue,
        hierarchyValue,     
        email,
        now,
        notesValue
      ],
      (error, result) => {
        if (error) {
          console.log("Error occurred", error);
          return res.status(500).json({ data: error });
        }

        console.log("Project created", result);
        return res.status(201).json({ data: result });
      }
    );
  });
};

module.exports = { addProject };
