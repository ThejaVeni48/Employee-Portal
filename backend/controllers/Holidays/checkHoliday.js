const db = require('../../config/db');



const checkHolidays = (req,res)=>{




    const {companyId,weekStart,weekEnd} = req.body;


  //     console.log("weekEnd holi",weekEnd);
  // console.log("weekStart holi",weekStart);
    // dates is passing as array

    // console.log("companyId holidasy",companyId);
    // console.log("dates holidasy",dates);
    

    // const placeholders = dates.map(() => "?").join(",");
  // console.log("placeholders for check holidasy", placeholders);

  // console.log("placeholders holidasy",placeholders);
  


    const sql = `
SELECT *
FROM HOLIDAYS
WHERE COMPANY_ID = ?
AND START_DATE >= ? AND END_DATE <= ?

`;

db.query(sql,[companyId,weekStart,weekEnd],(error,result)=>{
    if(error)
    {
        // console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }

    // console.log("result for check holidays",result);
    return res.status(201).json({data:result})
    
})


}



module.exports = {checkHolidays}