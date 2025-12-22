const db = require('../../config/db');

const LoginLookup = (req, res) => {
  const query = `
    SELECT LOOKUP_GROUP, LOOKUP_CODE, LOOKUP_NAME
    FROM LOOK_UP
    WHERE STATUS = 'Y'
      AND (LOOKUP_GROUP = 'CON' OR LOOKUP_GROUP = 'SEC' OR LOOKUP_GROUP = 'TZ' OR LOOKUP_GROUP IN ('IND','USA','AUS'))
    ORDER BY LOOKUP_GROUP, LOOKUP_NAME
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching lookup data',
        error: err
      });
    }

    return res.status(200).json({
      success: true,
      data: results
    });
  });
};

module.exports = { LoginLookup };
