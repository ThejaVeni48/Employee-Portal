
const db = require('../../config/db');

const getNotifications =(req,res)=>{
    const {companyId,empId} = req.query;

    const getSql = `
    SELECT * FROM NOTIFICATIONS WHERE EMPLOYEE_ID = ? AND COMPANY_ID = ?`;


    db.query(getSql,[empId,companyId],(getError,getResult)=>{
        if(getError)
        {
            console.log("getError",getError);
            return res.status(500).json({data:getError})
            
        }
        console.log("getResult",getResult);
                    return res.status(200).json({data:getResult})

        
    })
}


module.exports = {getNotifications};