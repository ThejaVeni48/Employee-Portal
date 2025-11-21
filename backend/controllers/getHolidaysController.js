
const db = require('../config/db');


const getHolidays = (req,res)=>{

    const {companyId} = req.query;


    const sql = `
    SELECT * FROM HOLIDAYS WHERE COMPANY_ID = ?`;

db.query(sql,[companyId],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }
    console.log("result for getHolidays",result);
    return res.status(200).json({data:result})
    
})

}


module.exports = {getHolidays}