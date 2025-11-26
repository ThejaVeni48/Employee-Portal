
// this api is used for defining the hierarchy of the project if hierarchy is enabled



const db = require('../../config/db');



const approvalHierarchy = (req,res)=>{



    const {empId,projectId,hierarchyLevel,status,orgId,email} = req.body;


    const insertSql = `INSERT INTO TC_PROJ_HIER_LIST
    (PROJ_ID,APPROVER_ID,ORG_ID,LINE_NO,STATUS,CREATED_BY,CREATION_DATE)
    VALUES(?,?,?,?,?,?,NOW())`;

    db.query(insertSql,[projectId,empId,orgId,hierarchyLevel,status,email],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("result for approvalHierarchy",result);
        return res.status(201).json({data:result})
        
    })
}


module.exports = {approvalHierarchy}