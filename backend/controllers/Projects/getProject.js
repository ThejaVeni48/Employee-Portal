// this api is used for getting the projects for company.



const db = require('../../config/db');



const getProject = (req,res)=>{

    const {companyId,empId,role} = req.query;


    if(role ==='Super Admin')
{
const sql = `SELECT * FROM TC_PROJECTS_MASTER WHERE  ORG_ID = ?`;



    db.query(sql,[companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }

        // console.log("Results",result);
                    return res.status(200).json({data:result})

        
    })

}

else{

    const sql = `SELECT U.DISPLAY_NAME,PA.EMP_ID,PM.*
FROM TC_USERS U
JOIN TC_PROJECTS_ASSIGNEES PA
ON U.EMP_ID = PA.EMP_ID
AND U.ORG_ID = PA.ORG_ID
JOIN TC_PROJECTS_MASTER PM
ON PA.PROJ_ID = PM.PROJ_ID
AND PA.ORG_ID = PM.ORG_ID
 WHERE PA.EMP_ID = ?
 AND PA.ORG_ID = ? `;



    db.query(sql,[empId,companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }

        // console.log("Results for employee",result);
                    return res.status(200).json({data:result})

        
    })
}
    




}


module.exports = {getProject}