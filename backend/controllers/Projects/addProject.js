// THIS API IS USED FOR CREATING A NEW PROJECT

const db = require('../../config/db');
const moment = require('moment');

const addProject = (req, res) => {
  const {          
    projectName, startDate, endDate, projectCode, projDesc,
    supportId, status, clientId, clientName, billable,
    hierarchy, companyId, email, notes
  } = req.body;

  console.log("req.body", req.body);

  const billableValue = billable || 'NO';
const hierarchyValue = hierarchy || req.body.hierachy || 'NO';
  const notesValue = notes || 'NO';
  const now = moment().format('YYYY-MM-DD HH:mm:ss');

  console.log("HEIRARCHYVALUE",hierarchyValue);
  console.log("notesValue",notesValue);
  console.log("billableValue",billableValue);
  

  //Check duplicates
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

    //  Generate next PROJ_NO
    const projNoSql = `
      SELECT IFNULL(MAX(PROJ_NO), 0) + 1 AS nextProjNo
      FROM TC_PROJECTS_MASTER
      WHERE ORG_ID = ?
    `;

    db.query(projNoSql, [companyId], (err2, result2) => {
      if (err2) {
        console.log("Error fetching proj_no", err2);
        return res.status(500).json({ message: "Server error" });
      }

      const nextProjNo = result2[0].nextProjNo;
      console.log("Generated PROJ_NO:", nextProjNo);

      //  Insert project
      const insertSql = `
        INSERT INTO TC_PROJECTS_MASTER 
        (ORG_ID, PROJ_NO, PROJ_NAME, PROJ_CODE, PROJ_DESC, START_DATE, END_DATE,
        SUPPORT_IDENTIFIER, CURRENT_STATUS, CLIENT_ID, CLIENT_NAME,
        BILLABLE, HIERARCHY, CREATED_BY, CREATION_DATE, NOTES)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          companyId,
          nextProjNo,
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
          return res.status(201).json({
            message: "Project created successfully",
            proj_no: nextProjNo,
            project_id: result.insertId,
          status:200
          });
        }
      );
    });
  });
};

module.exports = { addProject };
