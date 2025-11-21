const db = require('../../config/db');



const getDefaultJobs = (req,res)=>{




const getSql = `SELECT *  FROM  SSO_ACCESS_CONTROL`;

db.query(getSql,(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error});
        
    }

    console.log("Result for Roles",result);
            return res.status(200).json({data:result,status:200});

    
})







}


module.exports = {getDefaultJobs}