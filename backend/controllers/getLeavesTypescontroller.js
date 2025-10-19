
const db = require('../config/db');


const getLeaveTypes =(req,res)=>{
    const {companyId} = req.query;

    console.log("compnayId",companyId);
    

    const sql = `
    SELECT * FROM LEAVES WHERE COMPANY_ID = ?`;


    db.query(sql,[companyId],(error,result)=>{
        if(error)
        {
            console.error("error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("result for leaves types",result);
        return res.status(200).json({data:result})
        
    })
}

module.exports = {getLeaveTypes};