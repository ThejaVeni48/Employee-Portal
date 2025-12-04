const db = require('../../config/db');



const getApproveHierarchy = (req,res)=>{



   const { projectId, orgId} = req.query;


    const sql = `SELECT * FROM TC_PROJ_HIER_LIST PH
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