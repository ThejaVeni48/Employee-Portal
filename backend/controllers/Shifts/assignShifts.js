// this api is used for assigning the shifts to the employee.



const db  = require('../../config/db');
const moment = require('moment');


const assignShift = (req,res)=>{


    const {orgId,shiftId,empId,shiftCode,email}  = req.body;


    const today = moment().format('YYYY-MM-DD');

    const status = 'A';

//    step1: fetch the shift i



    const insertSql = `INSERT INTO TC_SHIFT_ASSIGNMENT (SHIFT_CODE,EMP_ID,ORG_ID,START_DATE,STATUS,CREATED_BY)
    VALUES (?,?,?,?,?,?)`;

    db.query(insertSql,[shiftCode,empId,orgId,today,status,email],(insertErr,insertRes)=>{
        if(insertErr)
        {
            console.log("insertErr",insertErr);
            return res.status(500).json({data:insertErr})
            
        }

        return res.status(201).json({
            message:'Shift assigned successfully',
            status:201
        })
    })




}


module.exports = {assignShift}