// this api is used to update the shifts.


const db = require('../../config/db');


const updateShift = (req,res)=>{



    const {periodType,startTime,endTime, duration,category,
      shiftDetailType,
      desc,orgId,email,status,shiftName,shiftCode,newStatus} = req.body;


    //step1: fetch the shift_id 

    const fetchSql =`SELECT SHIFT_ID FROM TC_ORG_SHIFTS
    WHERE ORG_ID = ? AND SHIFT_NAME = ? AND SHIFT_CODE = ?`;


    db.query(fetchSql,[orgId,shiftName,shiftCode],(fetchErr,fetchRes)=>{

        if(fetchErr)
        {
            console.log("fetchErr",fetchErr);
            return res.status(500).json({data:fetchErr})
            
        }
        console.log("fetchRes",fetchRes);
        
        
        const shiftId = fetchRes[0].SHIFT_ID;


        console.log("shiftUd",shiftId);
        


        // step2: update the table using shiftId

        const updateSql = `UPDATE TC_ORG_SHIFTS
        SET  PERIOD_TYPE = ?, START_TIME = ?, END_TIME = ?,DURATION = ?, CATEGORY = ?, SHIFT_DETAIL_TYPE = ?,STATUS= ?, DESCRIPTION = ?, ORG_ID = ?, LAST_UPDATED_BY = ? WHERE SHIFT_ID = ?`;


        db.query(updateSql,[periodType,startTime,endTime, duration,category,
      shiftDetailType,newStatus,
      desc,orgId,email,shiftId],(updateErr,updateRes)=>{
        if(updateErr)
        {
            console.log("UpdateErr",updateErr);
            return res.status(500).json({data:fetchErr})
            
        }
        return res.status(200).json({
            message:'Updated Successfully',
            status:200
        })
      })
    })







}


module.exports = {updateShift}