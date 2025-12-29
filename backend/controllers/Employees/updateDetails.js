// this api used for updating the user details of the employee.



const db = require('../../config/db');



const updateDetails = (req,res)=>{

    const {empId,orgId, mobile,status} = req.body;



    console.log("empId",empId);
    console.log("orgId",orgId);
    console.log("mobile",mobile);
    console.log("status",status);

    



    const updateSql = `UPDATE TC_USERS
    SET MOBILE_NUMBER = ?, STATUS = ? WHERE EMP_ID = ? AND ORG_ID = ?`;


    db.query(updateSql,[mobile,status,empId,orgId],(updateError,updateResult)=>{
        if(updateError)
        {
            console.log("UpdateError",updateError);
            return res.status(500).json({data:updateError})
            
        }

        console.log("updateResult",updateResult);

                    return res.status(200).json({data:updateResult})

    })
}

module.exports = {updateDetails}