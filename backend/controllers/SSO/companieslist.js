const db = require('../../config/db');





const CompaniesList = (req,res)=>{


    const sql = `SELECT * FROM TC_ORG_REGISTRATIONS`;

    db.query(sql,(error,result)=>{
        if(error)
        {
            console.log("Error",error);
            return res.status(500).json({data:error})
            
        }

        console.log("result",result);
                    return res.status(200).json({data:result})

        
    })
}


module.exports = {CompaniesList}