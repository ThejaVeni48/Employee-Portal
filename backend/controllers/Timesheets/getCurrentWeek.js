// this api is used for getting the current week from the table 



const db = require('../../config/db');




const currentWeek = (req,res)=>{


    const {orgId} = req.query;


    


    const sql = `SELECT *
FROM TC_MASTER
WHERE CURDATE() <= WEEK_START
                AND ORG_ID = ? `;


  db.query(sql,[orgId],(error,result)=>{
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