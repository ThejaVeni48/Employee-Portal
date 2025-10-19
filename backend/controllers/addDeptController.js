
const db = require('../config/db');


function generateDeptCode(deptName,companyId)
{
    const id = companyId.slice(0,3);
    const name = deptName.slice(0,3).toUpperCase();
    const deptCode = `${id}-${name}`

    return deptCode;
}

const addDept=(req,res)=>{
    const {deptName,companyId} = req.body;

      const deptCode = generateDeptCode(deptName,companyId)

      const insertSql = `
      INSERT INTO DEPARTMENTS(DEPT_NAME,COMPANY_ID,DEPT_CODE)
      VALUES(?,?,?)`;

      db.query(insertSql,[deptName,companyId,deptCode],(insertError,insertResult)=>{
        if(insertError)
        {
            console.log("error occured during dept inserting",insertError);
            return res.status(500).json({data:insertError})
            
        }
        console.log("successfully entered dept",insertResult);
        return res.status(201).json({data:insertResult})
        
      })

}



module.exports = {addDept};