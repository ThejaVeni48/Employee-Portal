


// not working api
const db = require('../../config/db');




const getEmployees = (req,res)=>{


    const {companyId,roleId,empId} = req.query;

    console.log("role",roleId);
    
    
    
    const getSql = `
    SELECT ED.DISPLAY_NAME,
            D.DEPT_NAME,
            ED.EMP_ID,
            D.DEPT_ID
     FROM EMPLOYEES_DETAILS ED
     JOIN DEPARTMENTS D
     ON ED.DEPT_ID = D.DEPT_ID
     AND ED.COMPANY_ID = D.COMPANY_ID
     JOIN ROLES R
     ON R.ROLE_ID = ED.ROLE_ID
     AND R.COMPANY_ID = ED.COMPANY_ID
     WHERE ED.COMPANY_ID = ? AND ED.ROLE_ID = ? and ED.EMP_ID <> ?`;

    db.query(getSql,[companyId,roleId,empId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
                        return res.status(500).json({data:error})

            
        }
        console.log("result occured",result);
                        return res.status(200).json({data:result})
    })

}


module.exports = {getEmployees}