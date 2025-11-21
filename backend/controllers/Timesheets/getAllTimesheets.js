const db = require('../../config/db');




const getAllEmpTimesheets = (req,res)=>{


    const {empId,companyId} = req.query;


    const sql = `SELECT * FROM TIMESHEETS
    WHERE EMP_ID = ? AND COMPANY_ID = ?`;

    db.query(sql,[empId,companyId],(error,result)=>{
        if(error)
        {
            // console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

        // console.log("Result",result);
        return res.status(200).json({data:result})
        
    })











}


module.exports = {getAllEmpTimesheets}