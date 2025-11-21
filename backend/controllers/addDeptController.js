
const db = require('../config/db');


function generateDeptCode(deptName,companyId)
{
    const id = companyId.slice(0,3);
    const name = deptName.slice(0,3).toUpperCase();
    const deptCode = `${id}-${name}`

    return deptCode;
}

const addDept=(req,res)=>{
    const {deptName,companyId,createdBy} = req.body;

    console.log("crearedby",createdBy);
    

      const deptCode = generateDeptCode(deptName,companyId)

      const insertSql = `
      INSERT INTO DEPARTMENTS(DEPT_NAME,COMPANY_ID,DEPT_CODE,CREATION_DATE,CREATED_BY)
      VALUES(?,?,?,NOW(),?)`;

      db.query(insertSql,[deptName,companyId,deptCode,createdBy],(insertError,insertResult)=>{
        if(insertError)
        {
            console.log("error occured during dept inserting",insertError);
            return res.status(500).json({data:insertError})
            
        }
        console.log("successfully entered dept",insertResult);
        return res.status(201).json({data:insertResult,status:201,deptName:deptName})
        
      })

}



module.exports = {addDept};