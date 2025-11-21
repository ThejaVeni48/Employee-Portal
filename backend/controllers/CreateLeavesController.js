
const db = require('../config/db');



const leavesCreate = (req,res)=>{
    try{

        const {leaveType,leaveShortForm,leaveDesc,days,companyId,createdBy} = req.body;


        const code = companyId.slice(0,3);
        console.log("code",code);
        console.log("type ofcode",typeof(code));
        

        const leaveShortForm1 = leaveShortForm.toUpperCase();


        const insertSql = `
        INSERT INTO LEAVES (LEAVE_NAME,LEAVE_SHORTFORM,DAYS,DESCRIPTION,COMPANY_ID,CREATION_DATE,CREATED_BY)
         VALUES(?,?,?,?,?,NOW(),?)`;

         db.query(insertSql,[leaveType,leaveShortForm1,days,leaveDesc,companyId,createdBy],(error,result)=>{
            if(error)
            {
                console.error("error occured",error);
                return res.status(500).json({data:error})
                
            }

            console.log("result",result);
            return res.status(200).json({data:result,status:201,leaveType:leaveType})
            
         })

    }
    catch(error)
    {
        console.error("error occured catch block",error);
        
    }
}

module.exports = {leavesCreate};