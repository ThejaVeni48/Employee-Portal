const db = require('../../config/db');



const getApproveHierarchy = (req,res)=>{



   const { projectId, orgId} = req.query;


    const sql = `SELECT U.DISPLAY_NAME,PH.APPROVER_ID, PH.LINE_NO,PH.STATUS
FROM TC_PROJ_HIER_LIST PH
JOIN TC_PROJECTS_MASTER P
ON P.PROJ_ID = PH.PROJ_ID
AND P.ORG_ID = PH.ORG_ID
JOIN TC_USERS U
ON PH.APPROVER_ID = U.EMP_ID
AND PH.ORG_ID = U.ORG_ID
WHERE PH.PROJ_ID = ?
AND PH.ORG_ID = ?`;

   db.query(sql,[projectId,orgId],(error,result)=>{
    if(error)
    {
        console.log("Error occured",error);
        return res.status(500).json({data:error})
        
    }

    console.log("Result for approver Hierarchy",result);
    return res.status(200).json({data:result})
    
   })





}


module.exports = {getApproveHierarchy}