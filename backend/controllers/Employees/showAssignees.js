// this api is used for reporting manager to show the list of assigned employes.




const db = require('../../config/db');
const moment = require('moment');

const showAssignees = (req,res)=>{


    const {empId,orgId} = req.query;
console.log("empId",empId);
console.log("orgId",orgId);


    if(!empId || !orgId)
{
    return res.status(400).json({
        success:false,
      message: "ORG_ID, EMP_ID  are required"
    })
}
 const today = moment().format('YYYY-MM-DD');
  const ACTIVE = "A";
  const INACTIVE = "I";

  // step1: checking if the empid has any assigned employees

    const checkSql = `SELECT U.DISPLAY_NAME,
       U.EMP_ID,
       U.EMAIL,
       U.START_DATE,
       U.STATUS
       FROM TC_USERS U
       JOIN TC_EMPLOYEE_MANAGER_MAP M
       ON U.EMP_ID = M.EMP_ID
       AND U.ORG_ID = M.ORG_ID
      WHERE M.MANAGER_ID = ?
  AND M.ORG_ID = ?
  AND M.STATUS = ?
  AND ? >= M.START_DATE
  AND (M.END_DATE IS NULL OR ? <= M.END_DATE);`;


db.query(checkSql,[empId,orgId,ACTIVE,today,today],(checkError,checkResult)=>{
    if(checkError)
    {

        console.log("checkError",checkError);
        
        return res.status(500).json({data:checkError});
    
    }
// console.log("checkResult",checkResult);
    return res.status(200).json({data:checkResult})

   
})








}


module.exports = {showAssignees}