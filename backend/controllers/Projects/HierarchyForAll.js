const db = require('../../config/db');

const hierarchyforAll = (req, res) => {
  const { projectId, orgId, empId, levels, createdBy } = req.body;
  const creationDate = new Date();

  console.log("levels", levels);

  if (!projectId || !orgId || !empId || !levels || levels.length === 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const insertQuery = `
    INSERT INTO TC_PROJ_HIER_LIST (
      PROJ_ID, ORG_ID, EMP_ID, APPROVER_ID, LINE_NO, STATUS, 
      CREATION_DATE, CREATED_BY
    ) VALUES ? 
  `;

  // ------------------------ INSERT HIERARCHY FOR MAIN EMPLOYEE   -------------------
  let mainValues = [];
  levels.forEach((level, index) => {
    level.name.forEach((approver) => {
      mainValues.push([
        projectId,
        orgId,
        empId,
        approver,
        index + 1,
        "A",
        creationDate,
        createdBy
      ]);
    });
  });

  db.query(insertQuery, [mainValues], (err) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ message: "Failed to save hierarchy" });
    }

    // ----------------- GET ALL PROJECT EMPLOYEES (EXCLUDING APPROVERS & MAIN EMPLOYEE) -------------------
    
    const getProjEmp = `
      SELECT DISTINCT PA.EMP_ID
      FROM TC_PROJECTS_ASSIGNEES PA
      WHERE PA.PROJ_ID = ?
        AND PA.ORG_ID = ?
        AND PA.EMP_ID NOT IN (
          SELECT APPROVER_ID FROM TC_PROJ_HIER_LIST WHERE PROJ_ID = ? AND ORG_ID = ?
        )
        AND PA.EMP_ID NOT IN (
          SELECT EMP_ID FROM TC_PROJ_HIER_LIST WHERE PROJ_ID = ? AND ORG_ID = ?
        )
    `;

    db.query(getProjEmp, [projectId, orgId, projectId, orgId, projectId, orgId], (getError, getResult) => {
      if (getError) {
        console.error("getError", getError);
        return res.status(500).json({ message: "Error fetching employees" });
      }

      const employees = getResult.map(row => row.EMP_ID);
      console.log("Employees to apply same hierarchy:", employees);

      // ---------------- INSERT SAME HIERARCHY FOR REMAINING EMPLOYEES -------------------------
      
      let allValues = [];
      employees.forEach((emp) => {
        levels.forEach((level, index) => {
          level.name.forEach((approver) => {
            allValues.push([
              projectId,
              orgId,
              emp,
              approver,
              index + 1,
              "A",
              creationDate,
              createdBy
            ]);
          });
        });
      });

      db.query(insertQuery, [allValues], (empError) => {
        if (empError) {
          console.error("EmpError", empError);
          return res.status(500).json({ message: "Error applying hierarchy to employees" });
        }

        // INSERT HIGHER-LEVEL APPROVERS FOR APPROVERS
        let approverToApproverList = [];

        levels.forEach((level, levelIndex) => {
          level.name.forEach((appr) => {
            // Insert all higher-level approvers
            let hasHigher = false;
            for (let nextLevelIndex = levelIndex + 1; nextLevelIndex < levels.length; nextLevelIndex++) {
              levels[nextLevelIndex].name.forEach((higherAppr) => {
                approverToApproverList.push([
                  projectId,
                  orgId,
                  appr,
                  higherAppr,
                  nextLevelIndex + 1,
                  "A",
                  creationDate,
                  createdBy
                ]);
              });
              hasHigher = true;
            }

            if (!hasHigher) {
              approverToApproverList.push([
                projectId,
                orgId,
                appr,
                appr,
                levelIndex + 1,
                "A",
                creationDate,
                createdBy
              ]);
            }
          });
        });

        if (approverToApproverList.length > 0) {
          db.query(insertQuery, [approverToApproverList], (aErr) => {
            if (aErr) {
              console.error("Approver Chain Insert Error:", aErr);
              return res.status(500).json({ message: "Error inserting approver chain" });
            }

            return res.status(200).json({
              message: "Project hierarchy (Apply for All) saved successfully",
              appliedTo: employees.length
            });
          });
        } else {
          return res.status(200).json({
            message: "Project hierarchy (Apply for All) saved successfully",
            appliedTo: employees.length
          });
        }
      });
    });
  });
};

module.exports = { hierarchyforAll };
