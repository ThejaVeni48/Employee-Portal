const db = require('../config/db');



const checkHolidays = (req,res)=>{



    const {companyId,dates} = req.body;

    const placeholders = dates.map(() => "?").join(",");
  console.log("placeholders for check leaves", placeholders);

  console.log("placeholders",placeholders);
  


    const sql = `
SELECT *
FROM HOLIDAYS
WHERE COMPANY_ID = ?
  AND (
    (START_DATE BETWEEN ? AND ?)
    OR
    (END_DATE BETWEEN ? AND ?)
    OR
    (? BETWEEN START_DATE AND END_DATE)
  )
`;

db.query(sql,[companyId,...dates],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }

    console.log("result for check holidays",result);
    return res.status(201).json({data:result})
    
})


}



module.exports = {checkHolidays}