// this api is used for getting the active projects




const db = require('../../config/db');


const activeProject = (req,res)=>{

    const {empId, companyId} = req.query;

    const sql = `SELECT P.PROJECT_NAME,P.PROJECT_ID,P.PROJECT_CODE
FROM PROJECTS P
WHERE P.PROJECT_LEAD = ?
AND P.COMPANY_ID =?
AND STATUS = 'Active'`;

db.query(sql,[empId,companyId],(error,result)=>{
    if(error)
    {
        console.log("Error occured",error);
        return res.status(500).json({data:error})
        
    }

    console.log("Result",result);
            return res.status(200).json({data:result})

})
}

module.exports = {activeProject}