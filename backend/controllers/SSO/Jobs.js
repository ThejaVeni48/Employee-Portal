
// this api is used for creating the deafault jobs by the user.

const db = require('../../config/db');




const createDefaultJobs = (req,res)=>{


    const {roleName,description,userId,roleCode,newStatus} = req.body;


    console.log("roleName By",roleName);
    console.log("desc By",description);
    


    const insertSql = `
    INSERT INTO GA_Access_Control(ACCESS_NAME,STATUS,ACCESS_CODE,ACCESS_DESC,CREATED_BY,CREATION_DATE)
    VALUES(?,?,?,?,?,NOW())`;


    db.query(insertSql,[roleName,newStatus,roleCode,description,userId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }

        console.log("roles created successfully",result);
                    return res.status(201).json({data:result,status:201})

        
    })



}



module.exports = {createDefaultJobs}