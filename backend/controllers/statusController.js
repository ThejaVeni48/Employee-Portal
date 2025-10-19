
const db = require('../config/db');

const status = (req,res)=>{
    const {userId,start_date,companyId} = req.body;
    console.log("userId",userId);
    console.log("start_date",start_date);

        if (!start_date || !Array.isArray(start_date) || start_date.length === 0 || !userId) {
    return res.status(400).json({ error: "Missing or invalid data" });
  }
  const placeholders = start_date.map(() => '?').join(',');
  console.log("placeholders",placeholders);

    const checkRecords =
     `SELECT * FROM TIMESHEETS WHERE USER_ID = ? AND date IN (${placeholders}) AND COMPANY_ID =?`;


     console.log("checkrecords",checkRecords);

     const params = [...start_date, userId,companyId];

     console.log("params");


   

    db.query(checkRecords, params, (err, result) => {
        if (err) {
            console.error("DB error:", err);
            // return res.status(500).json({ message: "Database error", error: err });
        }
        console.log("result for saved",result);

        // if (result.length > 0) {
        //                 console.log("saved if status",result)
        //     // return res.json({ status: "saved", data: result });
        // } else {
        //                             console.log("saved else status",result)

        //     // return res.json({ status: "not_saved" });
        // }
    });
}


module.exports = {status}


