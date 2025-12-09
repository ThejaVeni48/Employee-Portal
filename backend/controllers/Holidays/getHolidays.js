// this api is used for getting the  holidays



const db = require('../../config/db');



const getHoliday = (req,res)=>{


    const {orgId} = req.query;



    const getSql = `SELECT * FROM TC_HOLIDAYS
    WHERE ORG_ID = ? `;



    db.query(getSql,[orgId],(error,result)=>{
        if(error)
        {
            console.log("Error",error);
            return res.status(500).json({data:error})
            
        }

        // console.log("result for getHolidasy",r);
        
        return res.status(200).json({data:result})


    })






}


module.exports = {getHoliday}