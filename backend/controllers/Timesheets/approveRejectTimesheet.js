
const db = require('../../config/db');



// THIS API IS USED FOR ACCEPTING THE TIMESHEET

const acceptTimesheet = (req, res) => {
    
    const {weekId,approverId,empId,remarks,orgId,action} = req.body;

    const status = action === "Rejected" ? "Rejected" : "Approved";


    const sql =`UPDATE TC_TIMESHEET
    SET STATUS = ?,REMARKS = ?,APPROVER_ID = ?
    WHERE TC_MASTER_ID = ?
    AND EMP_ID =?
    AND ORG_ID = ?`;

    db.query(sql,[status,remarks,approverId,weekId,empId,orgId],(error,result)=>{
        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("Result for status" ,result);
                    return res.status(200).json({data:result})

    })
};

module.exports = {acceptTimesheet};
