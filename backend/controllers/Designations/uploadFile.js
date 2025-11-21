const db = require("../../config/db");
const XLSX = require("xlsx");

const uploadOrgDesignations = (req, res) => {
  const filePath = req.file.path;
  const { companyId, createdBy, roleId } = req.body; // roleId should come from frontend if applicable

  try {
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    let insertData = [];

    // Map Excel rows to DB values
    rows.forEach((row) => {
      insertData.push([
        row.DESGN_NAME,
        row.DESGN_DESC,
        row.DESGN_CODE,
        row.DESGN_STATUS,
        roleId || null,       // ROLE_ID, can be null if not provided
        companyId,            // ORG_ID
        createdBy             // CREATED_BY
      ]);
    });

    const sql = `
      INSERT INTO TC_DESIGNATIONS
      (DESGN_NAME, DESGN_DESC, DESGN_CODE, DESGN_STATUS, ROLE_ID, ORG_ID, CREATED_BY)
      VALUES ?
    `;

    db.query(sql, [insertData], (err, result) => {
      if (err) {
        console.log("Error inserting designations:", err);
        return res.status(500).json({ message: "Error", error: err });
      }

      return res.status(201).json({
        status: 201,
        message: "Designations uploaded successfully",
        data: result,
      });
    });

  } catch (error) {
    console.log("Upload error:", error);
    return res.status(500).json({ message: "File processing error" });
  }
};

module.exports = { uploadOrgDesignations };
