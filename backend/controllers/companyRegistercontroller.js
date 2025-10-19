
const db = require("../config/db");
const crypto = require('crypto');


function generateCompanyId (companyName)
{
   const prefix = companyName.slice(0,3);
   const random = crypto.randomBytes(3).toString("hex").toUpperCase();

   return `${prefix}-${random}`
   
}

function generateTimesheetCode (companyName)
{
    const name = companyName.slice(0,3);
    const num = Math.floor(10 + Math.random() * 90);
console.log("name for timesheet",name);
console.log("num for timesheet",num);

    return `${name}-${num}`

    
}

const companyRegister=(req,res)=>{
    const {firstName,lastName,companyName,email,role,address,password} = req.body;
  
  const companyId = generateCompanyId(companyName)
const timesheetCode = generateTimesheetCode(companyName)
  console.log("firstName",firstName);
  console.log("lastName",lastName);
    console.log("companyName",companyName);
    console.log("email",email);
    console.log("role",role);
    console.log("password",password);
    console.log("companyId",companyId);
    console.log("timesheetCode",timesheetCode);
    console.log("address",address);


const insertSql = `
    INSERT INTO COMPANIES_REGISTRATIONS (COMPANY_ID,FIRST_NAME,LAST_NAME,ROLE,COMPANY_NAME,EMAIL,ADDRESS,PASSWORD,TIMESHEET_CODE)
    VALUES(?,?,?,?,?,?,?,?,?)
`;

db.query(insertSql,[companyId,firstName,lastName,role,companyName,email,address,password,timesheetCode],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }
    console.log("result",result);

    return res.status(201).json({data:result,message:'Your company is registered successfully'})
    
})



    
}


module.exports = {companyRegister};