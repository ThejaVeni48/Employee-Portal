const db = require("../../config/db");

const currentWeek = (req, res) => {
  const { orgId } = req.query;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const sql = `
    SELECT *
    FROM TC_MASTER
    WHERE ORG_ID = ?
      AND (
            ? BETWEEN WEEK_START AND WEEK_END
         OR (
              WEEK_START > ?
              AND WEEK_START = (
                  SELECT MIN(WEEK_START)
                  FROM TC_MASTER
                  WHERE WEEK_START >= ?
                    AND ORG_ID = ?
              )
         )
      )
  `;

  db.query(
    sql,
    [orgId, formattedDate, formattedDate, formattedDate, orgId],
    (error, result) => {
      if (error) {
        console.log("Error occurred", error);
        return res.status(500).json({ error });
      }

      return res.status(200).json({
        today: formattedDate,
        data: result,
      });
    }
  );
};

module.exports = { currentWeek };
