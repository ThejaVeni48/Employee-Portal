// this api is used for getting the current week from the table 



const db = require('../../config/db');




const currentWeek = (req,res)=>{


    const {currentDate,orgId} = req.query;


    const sql = `SELECT * FROM TC_MASTER
                WHERE ? BETWEEN WEEK_START AND WEEK_END
                AND ORG_ID = ? `;


  db.query(sql,[currentDate,orgId],(error,result)=>{
    if(error)
    {
        console.log("Error occured",error);
        return res.status(500).json({data:error})
        
    }

    console.log("result for weeks",result);
    return res.status(200).json({data:result})
    
  })






}


module.exports = {currentWeek}