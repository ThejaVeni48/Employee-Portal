// this api is used for showing the approver button based on the conditions like

// user status = A

// projectId,

// project is between the duration

// tc_approve_access = 1



const db = require('../../config/db');


const showApproveAccess = (req,res)=>{

    const {empId,companyId,currentDate} = req.query;


    // console.log("empId",empId);
    // console.log("companyId",companyId);
    // console.log("currentDate",currentDate);
    

    const checkSql = `SELECT 1
 FROM 
TC_PROJECTS_ASSIGNEES PA
JOIN TC_USERS U
ON U.EMP_ID = PA.EMP_ID
AND U.ORG_ID = PA.ORG_ID
JOIN TC_PROJECTS_MASTER P
ON P.PROJ_ID = PA.PROJ_ID
AND P.ORG_ID = PA.ORG_ID
WHERE U.STATUS = 'A'
AND PA.EMP_ID = ?
AND PA.ORG_ID = ?
AND
PA.TS_APPROVE_ACCESS = 1
AND 
? BETWEEN P.START_DATE  AND P.END_DATE `;


   db.query(checkSql,[empId,companyId,currentDate],(error,result)=>{
    if(error)
    {
        // console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }
    // console.log("result for access",result);
    return res.status(200).json({data:result})
    
   })
}




module.exports = {showApproveAccess}