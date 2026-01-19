// this api is used for getting the employees who are not super admin




const db = require('../../config/db');


const getEmployees = (req,res)=>{

    const {companyId} = req.query;


    const sql = `SELECT  DISTINCT U.*
FROM TC_USERS U
JOIN TC_ORG_USER_ASSIGNMENT UA
ON U.EMP_ID = UA.EMP_ID
AND U.ORG_ID = UA.ORG_ID
JOIN TC_ORG_ROLES R
ON R.ROLE_CODE = UA.ROLE_CODE
AND R.ORG_ID = UA.ORG_ID
WHERE R.ROLE_NAME <> 'Super Admin'
AND U.ORG_ID = ? `;


db.query(sql,[companyId],(error,result)=>{
    if(error)
    {
        console.log("Error occured",error);
        return res.status(500).json({data:error})
        
    }

    // console.log("Return for result emps",result);

    return res.status(200).json({data:result,status:200})
    
})










}


module.exports = {getEmployees}