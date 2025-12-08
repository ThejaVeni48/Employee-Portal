

// this api used for checking the  public holidays
const db = require('../../../config/db');


const checkPHolidays = (req,res)=>{




    const {startDate,endDate,orgId,projId} = req.query;


    console.log("startDate",startDate);
    console.log("endDate",endDate);
    console.log("orgId",orgId);
    console.log("projId",projId);
    


    const checkSql = `SELECT * FROM TC_PROJECT_HOLIDAYS
    WHERE  START_DATE >= ? AND END_DATE <= ? AND PROJ_ID = ? AND ORG_ID = ?`;


    db.query(checkSql,[startDate,endDate,projId,orgId],(error,result)=>{
        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

            return res.status(200).json({data:result})
        
    })











}



module.exports = {checkPHolidays}