// this api is used for getting the employees current project.


const db = require('../../config/db');


const empProjects = (req,res)=>{


    const {empId,orgId,currentDate} = req.query;


    console.log("empId",empId);
    console.log("orgId",orgId);
    console.log("currentDate",currentDate);
    


    const getSql = ` SELECT PM.*
  FROM TC_PROJECTS_ASSIGNEES PA
  JOIN TC_USERS U
  ON U.EMP_ID = PA.EMP_ID
  AND U.ORG_ID = PA.ORG_ID
  JOIN TC_PROJECTS_MASTER PM
  ON PM.PROJ_ID = PA.PROJ_ID
  AND PM.ORG_ID = PA.ORG_ID
  WHERE PA.EMP_ID = ?
  AND PA.ORG_ID = ?
  AND ? BETWEEN PM.START_DATE AND PM.END_DATE`;

  db.query(getSql,[empId,orgId,currentDate],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }
    // console.log("result for emp Projects",result);
    return res.status(200).json({data:result})
    
  })







}


module.exports = {empProjects}