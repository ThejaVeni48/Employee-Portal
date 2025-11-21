
const db= require('../config/db');

// this api is used for getting the leaves taken by the employee

//leaves history for employee

const getAllLeaves = (req,res)=>{
    const {empId,companyId} = req.query;
    
    console.log("empid",empId);
    console.log("companyId",companyId);

    const sql = `
    SELECT * FROM LEAVES_REQUESTS
    WHERE EMP_ID = ? AND COMPANY_ID = ?
    `;

    db.query(sql,[empId,companyId],(err,result)=>{
        if(err)
        {
            console.log("error occured",err);
            return res.status(500).json({data:err});
        }
        console.log("result",result);
        return res.status(200).json({data:result})
        
    })
    
}


module.exports = {getAllLeaves};