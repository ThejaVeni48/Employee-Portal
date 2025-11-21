const db = require("../../config/db");
const XLSX = require("xlsx");

const uploadOrgRoles = (req, res) => {
  const filePath = req.file.path;
  const { companyId, createdBy } = req.body;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let insertData = [];

    rows.forEach((row) => {
      insertData.push([
        row.ROLE_NAME,
        row.ROLE_STATUS,
        row.ROLE_CODE,
        row.ROLE_DESCRIPTION,
        companyId,
        createdBy,
      ]);
    });

    const sql = `
      INSERT INTO TC_ORG_ROLES
      (ROLE_NAME, ROLE_STATUS, ROLE_CODE, ROLE_DESCRIPTION, ORG_ID, CREATED_BY)
      VALUES ?
    `;

    db.query(sql, [insertData], (err, result) => {
      if (err) {
        console.log("Error inserting roles:", err);
        return res.status(500).json({ message: "Error", error: err });
      }

      return res.status(201).json({
        status: 201,
        message: "Roles uploaded successfully",
        data: result,
      });
    });

  } catch (error) {
    console.log("Upload error:", error);
    return res.status(500).json({ message: "File processing error" });
  }
};

module.exports = { uploadOrgRoles };
