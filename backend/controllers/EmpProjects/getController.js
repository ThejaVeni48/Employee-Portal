


// this api is used for getting the employees projects
const db = require('../../config/db');



const empProjects = (req,res)=>{

const {empId,companyId} = req.query;

const sql = `SELECT 
    P.PROJECT_ID,
    P.PROJECT_NAME,
    P.CLIENT,
    P.STATUS,
    P.END_DATE,
    P.START_DATE,
    P.PROJECT_CODE,
    PM.DISPLAY_NAME AS PROJECT_MANAGER,
    TL.DISPLAY_NAME AS TEAM_LEAD
FROM PROJECTS P
JOIN PROJECTS_ASSIGNMENTS PA            /*this join for projects*/
    ON P.PROJECT_ID = PA.PROJECT_ID
    AND P.COMPANY_ID = PA.COMPANY_ID
JOIN EMPLOYEES_DETAILS PM              /*this join for project manager name*/
    ON PM.EMP_ID = P.PROJECT_MANAGER
    AND PM.COMPANY_ID = P.COMPANY_ID
JOIN EMPLOYEES_DETAILS TL              /*this join for team lead name*/
ON TL.EMP_ID  = P.PROJECT_LEAD
AND TL.COMPANY_ID = P.COMPANY_ID
WHERE PA.EMP_ID = ?
  AND PA.COMPANY_ID = ?`;

db.query(sql,[empId,companyId],(error,result)=>{
    if(error)
    {
        console.error("Error occured",error);
        return res.status(500).json({data:error})
        
    }
    console.log("Result for projects",result);
    return res.status(200).json({data:result})
})




}

module.exports = {empProjects}