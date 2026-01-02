
// this api is used for generating the future weeks and allocating the timesheets to the employee.

const db = require('../../config/db');

const generateFutureWeeks = async () => {
  console.log(' Generating future weeks...');

  // STEP 1: Get active organizations
  const orgSql = `
    SELECT ORG_ID
    FROM TC_ORG_SETTINGS
    WHERE STATUS = 'A'
  `;

  db.query(orgSql, (err, orgs) => {
    if (err) {
      console.error('DB error while fetching orgs:', err);
      return;
    }

    if (orgs.length === 0) {
      console.log('No active orgs found');
      return;
    }

    orgs.forEach((org) => {
      const orgId = org.ORG_ID;

      // STEP 2: Get last generated week
      const lastWeekSql = `
        SELECT TC_MASTER_ID, WEEK_END
        FROM TC_MASTER
        WHERE ORG_ID = ?
        ORDER BY WEEK_END DESC
        LIMIT 1
      `;

      db.query(lastWeekSql, [orgId], (weekErr, weekRes) => {
        if (weekErr) {
          console.error(`Error fetching last week for ${orgId}:`, weekErr);
          return;
        }

        // First week not created manually
        if (weekRes.length === 0) {
          console.log(` Org ${orgId}: No first week found. Skipping.`);
          return;
        }

        const lastWeekEnd = new Date(weekRes[0].WEEK_END);

        // STEP 3: Calculate next week
       // STEP 3: Calculate current week based on today (Monday start)
// STEP 3: Calculate NEXT week based on LAST generated week

const lastWeekEndDate = new Date(lastWeekEnd);

// Move to next day after last week end
const nextWeekStart = new Date(lastWeekEndDate);
nextWeekStart.setDate(lastWeekEndDate.getDate() + 1);

// Ensure it is Monday
// const day = nextWeekStart.getDay(); // 0=Sun, 1=Mon
// const diffToMonday = day === 0 ? 1 : 8 - day;
// nextWeekStart.setDate(nextWeekStart.getDate() + diffToMonday - 1);

// Week end = Monday + 6 days
const nextWeekEnd = new Date(nextWeekStart);
nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

const formatDate = (d) => d.toISOString().split('T')[0];

const nextStart = formatDate(nextWeekStart);
const nextEnd = formatDate(nextWeekEnd);

        console.log(
          `Org ${orgId}: Creating week ${nextStart} → ${nextEnd}`
        );

        // STEP 4: Insert into TC_MASTER
        const insertWeekSql = `
          INSERT INTO TC_MASTER (ORG_ID, WEEK_START, WEEK_END)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertWeekSql,
          [orgId, nextStart, nextEnd],
          (insertErr, insertRes) => {
            if (insertErr) {
              console.error(`Week insert failed for ${orgId}:`, insertErr);
              return;
            }

            const tcMasterId = insertRes.insertId;
            console.log(` Week created (TC_MASTER_ID = ${tcMasterId})`);

            // STEP 5: Fetch active employees
            const empSql = `
              SELECT EMP_ID
              FROM TC_USERS
              WHERE ORG_ID = ?
                AND STATUS = 'A'
            `;

            db.query(empSql, [orgId], (empErr, employees) => {
              if (empErr) {
                console.error(`Employee fetch error for ${orgId}:`, empErr);
                return;
              }

              if (employees.length === 0) {
                console.log(`No active employees for ${orgId}`);
                return;
              }

              // STEP 6: Allocate timesheets
              employees.forEach((emp) => {
                const empId = emp.EMP_ID;

                // Prevent duplicate allocation
                const checkSql = `
                  SELECT 1
                  FROM TC_TIMESHEET
                  WHERE ORG_ID = ?
                    AND EMP_ID = ?
                    AND TC_MASTER_ID = ?
                  LIMIT 1
                `;

                db.query(
                  checkSql,
                  [orgId, empId, tcMasterId],
                  (checkErr, checkRes) => {
                    if (checkErr) {
                      console.error('Timesheet check error:', checkErr);
                      return;
                    }

                    if (checkRes.length > 0) {
                      return; // already exists
                    }

                    const insertTsSql = `
                      INSERT INTO TC_TIMESHEET
                      (ORG_ID, EMP_ID, TC_MASTER_ID, STATUS, CREATION_DATE)
                      VALUES (?, ?, ?, 'N', CURDATE())
                    `;

                    db.query(
                      insertTsSql,
                      [orgId, empId, tcMasterId],
                      (tsErr) => {
                        if (tsErr) {
                          console.error(
                            `Timesheet insert failed for ${empId}:`,
                            tsErr
                          );
                          return;
                        }

                        console.log(
                          `Timesheet allocated → ${empId} (Week ${tcMasterId})`
                        );
                      }
                    );
                  }
                );
              });
            });
          }
        );
      });
    });
  });
};

module.exports = { generateFutureWeeks };
