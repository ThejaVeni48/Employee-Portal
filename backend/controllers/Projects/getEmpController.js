

/// this api is used for getting the project's employee.


const db = require('../../config/db');


const getProjectEmployee = (req,res)=>{

    const {companyId,projectId} = req.query;
    console.log("companuId getProjectEmployee",companyId);
    console.log("projectId getProjectEmployee",projectId);
    


    const sql = `SELECT DISTINCT U.DISPLAY_NAME, PA.*, R.ROLE_NAME
FROM TC_PROJECTS_ASSIGNEES PA
JOIN TC_USERS U
  ON U.EMP_ID = PA.EMP_ID
  AND U.ORG_ID = PA.ORG_ID
JOIN TC_ORG_ROLES R
ON R.ROLE_CODE = PA.ROLE_CODE
AND R.ORG_ID = PA.ORG_ID
WHERE PA.ORG_ID = ? AND PA.PROJ_ID =?
AND PA.STATUS = 'YES' ;`;

    db.query(sql,[companyId,projectId],(error,result)=>{
        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

        // console.log("Result for project employee",result);
                    return res.status(200).json({data:result})

        
    })



}

module.exports = {getProjectEmployee}