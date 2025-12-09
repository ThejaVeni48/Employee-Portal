const db = require('../../config/db');

const createTask = (req, res) => {
  const { taskType, description, code, email, companyId, projectId } = req.body;

  if (!taskType || !projectId || !companyId) {
    return res.status(400).json({ data: "Task name, projectId and companyId are required" });
  }

  // Step 1: Check if task already exists for the project
  const checkSql = `SELECT * FROM TASKS WHERE TASK_NAME = ? AND PROJ_ID = ? AND ORG_ID = ?`;
  db.query(checkSql, [taskType, projectId, companyId], (checkError, checkResult) => {
    if (checkError) {
      console.error("Error checking existing task:", checkError);
      return res.status(500).json({ data: checkError });
    }

    if (checkResult.length > 0) {
      // Task already exists
      return res.status(400).json({ data: `Task "${taskType}" already exists for this project.` });
    }

    // Step 2: Generate next TASK_NO per company per project
    const taskNoSql = `
      SELECT IFNULL(MAX(TASK_NO), 0) + 1 AS nextTaskNo
      FROM TASKS
      WHERE ORG_ID = ? AND PROJ_ID = ?
    `;

    db.query(taskNoSql, [companyId, projectId], (errTaskNo, taskNoResult) => {
      if (errTaskNo) {
        console.error("Error generating TASK_NO:", errTaskNo);
        return res.status(500).json({ data: errTaskNo });
      }

      const nextTaskNo = taskNoResult[0].nextTaskNo;
      console.log("Generated TASK_NO:", nextTaskNo);

      // Step 3: Insert new task
      const insertSql = `
        INSERT INTO TASKS(TASK_NO, TASK_NAME, TASK_DESC, CODE, PROJ_ID, ORG_ID, CREATED_BY, CREATION_DATE)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      db.query(
        insertSql,
        [nextTaskNo, taskType, description, code, projectId, companyId, email],
        (insertError, insertResult) => {
          if (insertError) {
            console.error("Error creating task:", insertError);
            return res.status(500).json({ data: insertError });
          }

          console.log("Task created successfully:", insertResult);
          return res.status(201).json({ 
            data: insertResult,
            task_no: nextTaskNo
          });
        }
      );
    });
  });
};

module.exports = { createTask };
