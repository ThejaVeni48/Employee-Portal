// this api is used for getting the employees who are not super admin




const db = require('../../config/db');


const getEmployees = (req,res)=>{

    const {companyId} = req.query;


    console.log("COMPANYiD getEMp",companyId);
    


    const sql = `SELECT DISTINCT U.DISPLAY_NAME, UA.*
FROM TC_USERS U
 JOIN TC_ORG_USER_ASSIGNMENT UA
  ON UA.EMP_ID = U.EMP_ID
 AND UA.ORG_ID = U.ORG_ID
 AND UA.ROLE_CODE <> 'SUPER_USER'
 WHERE U.ORG_ID = ?`;




db.query(sql,[companyId],(error,result)=>{
    if(error)
    {
        console.log("Error occured",error);
        return res.status(500).json({data:error})
        
    }

    console.log("Return for result emps",result);

    return res.status(200).json({data:result,status:200})
    
})










}


module.exports = {getEmployees}