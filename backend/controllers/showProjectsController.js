const db = require('../config/db');



const showProjects = (req,res)=>{


    const {companyId} = req.query;


    const showProjects = `
    SELECT * FROM PROJECTS WHERE COMPANY_ID = ?`;

    db.query(showProjects,[companyId],(error,result)=>{
        if(error)
        {
            console.log("error",error);
            return res.status(500).json({data:error})
            
        }

        console.log("result for show projects",result);
        return res.status(200).json({data:result})
        
    })

}

module.exports = {showProjects}