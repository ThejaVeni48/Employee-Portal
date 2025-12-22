// controllers/empProfile.js


// this api is used for getting the employee profile
const db = require('../../config/db');

const empProfile = (req, res) => {
  const { orgId, empId } = req.query;

  const sql = `
    SELECT 
      U.*,
      UD.*,
      UA.ROLE_CODE,
      UA.ACCESS_CODE,
      UA.DESGN_CODE,
      R.ROLE_NAME,
      A.ACCESS_NAME,
      D.DESGN_NAME
    FROM TC_USERS U
    LEFT JOIN TC_USER_DETAILS UD
      ON U.EMP_ID = UD.EMP_ID AND U.ORG_ID = UD.ORG_ID
    LEFT JOIN TC_ORG_USER_ASSIGNMENT UA
      ON U.EMP_ID = UA.EMP_ID
      AND U.ORG_ID = UA.ORG_ID
      AND UA.STATUS = 'A'
    LEFT JOIN TC_ORG_ROLES R
      ON R.ROLE_CODE = UA.ROLE_CODE AND R.ORG_ID = UA.ORG_ID
    LEFT JOIN TC_ORG_ACCESS A
      ON A.ACCESS_CODE = UA.ACCESS_CODE AND A.ORG_ID = UA.ORG_ID
    LEFT JOIN TC_ORG_DESIGNATIONS D
      ON D.DESGN_CODE = UA.DESGN_CODE AND D.ORG_ID = UA.ORG_ID
    WHERE U.ORG_ID = ? AND U.EMP_ID = ?;
  `;

  db.query(sql, [orgId, empId], (error, result) => {
    if (error) {
      console.error("Error occurred", error);
      return res.status(500).json({ data: error });
    }
    return res.status(200).json({ data: result, response: 1 });
  });
};

module.exports = { empProfile };
