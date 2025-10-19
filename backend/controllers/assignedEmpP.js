const db = require('../config/db');

const assignedEmpP = (req,res)=>{


    const {projectId,companyId} = req.query;

    console.log("projectId",projectId);
    console.log("companyId",companyId);
    


    const sql = `
SELECT  E.EMP_ID,E.DISPLAY_NAME, P.ASSIGNED_DATE,P.DEPARTMENT
FROM PROJECTS_EMPLOYEE P 
JOIN EMPLOYEES_DETAILS E
ON P.COMPANY_ID = E.COMPANY_ID
AND P.EMP_ID = E.EMP_ID
WHERE P.PROJECT_NO = ? AND P.COMPANY_ID = ?`;

    db.query(sql,[projectId,companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:result});
            
        }
        console.log("result for project employeess",result);
        return res.status(200).json({data:result})
        
    })




}


module.exports = {assignedEmpP}