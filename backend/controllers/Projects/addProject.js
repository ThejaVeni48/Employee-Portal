// this api is used for creating a new project




const db = require('../../config/db');
const moment = require('moment');


const addProject = (req,res)=>{

    const {          projectName,
              startDate,
              endDate,
              projectCode,
              projDesc,
              supportId,
              status,
              clientId,
              clientName,
              billable,
              hierachy,
              companyId,
              email} = req.body;

              const now = moment().format('');


const sql =` INSERT INTO TC_PROJECTS_MASTER (ORG_ID,PROJ_NAME,PROJ_CODE,PROJ_DESC,START_DATE,END_DATE,SUPPORT_IDENTIFIER,CURRENT_STATUS,CLIENT_ID,CLIENT_NAME,BILLABLE,HIERARCHY,CREATED_BY,CREATION_DATE)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)
`;

db.query(sql,[companyId,projectName,projectCode,projDesc,startDate,endDate,supportId,status,clientId,clientName,billable,hierachy,email,now],(error,result)=>{
    if(error)
    {
        console.log("Error occured",error);
        return res.status(500).json({data:error})
        
    }
    console.log("Result for project creation",result);
    return res.status(201).json({data:result})
    
})





}


module.exports = {addProject}