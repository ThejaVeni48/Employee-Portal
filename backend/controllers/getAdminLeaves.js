// this api is used for getting the leaves by the admin
const db = require('../config/db');



const getAdminLeaves = (req,res)=>{


    const {companyId} = req.query;

    const sql = `SELECT ED.DISPLAY_NAME,
       ED.EMP_ID,
       D.DEPT_NAME,
       LR.DAYS,
       LR.STATUS,
       LR.REASON,
       LR.START_DATE,
       LR.END_DATE
       FROM EMPLOYEES_DETAILS ED
       JOIN DEPARTMENTS D
       ON ED.DEPT_ID = D.DEPT_ID
       JOIN LEAVES_REQUESTS LR
       ON ED.EMP_ID = LR.EMP_ID
       WHERE ED.COMPANY_ID = ?`;


    db.query(sql,[companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }
        console.log("result for admin leaves",result);
        return res.status(200).json({data:result})
        
    })


}

module.exports = {getAdminLeaves}