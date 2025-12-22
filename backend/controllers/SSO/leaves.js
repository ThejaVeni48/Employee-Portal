
// this api is used for creating leaves by the SSo

const db = require('../../config/db');



const createLeaves = (req,res)=>{



    const {leaveName,description,leaveCode,newStatus,userId} = req.body;



    const insertSql = `INSERT INTO GA_LEAVES(LEAVE_TYPE,LEAVE_CODE,LEAVE_DESC,LEAVE_STATUS,CREATED_BY,CREATION_DATE)
    VALUES (?,?,?,?,?,NOW())`;



    db.query(insertSql,[leaveName,leaveCode,description,newStatus,userId],(insertError,insertResult)=>{
        if(insertError)
        {
            console.log("InsertError",insertError);
            return res.status(500).json({data:insertError})
            
        }


        console.log("insertResult",insertResult);
                    return res.status(200).json({data:insertResult})

        
    })









}

module.exports = {createLeaves}