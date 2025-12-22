import React, { useState } from "react";
import {  useSelector } from "react-redux";


const SettingsPage = () => {
  const [selectedDay, setSelectedDay] = useState("");

  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);



  const handleSave = async()=>{
    console.log("saved",selectedDay);
    
    try {
             const res = await fetch
             ("http://localhost:3001/api/TimesheetCustomization", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                selectedDay:Number(selectedDay),
                orgId:companyId,
                email,
               }),
             });
       
             const data = await res.json();

             console.log("data",data);
             
             
           
           } catch (error) {
      
      console.error("error occured",error);
      
    }
  }

  return (
    <div>
      <label>Select Start Day</label>
      <br />

      <select
        value={selectedDay}
        onChange={(e) => setSelectedDay(e.target.value)}
      >
        <option value="">-- Select Day --</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
        <option value="0">Sunday</option>
      </select>
                <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default SettingsPage;
