// this api is used for getting the project holidays



const db = require('../../../config/db');



const getPHoliday = (req,res)=>{


    const {orgId,projId} = req.query;



    const getSql = `SELECT * FROM TC_PROJECT_HOLIDAYS
    WHERE ORG_ID = ? AND PROJ_ID = ? AND STATUS = 'A' `;



    db.query(getSql,[orgId,projId],(error,result)=>{
        if(error)
        {
            console.log("Error",error);
            return res.status(500).json({data:error})
            
        }

        // console.log("result for getHolidasy",r);
        
        return res.status(200).json({data:result})


    })






}


module.exports = {getPHoliday}