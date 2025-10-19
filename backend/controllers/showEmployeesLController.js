// this api is used for showing the employees for whom did not assign leaves by the hr



const db = require('../config/db');



const showEmployeesL = (req,res)=>{

const {companyId}  = req.query;

const sql = `
SELECT * FROM EMPLOYEES_DETAILS
WHERE EMP_ID NOT IN (
SELECT EMP_ID FROM EMPLOYEE_ALLOCATION)
AND COMPANY_ID = ? AND ROLE = 'Employee'`;


db.query(sql,[companyId],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }
    console.log("result ",result);
    return res.status(200).json({data:result})
    
})

}

module.exports = {showEmployeesL}