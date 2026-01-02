const db = require('../../config/db');





const CompaniesList = (req,res)=>{


    const sql = `SELECT 
    O.ORG_ID,
    O.ORG_NAME,
    O.ORG_EMAIL,
    O.ORG_PHONE_NUMBER,
    O.ADMIN_NAME,
    O.SECTOR,
    O.COUNTRY,
    O.CITY,
    O.TIMEZONE,
    O.STATUS        AS ORG_STATUS,

    S.ORG_SUBSCRIPTION_ID,
    S.STATUS        AS SUB_STATUS,
    S.START_DATE,
    S.END_DATE,
    S.PURCHASED_COST,

    P.PLAN_ID,
    P.PLAN_NAME,
    P.DESCRIPTION,
    P.PRICE,
    P.DURATION_DAYS,
    P.MAX_EMPLOYEES
FROM TC_ORG_REGISTRATIONS O
LEFT JOIN TC_ORG_SUBSCRIPTIONS S
    ON O.ORG_ID = S.ORG_ID
   AND S.STATUS = 'A'
LEFT JOIN GA_SUBSCRIPTION_PLANS P
    ON S.PLAN_ID = P.PLAN_ID
`;

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