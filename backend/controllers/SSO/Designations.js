
// this api is used for creating default roles by the sso



const db = require('../../config/db');


const createDefaultDesgn = (req,res)=>{




    const {designation,description,userId,roleCode,newStatus,selectedRole} = req.body;

    


    const sql = `INSERT INTO SSO_DESIGNATIONS(DESGN_NAME,DESGN_DESC,DESGN_CODE,DESGN_STATUS,ROLE_ID,CREATED_BY,CREATION_DATE)
    VALUES(?,?,?,?,?,?,NOW())`;
    

    db.query(sql,[designation,description,roleCode,newStatus,selectedRole,userId],(error,result)=>{
        if(error)
        {
            console.log("Error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("Result for creating designations",result);
        return res.status(201).json({data:result,status:201})
        
    })










}



module.exports = {createDefaultDesgn}