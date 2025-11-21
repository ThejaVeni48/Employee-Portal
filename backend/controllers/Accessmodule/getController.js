const db = require('../../config/db');



const getOrgAccess = (req,res)=>{


const {companyId}= req.query;


const getSql = `SELECT * FROM TC_ORG_ACCESS WHERE ORG_ID = ?`;

db.query(getSql,[companyId],(error,result)=>{
    if(error)
    {
        // console.log("error occured",error);
        return res.status(500).json({data:error});
        
    }

    // console.log("Result for getDesignation",result);
            return res.status(200).json({data:result,status:200});

    
})







}


module.exports = {getOrgAccess}