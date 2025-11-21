
const db = require("../config/db");
const moment = require("moment");



const assignLeaves =(req,res)=>{

    const {selectedEmployee,companyId,selectedLeaveType,createdBy} = req.body;

    console.log("selectedLeaveType",selectedLeaveType);
    

    const sql =`SELECT HIRE_DATE FROM EMPLOYEES_DETAILS WHERE EMP_ID= ? AND COMPANY_ID = ?`;

    db.query(sql,[selectedEmployee,companyId],(error,result)=>{
        if(error)
        {
            console.log("error occured",error);
            return res.status(500).json({data:error})
            
        }
        console.log("result",result);
        // return res.status(201).json({data:result})
        const xy = result[0]. HIRE_DATE;


        const getMonth = new Date(xy);
        const getMonth1 = getMonth.getMonth()+1;

        const months = 12 - getMonth1 + 1;

        console.log("getMonth1",getMonth1);
        

        const daysPerMonth = 1;

        const totalLeaves = months * daysPerMonth ;

        const usedLeaves = 0;

        const availableLeaves = totalLeaves - usedLeaves;
  const insertDate =moment().format("YYYY-MM-DD HH:mm:ss");
 

        const value = selectedLeaveType.map((leaveId)=>[selectedEmployee,companyId,totalLeaves,usedLeaves,availableLeaves,leaveId,insertDate,createdBy])




        // console.log("leaves",leaves);


        const insertLeaves =  `
        INSERT INTO EMPLOYEE_ALLOCATION (EMP_ID,COMPANY_ID,TOTAL_LEAVES,USED_LEAVES,AVAILABLE_LEAVES,LEAVE_ID,CREATION_DATE,CREATED_BY) 
        VALUES ? `;

        db.query(insertLeaves,[value],(insertError,insertResult)=>{
            if(insertError)
            {
                console.log("insertError",insertError);
                        return res.status(500).json({data:insertError})

                
            }
                            console.log("insertResult",insertResult);
                                                    return res.status(200).json({data:insertResult})



        })
        

        

        
    })

};


module.exports = {assignLeaves};