// this api is used for creating the task


const db = require('../../config/db');



const createTask = (req,res)=>{


    const {taskType,description,code,email,companyId,projectId} = req.body;

    console.log("companyId");
    


    const insertSql = `INSERT INTO TASKS(TASK_NAME,TASK_DESC,CODE,PROJ_ID,ORG_ID,CREATED_BY,CREATION_DATE)
    VALUES (?,?,?,?,?,?,NOW())`;

    db.query(insertSql,[taskType,description,code,projectId,companyId,email],(error,result)=>{
        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("Result for task creation",result);
        return res.status(201).json({data:result})
        
    })

}


module.exports = {createTask}