const db = require('../config/db');


const getPM = (req,res)=>{
    const {companyId,dept} = req.query;

    console.log("companyId",companyId);
    console.log("dept",dept);
    

    const role = 'Project Manager';


    const sql = `
    SELECT ED.DISPLAY_NAME, ED.DEPARTMENT, EL.ROLE,ED.EMP_ID
FROM EMPLOYEES_DETAILS ED
JOIN EMPLOYEES_LOGINS EL
ON ED.EMP_ID = EL.EMP_ID
AND ED.COMPANY_ID = EL.COMPANY_ID
WHERE ED.ROLE = ?
AND ED.COMPANY_ID = ?
AND ED.DEPARTMENT = ? `;


    db.query(sql,[role,companyId,dept],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("result",result);
        return res.status(200).json({data:result})
        
    })
}

module.exports = {getPM};