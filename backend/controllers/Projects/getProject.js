// this api is used for getting the projects for company.

// This API returns projects for a company, but:
//  Admin sees everything
//  Employee sees only projects they’re assigned to.


const db = require('../../config/db');



const getProject = (req,res)=>{

    const {companyId,empId,role} = req.query;


     console.log("companyId",companyId);
    console.log("empId",empId);
    console.log("role",role);


    if(role ==='SUPER_USER' || role === 'Org Admin')

        
        {
    console.log("org admin");
const sql = `SELECT P.*, COUNT(PA.EMP_ID) AS EMP_COUNT FROM 
 TC_PROJECTS_MASTER P 
 LEFT JOIN TC_PROJECTS_ASSIGNEES PA
 ON P.PROJ_ID = PA.PROJ_ID
 AND P.ORG_ID = PA.ORG_ID
 WHERE  P.ORG_ID = ?
 GROUP BY P.PROJ_ID;`;



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