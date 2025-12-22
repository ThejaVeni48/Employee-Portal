const db = require('../../config/db');

const hierarchyforAll = (req, res) => {
  const { projectId, orgId, empId, levels, createdBy } = req.body;
  const creationDate = new Date();

  if (!projectId || !orgId || !empId || !levels || levels.length === 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const insertQuery = `
    INSERT INTO TC_PROJ_HIER_LIST (
      PROJ_ID, ORG_ID, EMP_ID, APPROVER_ID, LINE_NO, STATUS,
      CREATION_DATE, CREATED_BY
    ) VALUES ?
  `;

  /* -------------------------------------------------------
     STEP 1: INSERT HIERARCHY FOR MAIN EMPLOYEE
  ------------------------------------------------------- */

  let mainValues = [];

  levels.forEach((level, index) => {
    if (Array.isArray(level.name)) {
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
    }
  });

  if (!mainValues.length) {
    return res.status(400).json({ message: "No approvers found in hierarchy" });
  }

  db.query(insertQuery, [mainValues], (err) => {
    if (err) {
      console.error("Main Insert Error:", err);
      return res.status(500).json({ message: "Failed to save main hierarchy" });
    }

    /* -------------------------------------------------------
       STEP 2: FETCH REMAINING PROJECT EMPLOYEES
    ------------------------------------------------------- */

    const getProjEmp = `
      SELECT DISTINCT PA.EMP_ID
      FROM TC_PROJECTS_ASSIGNEES PA
      WHERE PA.PROJ_ID = ?
        AND PA.ORG_ID = ?
        AND PA.EMP_ID NOT IN (
          SELECT APPROVER_ID FROM TC_PROJ_HIER_LIST
          WHERE PROJ_ID = ? AND ORG_ID = ?
        )
        AND PA.EMP_ID NOT IN (
          SELECT EMP_ID FROM TC_PROJ_HIER_LIST
          WHERE PROJ_ID = ? AND ORG_ID = ?
        )
    `;

    db.query(
      getProjEmp,
      [projectId, orgId, projectId, orgId, projectId, orgId],
      (getError, getResult) => {
        if (getError) {
          console.error("Fetch Employee Error:", getError);
          return res.status(500).json({ message: "Error fetching employees" });
        }

        const employees = getResult.map(row => row.EMP_ID);

        /* -------------------------------------------------------
           STEP 3: APPLY SAME HIERARCHY FOR OTHER EMPLOYEES
           (SKIP IF NO OTHER EMPLOYEES)
        ------------------------------------------------------- */

        const insertForEmployees = (callback) => {
          if (employees.length === 0) {
            console.log("Single employee project. Skipping apply-for-all.");
            return callback();
          }

          let allValues = [];

          employees.forEach((emp) => {
            levels.forEach((level, index) => {
              if (Array.isArray(level.name)) {
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
              }
            });
          });

          if (!allValues.length) {
            return callback();
          }

          db.query(insertQuery, [allValues], (empError) => {
            if (empError) {
              console.error("Employee Insert Error:", empError);
              return res.status(500).json({
                message: "Error applying hierarchy to employees"
              });
            }
            callback();
          });
        };

        /* -------------------------------------------------------
           STEP 4: INSERT APPROVER → APPROVER CHAIN
           (ALWAYS REQUIRED)
        ------------------------------------------------------- */

        const insertApproverChain = () => {
          let approverChainValues = [];

          levels.forEach((level, levelIndex) => {
            if (!Array.isArray(level.name)) return;

            level.name.forEach((approver) => {
              let hasHigher = false;

              for (let next = levelIndex + 1; next < levels.length; next++) {
                if (Array.isArray(levels[next].name)) {
                  levels[next].name.forEach((higherApprover) => {
                    approverChainValues.push([
                      projectId,
                      orgId,
                      approver,
                      higherApprover,
                      next + 1,
                      "A",
                      creationDate,
                      createdBy
                    ]);
                  });
                  hasHigher = true;
                }
              }

              // Final approver self-map
              if (!hasHigher) {
                approverChainValues.push([
                  projectId,
                  orgId,
                  approver,
                  approver,
                  levelIndex + 1,
                  "A",
                  creationDate,
                  createdBy
                ]);
              }
            });
          });

          if (!approverChainValues.length) {
            return res.status(200).json({
              message: "Project hierarchy saved successfully",
              appliedTo: employees.length
            });
          }

          db.query(insertQuery, [approverChainValues], (aErr) => {
            if (aErr) {
              console.error("Approver Chain Error:", aErr);
              return res.status(500).json({
                message: "Error inserting approver chain"
              });
            }

            return res.status(200).json({
              message: "Project hierarchy (Apply for All) saved successfully",
              appliedTo: employees.length
            });
          });
        };

        /* -------------------------------------------------------
           EXECUTION FLOW
        ------------------------------------------------------- */

        insertForEmployees(insertApproverChain);
      }
    );
  });
};

module.exports = { hierarchyforAll };

