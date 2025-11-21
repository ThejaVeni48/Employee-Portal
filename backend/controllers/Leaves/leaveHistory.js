// leaveHistory


const db= require('../../config/db');

// this api is used for getting the leaves taken by the employee

//leaves history for employee

const leaveHistory = (req,res)=>{
    const {empId,companyId} = req.query;
    


    const sql = `
    SELECT LR.*,
        L.LEAVE_NAME
 FROM LEAVES_REQUESTS LR
 JOIN LEAVES L
 ON LR.LEAVE_ID = L.LEAVE_ID
    WHERE LR.EMP_ID = ? AND LR.COMPANY_ID = ?
    `;

    db.query(sql,[empId,companyId],(err,result)=>{
        if(err)
        {
            // console.log("error occured",err);
            return res.status(500).json({data:err});
        }
        // console.log("result",result);
        return res.status(200).json({data:result})
        
    })
    
}


module.exports = {leaveHistory};