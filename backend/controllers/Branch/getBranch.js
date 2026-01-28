
const db  = require('../../config/db');


const getBranch = (req,res)=>{




    const {orgId} = req.query;

    console.log("orgId",orgId);
    


    const sql = `SELECT * FROM TC_BRANCH WHERE ORG_ID = ?`;


    db.query(sql,[orgId],(error,result)=>{

        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

        return res.status(200).json({data:result})
    })






}


module.exports = {getBranch}