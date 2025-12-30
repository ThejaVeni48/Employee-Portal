// this api is used for getting the employee profile
const db = require("../../config/db");

const empProfile = (req, res) => {
  const { orgId, empId } = req.query;

  const sql = `
 SELECT
  U.USER_ID,
  U.EMP_ID,
  U.ORG_ID,
  U.EMAIL,
  U.STATUS,
  U.FIRST_NAME,
  U.LAST_NAME,
  U.START_DATE,
  U.MOBILE_NUMBER,
  UA.ROLE_CODE,
  UA.DESGN_CODE,
  R.ROLE_NAME,
  D.DESGN_NAME,
  GROUP_CONCAT(DISTINCT AC.ACCESS_CODE) AS ACCESS_CODES,
  MAX(CASE WHEN T.TC_MASTER_ID IS NULL THEN 0 ELSE 1 END) AS TIMESHEET_EXIST
FROM TC_USERS U
LEFT JOIN TC_USER_DETAILS UD
  ON U.EMP_ID = UD.EMP_ID AND U.ORG_ID = UD.ORG_ID
LEFT JOIN TC_ORG_USER_ASSIGNMENT UA
  ON U.EMP_ID = UA.EMP_ID
  AND U.ORG_ID = UA.ORG_ID
  AND UA.STATUS = 'A'
LEFT JOIN TC_ORG_ROLES R
  ON R.ROLE_CODE = UA.ROLE_CODE AND R.ORG_ID = UA.ORG_ID
LEFT JOIN TC_ACCESS_CONTROLS AC
  ON U.EMP_ID = AC.EMP_ID AND U.ORG_ID = AC.ORG_ID
LEFT JOIN TC_ORG_DESIGNATIONS D
  ON D.DESGN_CODE = UA.DESGN_CODE AND D.ORG_ID = UA.ORG_ID
LEFT JOIN TC_TIMESHEET T
  ON U.EMP_ID = T.EMP_ID AND U.ORG_ID = T.ORG_ID
WHERE U.ORG_ID = ?
  AND U.EMP_ID = ?
GROUP BY
  U.USER_ID,
  U.EMP_ID,
  U.ORG_ID,
  U.EMAIL,
  U.STATUS,
  U.FIRST_NAME,
  U.LAST_NAME,
  U.MOBILE_NUMBER,
  UA.ROLE_CODE,
  UA.DESGN_CODE,
  R.ROLE_NAME,
  D.DESGN_NAME
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
