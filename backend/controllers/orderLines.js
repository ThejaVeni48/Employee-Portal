//dummy api


const db = require('../config/db');


const orderLines = (req,res)=>{



    const sql =     `SELECT * FROM ORDER_LINES`;


    db.query(sql,(err,result)=>{
        if(err)
        {
            console.log("error occured",err);
            return res.status(500).json({data:err,message:'DB Error'})
        }

        return res.status(200).json({data:result})
    })



}


module.exports = {orderLines}