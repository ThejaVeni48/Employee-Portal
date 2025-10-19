const db = require('../config/db');
const moment = require('moment');


// need to check the api once

// storing in table but giving error

//working

const assignProject = (req,res)=>{

    const {companyId,selectedEmp, dept,projectId} = req.body;


    console.log("selectedEmp", selectedEmp);
    

    const date = new Date();


    const empIds = selectedEmp.map(()=>'?').join(',');
    // const getDay = date.getDate();
    // const getMonth = date.getMonth() +1;
    // const getYear = date.getYear();
     const assignedDate  =  moment(date).format("YYYY-MM-DD");

    // const assignedDate = `${getDay}-${getMonth}-${getYear}`
console.log("assdate",assignedDate);

    

    const values = selectedEmp.map((empId)=>[companyId,empId,projectId,dept,assignedDate])


    console.log("values",values);
    
    const sql = `INSERT INTO PROJECTS_EMPLOYEE (COMPANY_ID,EMP_ID,PROJECT_NO,DEPARTMENT,ASSIGNED_DATE)
                 VALUES ?`;


   db.query(sql,[values],(error,result)=>{
    if(error)
    {
        console.log("error occured",error);
        return res.status(500).json({data:error})
        
    }
    console.log("result for the assign the project",result);

    const affectedRows = result.affectedRows;
    console.log("adffe",affectedRows);
    
    // return res.status(201).json({data:result})

    const updatedStatus = 'Project';


    if(affectedRows> 0)
    {
        // console.log("update the status of the employee in employee details");

        const updateStatussql = `
        UPDATE EMPLOYEES_DETAILS
        SET STATUS = ? 
        WHERE COMPANY_ID  = ? AND EMP_ID IN (?) `;


        console.log("updateStatusSql",updateStatussql);
        

        db.query(updateStatussql,[updatedStatus,companyId,selectedEmp],(updateError,updateResult)=>{
            if(updateError)
            {
                console.log("updateError",updateError);
                return res.status(500).json({data:updateError})
                
            }

            console.log("updateResult",updateResult);
                            return res.status(200).json({data:updateResult})

            
        })

        

        
    }
    else{
        console.log("update error");
        
    }


    
   })


}


module.exports = {assignProject}