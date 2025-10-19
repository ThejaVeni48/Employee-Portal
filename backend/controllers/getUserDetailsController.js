
const db = require('../config/db');


const getUserDetails =(req,res)=>{
    const {EmpId,companyId} = req.query;
    console.log("EmpId",EmpId)

    const getUserDetails = `SELECT * FROM EMPLOYEE_DETAILS WHERE EMP_ID = ? AND COMPANY_ID =?` ;

    db.query(getUserDetails,[EmpId,companyId],(err,result)=>{
        if(err)
            console.log("errror",err)
        console.log("result",result);

        if(result.length>0)
        {

            const image = result[0].IMAGE;
                    console.log("image",image);

            result[0].IMAGE = `http://localhost:3001/PUBLIC/images/${image}`;

        }

        console.log("Result",result);
        res.json({ data: result });



    })
}


module.exports = {getUserDetails};