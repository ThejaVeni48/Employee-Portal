// this api is used to apply the same hierarchy for  all.

const db = require('../../config/db');

const hierarchyforAll = (req,res)=>{



   const { projectId, orgId, empId, levels, createdBy } = req.body;


  console.log("projectId",projectId);
  console.log("orgId",orgId);
  console.log("empId",empId);
  console.log("levels",levels);
  console.log("createdBy",createdBy);


  const creationDate = new Date();
  

  if (!projectId || !orgId || !empId || !levels || levels.length === 0) {
    return res.status(400).json({ message: "Missing required fields" });
  }


 const insertQuery = `
    INSERT INTO TC_PROJ_HIER_LIST (
      PROJ_ID, ORG_ID, EMP_ID, APPROVER_ID, LINE_NO, STATUS, 
      CREATION_DATE, CREATED_BY
    )
    VALUES ?
  `;

  let values = [];



  levels.forEach((level, index) => {
    level.name.forEach((approver) => {
      values.push([
        projectId,
        orgId,
        empId,
        approver,       
        index + 1,      
        "A",
        creationDate,
        createdBy
      ]);
    });
  });

  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ message: "Failed to save hierarchy" });
    }
    console.log("result",result);
    console.log("result[0]",result.affectedRows);
    

    const res = result.affectedRows;

    console.log("res",res);

    // console.log("Result[0]",result[0])
    

    if(res>0)
    {
        const getProjEmp = `SELECT EMP_ID FROM TC_PROJECTS_ASSIGNEES 
        WHERE PROJ_ID = ? AND ORG_ID = ?`;


            db.query(getProjEmp,[projectId,orgId],(getError,getResult)=>{
                if(getError)
                {
                    console.log("getError",getError);
                    return res.status(500).json({data:getError})
                    
                }

                console.log("getResult",getResult);
                
            })
    }
    
  });






}



module.exports = {hierarchyforAll}