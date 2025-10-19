
const { json } = require('express');
const db = require('../config/db');


const forgotPassword = (req,res)=>{


    const {empId,companyId,password} = req.body;

    const sql = `
    UPDATE EMPLOYEES_LOGINS SET PASSWORD = ? WHERE EMP_ID = ? AND COMPANY_ID = ?`;


    db.query(sql,[empId,companyId,password],(Error,result)=>{
        if(Error)
        {
            console.log("error ",Error);
            return res.status(500).json({data:json})
            
        }
        console.log("result for password update",result);
        return res.status(200).json({data:result})
        
    })
}

module.exports = {forgotPassword}