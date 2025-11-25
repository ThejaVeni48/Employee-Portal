

const db = require('../../config/db');


const getTask = (req,res)=>{


    const {projectId,companyId} = req.query;


    const sql = `SELECT * FROM TASKS WHERE PROJ_ID = ? AND ORG_ID = ?`;


    db.query(sql,[projectId,companyId],(err,result)=>{
        if(err)
        {
            console.log("Error occured",err);
            return res.status(500).json({data:err})
            
        }
        console.log("Result for tasks get",result);
        return res.status(200).json({data:result})
        
    })


}


module.exports = {getTask}