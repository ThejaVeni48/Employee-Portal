
const db = require("../config/db");

// API to approve/reject leave by manager
const  acceptRejectLeave =(req, res) => {
  const { requestId, action,comments } = req.body;
  const status = action === "Rejected" ? "Rejected" : "Approved";


  const updateSql = `
  UPDATE LEAVES_REQUESTS SET STATUS = ? ,COMMENTS = ? WHERE REQUEST_ID = ?`;

  db.query(updateSql,[status,comments,requestId],(error,result)=>{
    if(error)
    {
      console.log("error occured for acceptreject leave",error);
      return res.status(500).json({data:error})
      
    }
    // console.log("result for acceptreject leave",result);

    const getLeaveDetails = `
    SELECT LEAVE_ID, DAYS,EMP_ID,COMPANY_ID,START_DATE FROM LEAVES_REQUESTS WHERE REQUEST_ID = ?`;

    db.query(getLeaveDetails,[requestId],(getError,getResult)=>{
      if(getError)
      {
        console.log("getError",getError);
        return res.status(500).json({data:express.json})
      }

      console.log("getResult",getResult);
      

      const usedDays = getResult[0].DAYS;
      const date = getResult[0].START_DATE;
      console.log("USEDdAY",usedDays);
      
      const leaveId = getResult[0].LEAVE_ID;
      // const totalDays = getResult[0].TOTAL_LEAVES;

      //       console.log("totalDays",totalDays);


      // const availableDays = totalDays - usedDays;

      // console.log("availableDays",availableDays);


      // need to check here


      const getLeaveId = `SELECT * FROM EMPLOYEE_ALLOCATION WHERE LEAVE_ID = ?
      `;

      db.query(getLeaveId,[leaveId],(idError,idResult)=>{
        if(idError)
        {
          console.log("idError",idError);
          return res.status(500).json({data:idResult})
          
        }
        console.log("idReslt",idResult);

        // i need total days ,available days , used days 

        // need to update those

        const totalDays = idResult[0].TOTAL_LEAVES;

        const availableleaves = idResult[0].AVAILABLE_LEAVES;

        const availableDays = totalDays - usedDays;

        const empId = idResult[0]. EMP_ID;

        const companyId = idResult[0].COMPANY_ID;

    
            if(status === 'Approved')
    {
      const updateSql = `
      UPDATE EMPLOYEE_ALLOCATION SET USED_LEAVES = ?, AVAILABLE_LEAVES = ? WHERE LEAVE_ID = ?`;

      db.query(updateSql,[usedDays,availableDays,leaveId],(updateError,updateResult)=>{
        if(updateError)
        {
          console.log("updateError",updateError);
          return res.status(500).json({data:updateError})
          
        }
        console.log("updateResult",updateResult);
        
      })
       

      const message = `Your Leave has been ${status} for the ${date}`;
       const insertNotificationSql = `
  INSERT INTO NOTIFICATIONS (EMPLOYEE_ID, COMPANY_ID, MESSAGE,TYPE,REFERENCE_ID)
  VALUES(?,?,?,?,?)`;

  db.query(insertNotificationSql,[empId,companyId,message,'leave',leaveId],(approveError,approveResult)=>{
    if(approveError)
    {
      console.log("approveError",approveError);
      return res.status(500).json({data:approveError,status:200})
      
    }
    
    console.log(" during approveResult",approveResult);
    return res.status(500).json({data:approveResult,status:200})
    
  })

}
else{
      console.log("your leave is rejected");
       const insertNotificationSql = `
  INSERT INTO NOTIFICATIONS (EMPLOYEE_ID, COMPANY_ID, MESSAGE_TYPE,MESSAGE,STATUS)
  VALUES(?,?,?,?,?)`;

  db.query(insertNotificationSql,[empId,companyId,'leave',message,status],(approveError,approveResult)=>{
    if(approveError)
    {
      console.log("approveError",approveError);
      return res.status(500).json({data:approveError,status:201})
      
    }

    console.log(" during approveResult",approveResult);
        return res.status(500).json({data:approveResult,status:201})

  })
      
    }
    
  })



    

   
      })
      


    

   
      

   
    })



 

  



 
  
  
};

module.exports = {acceptRejectLeave};
