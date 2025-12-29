const db = require('../../config/db');



const getDesignation = (req,res)=>{


const {companyId,roleId}= req.query;



// console.log("COMPANYiD",companyId);
// console.log("roleId",roleId);







if(roleId)
{
const getSql = `SELECT * FROM TC_ORG_DESIGNATIONS WHERE ORG_ID = ? AND ROLE_ID = ?`;

db.query(getSql,[companyId,roleId],(error,result)=>{
    if(error)
    {
        // console.log("error occured",error);
        return res.status(500).json({data:error});
        
    }

    // console.log("Result for getDesignation",result);
            return res.status(200).json({data:result,status:200});

    
});

}

else
    {
        const getSql = `SELECT * FROM TC_ORG_DESIGNATIONS WHERE ORG_ID = ?`;

db.query(getSql,[companyId],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error});
        
    }

    // console.log("Result for getDesignation",result);
            return res.status(200).json({data:result,status:200});

    
});

}


}


module.exports = {getDesignation}