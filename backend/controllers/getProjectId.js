const db = require('../config/db');



const getProjectId = (req,res)=>{

    const {companyId,empId} = req.query;

    const sql = `
    SELECT * FROM PROJECTS
    WHERE COMPANY_ID = ? AND EMPLOYEE_ID = ?`;

    db.query(sql,[companyId,empId],(error,result)=>{
        if(error)
        {
            console.error("error occured",error);
            return res.status(500).json({data:error})
            
        }
        console.log("result for projectId",result);
        return res.status(201).json({data:result})
        
    })

}


module.exports = {getProjectId}