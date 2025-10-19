
const db = require('../config/db');


const showDept = (req,res)=>{
    const {companyId} = req.query;

    const sql =`
    SELECT * FROM DEPARTMENTS WHERE COMPANY_ID = ?`;

    db.query(sql,[companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }
        console.log("result",result);
        return res.status(200).json({data:result})
        
    })
}



module.exports = {showDept};