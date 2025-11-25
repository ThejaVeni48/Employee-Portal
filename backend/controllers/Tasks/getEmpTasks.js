// this api is used for getting the employee tasks.


// not use api

const db = require('../../config/db');



const EmpTask = (req,res)=>{


    const {empId,companyId} = req.query;


    const sql = `SELECT P.PROJECT_NAME,
       T.*
       FROM PROJECTS P
       JOIN TASKS T
       ON P.PROJECT_ID = T.PROJECT_ID
       AND P.COMPANY_ID = T.COMPANY_ID
       WHERE T.ASSIGNED_TO = ?
       AND T.COMPANY_ID = ?;`


    db.query(sql,[empId,companyId],(error,result)=>{
        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

                    return res.status(200).json({data:result})

    })








}


module.exports = {EmpTask}

