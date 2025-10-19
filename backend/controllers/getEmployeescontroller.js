
const db = require('../config/db');


const getEmp = (req,res)=>{
    const {companyId,empId} = req.query;

    const getEmp = `
   SELECT EL.ROLE,EL.EMP_ID,
    ED.FIRST_NAME,ED.LAST_NAME, ED.DEPARTMENT,ED.EMAIL
    FROM EMPLOYEES_DETAILS ED
    JOIN EMPLOYEES_LOGINS EL
    ON ED.EMP_ID = EL.EMP_ID AND ED.COMPANY_ID = EL.COMPANY_ID
    WHERE ED.COMPANY_ID = ?  AND ED.EMP_ID <> ?`;

    db.query(getEmp,[companyId,empId],(error,result)=>{
        if(error)
        {
            console.log("error occured during getting emp list",error);
            return res.status(500).json({data:error})
            
        }


        console.log("result for emp list ",result);
        return res.status(200).json({data:result

        })       
    })

}


module.exports = {getEmp};