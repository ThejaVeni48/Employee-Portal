// this api is used for showing the particular department employees


const db = require('../config/db');


const showDeptEmp = (req,res)=>{

    const {department,companyId} = req.query;

    const role = 'Employee';

    const status = 'Bench';
    
    
    const sql = `
    SELECT * FROM EMPLOYEES_DETAILS WHERE DEPARTMENT = ? AND COMPANY_ID = ? AND ROLE = ? AND STATUS = ? `;

    db.query(sql,[department,companyId,role,status],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("result for same dept employees",result );
        return res.status(200).json({data:result})
        
    })

}


module.exports = {showDeptEmp}