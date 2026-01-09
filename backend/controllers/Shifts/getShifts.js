// this api is used for getting the shifts for the org level.



const db = require('../../config/db');


const getShifts = (req,res)=>{


    const {orgId} = req.query;


    const sql = `SELECT * FROM TC_ORG_SHIFTS WHERE ORG_ID = ? `;


    db.query(sql,[orgId],(error,result)=>{
        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }
        return res.status(200).json({
            data:result,
            message:'Successfully assigned Shift',
            status:200
        })
    })





}



module.exports ={getShifts}