// this api is used for user detils related t project and project shedulers, i.e scheduled_month,assigned date, start and end Dtses of Schedulers.


const db = require('../../../config/db');




const formattedData = (result) => {

    const empData = {};

    result.forEach(row => {
        const empId = row.EMP_ID;


        // IF EMPLOYEE NOT THERE CREATE A NEW OBJ
        if (!empData[empId]) {
            empData[empId] = {
                EMP_ID: empId,
                DISPLAY_NAME: row.DISPLAY_NAME,
                 CONTRACT_START_DATE: row.START_DATE,
                CONTRACT_END_DATE: row.END_DATE,
                SCHEDULES: []
            };
        }

        if (row.MONTH !== '-' && row.PSEDATE !== '-' && row.PSDATE !== '-') {
            empData[empId].SCHEDULES.push({
                SCHEDULE_MONTH: row.MONTH,
                SCHEDULE_STARTDATE: row.PSEDATE,
                SCHEDULE_ENDDATE: row.PSDATE
            });
        }
    });

    return Object.values(empData);  

};



const getSchedulers = (req, res) => {
    const { projId, orgId } = req.query;

    const getSql = `
        SELECT 
            PA.EMP_ID,
            U.DISPLAY_NAME,
             PA.CONTRACT_STARTDATE AS START_DATE,
             PA.CONTRACT_ENDDATE AS END_DATE,
            COALESCE(PS.MONTH_YEAR, '-') AS MONTH,
            COALESCE(PS.START_DATE, '-') AS PSEDATE,
            COALESCE(PS.END_DATE, '-') AS PSDATE
        FROM TC_PROJECTS_ASSIGNEES PA
        LEFT JOIN PROJ_SCHEDULE PS
            ON PA.PROJ_ID = PS.PROJ_ID
            AND PA.ORG_ID = PS.ORG_ID
            AND PA.TC_PROJ_ASSIGN_ID = PS.assign_id
        JOIN TC_USERS U
            ON PA.EMP_ID = U.EMP_ID
            AND PA.ORG_ID = U.ORG_ID
        WHERE PA.PROJ_ID = ?
        AND PA.ORG_ID = ?
    `;

    db.query(getSql, [projId, orgId], (error, result) => {
        if (error) {
            console.log("Error occurred:", error);
            return res.status(500).json({ error });
        }

        const formatted = formattedData(result);
        return res.status(200).json({ data: formatted });
    });
};



module.exports = {getSchedulers}