const db = require('../../../config/db')


const createPHolidays = (req, res) => {
    const { projId, orgId, holidayName,code, startDate, endDate, days, email } = req.body;


     console.log("projId",projId);
       console.log("orgId",orgId);
       console.log("holidayName",holidayName);
       console.log("startDate",startDate);
       console.log("endDate",endDate);
       console.log("days",days);
       console.log("email",email);

    const checkSql = `
        SELECT COUNT(PROJ_H_ID) AS COUNT
        FROM TC_PROJECT_HOLIDAYS 
        WHERE ORG_ID = ? AND PROJ_ID = ? AND HOLIDAY_NAME = ? AND START_DATE = ?
    `;

    db.query(checkSql, [orgId, projId, holidayName,startDate], (checkError, checkResult) => {
        if (checkError) {
            console.log("CheckError", checkError);
            return res.status(500).json({ error: checkError,status:404 });
        }
 
        console.log("checkResult",checkResult[0].COUNT);
        

        if (checkResult[0].COUNT > 0) {
            return res.status(400).json({ message: 'Holiday already exists for this project',status:404 });
        }
      else{

     
        const insertSql = `
            INSERT INTO TC_PROJECT_HOLIDAYS 
            (PROJ_ID, ORG_ID, HOLIDAY_NAME,HOLIDAY_CODE, START_DATE, END_DATE, DAYS,  CREATED_BY)
            VALUES (?,?,?,?,?,?,?,?)
        `;

        db.query(
            insertSql,
            [projId, orgId, holidayName,code, startDate, endDate, days, email],
            (insertError, insertResult) => {

                if (insertError) {
                    console.log("InsertError", insertError);
                    return res.status(500).json({ error: insertError });
                }

                return res.status(201).json({ data: insertResult, status: 201 });
            }
        );

         }
    });
};

module.exports = { createPHolidays };
