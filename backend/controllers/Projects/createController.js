const db = require('../../config/db');

// OLD API

// Utility: get current timestamp
function getCurrentDateTime() {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace('T', ' ');
}

// Utility: async DB query
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// Utility: generate project code
function generateProjectCode(projectName, companyId) {
  return new Promise((resolve, reject) => {
    const prefix = 'PRO';
    const pName = projectName.slice(0, 3).toUpperCase();

    const checkProjectSql = `SELECT COUNT(*) AS total FROM PROJECTS WHERE COMPANY_ID = ?`;

    db.query(checkProjectSql, [companyId], (err, result) => {
      if (err) return reject(err);

      const count = result[0].total || 0;
      const nextNumber = (count + 1).toString().padStart(3, "0");
      const projectCode = `${prefix}-${pName}-${nextNumber}`;
      resolve(projectCode);
    });
  });
}

// ==========================
//     CREATE PROJECT API
// ==========================
const createProject1 = async (req, res) => {
  try {
    const {
      projectName,
      startDate,
      endDate,
      projectLead, // employee ID of team lead
      status,
      client,
      companyId,
      createdBy,
      selectedEmp, // array of assigned employees
       //  empId of the project manager
    } = req.body;

    if (!projectName || !companyId || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate project code
    const projectCode = await generateProjectCode(projectName, companyId);

    // 1️⃣ Insert project
    const insertProjectSql = `
      INSERT INTO PROJECTS
      (PROJECT_NAME, START_DATE, END_DATE, PROJECT_LEAD, PROJECT_CODE, STATUS, CLIENT, COMPANY_ID,PROJECT_MANAGER, CREATED_BY, CREATION_DATE)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,?, ?, NOW())
    `;

    const insertResult = await queryAsync(insertProjectSql, [
      projectName,
      startDate,
      endDate,
      projectLead,
      projectCode,
      status,
      client,
      companyId,
      createdBy,
      createdBy,
    ]);

    const projectId = insertResult.insertId;
    console.log("✅ Project created:", projectCode, "Project ID:", projectId);

    // 2️⃣ Assign employees to PROJECTS_ASSIGNMENTS
    if (selectedEmp && selectedEmp.length > 0) {
      const assignValues = selectedEmp.map(emp => [
        projectId,
        emp.EMP_ID,
        companyId,
        startDate,
        status,
        
        
      ]);

      const assignSql = `
        INSERT INTO PROJECTS_ASSIGNMENTS (PROJECT_ID, EMP_ID, COMPANY_ID, ASSIGNED_DATE,PROJECT_STATUS)
        VALUES ?
      `;
      await queryAsync(assignSql, [assignValues]);
      console.log("👥 Employees assigned:", selectedEmp.length);
    }

    // 3️⃣ Fetch Team Lead Role_ID dynamically
    const fetchRoleIdSql = `
      SELECT ROLE_ID FROM ROLES 
      WHERE ROLE_NAME = 'Team Lead' AND COMPANY_ID = ?
    `;
    const roleResult = await queryAsync(fetchRoleIdSql, [companyId]);

    if (!roleResult.length) {
      return res.status(400).json({ message: "Role 'Team Lead' not found in ROLES table" });
    }

    const teamLeadRoleId = roleResult[0].ROLE_ID;

    // 4️⃣ Update role in both EMPLOYEES_DETAILS and EMPLOYEES_LOGINS
    const updateDetailsSql = `
      UPDATE EMPLOYEES_DETAILS
      SET ROLE_ID = ?
      WHERE EMP_ID = ? AND COMPANY_ID = ?
    `;
    const updateLoginsSql = `
      UPDATE EMPLOYEES_LOGINS
      SET ROLE_ID = ?
      WHERE EMP_ID = ? AND COMPANY_ID = ?
    `;

    await Promise.all([
      queryAsync(updateDetailsSql, [teamLeadRoleId, projectLead, companyId]),
      queryAsync(updateLoginsSql, [teamLeadRoleId, projectLead, companyId])
    ]);

    console.log(`👑 Employee ${projectLead} role updated to Team Lead in both tables (Role ID: ${teamLeadRoleId})`);

    // 5️⃣ Insert notifications
    const notifications = [];
    const currentDate = getCurrentDateTime();
    const type = 'P';

    // Team Lead notification
    notifications.push([
      companyId,
      projectLead,
      `You have been assigned as Team Lead for project ${projectName}`,
      'unread',
      projectId,
      type,
      createdBy,
      currentDate
    ]);

    // Assigned employees notifications
    (selectedEmp || []).forEach(emp => {
      if (emp.EMP_ID !== projectLead) {
        notifications.push([
          companyId,
          emp.EMP_ID,
          `You have been assigned to project ${projectName}`,
          'unread',
          projectId,
          type,
          createdBy,
          currentDate
        ]);
      }
    });

    if (notifications.length > 0) {
      const insertNotificationsSql = `
        INSERT INTO NOTIFICATIONS 
        (COMPANY_ID, EMPLOYEE_ID, MESSAGE, STATUS, REFERENCE_ID, TYPE, CREATED_BY, CREATION_DATE)
        VALUES ?
      `;
      await queryAsync(insertNotificationsSql, [notifications]);
      console.log("🔔 Notifications created:", notifications.length);
    }

    // ✅ Final Response
    return res.status(201).json({
      message: "Project created successfully and Team Lead role updated in both tables",
      projectCode,
      status: 201,
    });

  } catch (error) {
    console.error("❌ Error occurred:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { createProject1 };
