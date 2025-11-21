const db = require('../../config/db');



const changePassword = (req,res)=>{



    const {companyId,conPwd, email,adminName,empId,role} = req.body;



    if(role === 'Org Admin')
    {
        const updatePassword =  `UPDATE TC_ORG_REGISTRATIONS SET PASSWORD = ?,
                              LAST_UPDATED_BY = ?,LAST_UPDATED_DATE = NOW(),
                              LAST_UPDATED_LOGIN = ? WHERE ORG_ID = ?`;



    db.query(updatePassword,[conPwd,adminName, email,companyId],(updateError,updateResult)=>{
        if(updateError)
        {
            console.log("Error occured",updateError);
            return res.status(500).json({data:updateError})
            
        }
        console.log("updateResult occured",updateResult);
            return res.status(200).json({data:updateResult,code:1})
    })
    }

    else{

         const updatePassword =  `UPDATE TC_USERS SET PASSWORD = ?,
                              LAST_UPDATED_BY = ?,LAST_UPDATED_DATE = NOW()
                               WHERE ORG_ID = ? AND EMP_ID = ?`;



    db.query(updatePassword,[conPwd,email,companyId,empId],(updateError,updateResult)=>{
        if(updateError)
        {
            console.log("Error occured",updateError);
            return res.status(500).json({data:updateError})
            
        }
        console.log("updateResult occured",updateResult);
            return res.status(200).json({data:updateResult,code:1})
    })
    }




    



   


    
    












}


module.exports = {changePassword}