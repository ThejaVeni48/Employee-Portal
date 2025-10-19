
const db = require('../config/db');

// this api is used for getting the pending leaves of the employees to the manager

const getPendingLeaves = (req,res)=>{
   const {companyId} = req.query
    
    const sql =`
SELECT E.FIRST_NAME,E.LAST_NAME,L.START_DATE,L.END_DATE,L.DAYS,L.REASON,L.EMP_ID,L.REQUEST_ID,L.STATUS
FROM EMPLOYEEs_DETAILS E
JOIN LEAVES_REQUESTS L
ON E.EMP_ID = L.EMP_ID
AND E.COMPANY_ID = L.COMPANY_ID
WHERE L.STATUS = 'Pending'
AND L.COMPANY_ID = ?
ORDER BY L.REQUEST_ID DESC
    `;

   db.query(sql,[companyId],(err,result)=>{
    if(err)
    {
        console.log("error occured for fetching leaves",err);
        return res.status(500).json({data:err})
        
    }
// console.log("result FOR PENDING APPROVALS",result);

    return res.status(200).json({data:result})
   })
}

module.exports = {getPendingLeaves};