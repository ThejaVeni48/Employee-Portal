// leavesummary


const db = require('../../config/db');

// this api is used for getting the available leaves

const leavesummary =(req,res)=>{
    const {empId,companyId} = req.query;
    // console.log("empiD for getting leaves",empId);
    // console.log("companyId",companyId);
    

    const getLeavesSql = `
    SELECT * FROM EMPLOYEE_ALLOCATION WHERE EMP_ID = ? AND COMPANY_ID = ?`;


    db.query(getLeavesSql,[empId,companyId],(error,result)=>{
        if(error)
        {
            // console.log("errror ocured for fetching leaves",error);
            return res.status(500).json({data:error})
            
        }
        // console.log("result for fetching leaves",result);
        return res.status(200).json({data:result})
        
    })
    
} 


module.exports = {leavesummary};