
const db = require('../config/db');


const showDept = (req,res)=>{
    const {companyId} = req.query;

//     const sql =`
//     SELECT D.DEPT_NAME, D.DEPT_CODE, COUNT(E.EMP_ID) AS EMP_COUNT
//  FROM DEPARTMENTS D
//  JOIN EMPLOYEES_DETAILS E
//  ON E.COMPANY_ID = D.COMPANY_ID
//  AND E.DEPT_ID = D.DEPT_ID
//  WHERE D.COMPANY_ID = ?
//  GROUP BY D.DEPT_ID;`;

const sql = `
SELECT * FROM DEPARTMENTS WHERE COMPANY_ID = ?`;

    db.query(sql,[companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }
        console.log("result",result);
        return res.status(200).json({data:result})
        
    })
}



module.exports = {showDept};