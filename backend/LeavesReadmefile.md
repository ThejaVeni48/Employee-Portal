To create a leaves module, we need three tables

1.Leave_Requests
--> It contains attributes like Request_id, emp_id,company_id,type_of_leave,start_date,end_date,days, status, reason,comment.
emp_id and company_id is foreign keys
this table is used to store the leave request by the each employee.

2.Leaves-balance
->it contains attributes like balance_id, emp_id,company_id, leave_type,remainaing_days.

emp_id,company_id is foreign keys


 i am having a table like timesheets where we will store the status, total hous, employeeid, weekstart,

 whenever we are saving the timesheet, status will be as saved,if submitted the column is updated

 while clicking the save button, i am sending status like saved for submit also same 
 const handleSave = async () => {
    // console.log("handleSave clikcje")
    const entries = rows.map((row) => ({
      hours: row.hours.map((h) => h?.toString() || ""),
      notes: row.notes.map((n) => n || ""),
      billable: row.billable,
      projectType: row.projectType,
      dates: weeks,
       companyId,
      EmpId,
      timesheetCode
    }));
    // console.log("entries",entries);

    try {
      const res = await fetch("http://localhost:3001/api/saveTimeSheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          EmpId,
          startDate,
          totalHours,
          entries,
          status:'Saved',
        companyId,
      timesheetCode
        }),
      });
      console.log("res",res);
      
      const result = await res.json();
      console.log("result",result);
      if(result.response ===1)
      {
        alert("Timesheet is saved successfully")
        console.log ("Timesheet is saved successfully");
       
        console.log("timesheetId", result);
      }
    } catch (error) {
      console.error("error occured", error);
    }
  };
