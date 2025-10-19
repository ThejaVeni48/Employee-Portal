
const db = require('../config/db');


const profileImage=(req,res)=>{
    const {userId} = req.query;
    const getImage = `
    SELECT IMAGE FROM EMPLOYEE_INFO WHERE USER_ID=? `;

    db.query(getImage,[userId],(err,result)=>{
        if(err)
            console.log("err",err);
        if(result.length >0)
        {
            const image = result[0].IMAGE;
            result[0].IMAGE = `http://localhost:3001/PUBLIC/images/${image}`
        }
                res.json({ data: result });

    })
}


module.exports = {profileImage};