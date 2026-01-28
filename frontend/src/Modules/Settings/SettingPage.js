import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { InputSwitch } from 'primereact/inputswitch';
        

const SettingsPage = () => {
  const [selectedDay, setSelectedDay] = useState("");

  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
    const [checked, setChecked] = useState(false);

    const [toggle,setToggle] = useState(false);


    useEffect(()=>{
       getUsersCount();
    },[]);



   const getUsersCount = async () => {
  try {
    const data = await fetch(
      `http://localhost:3001/api/getCount?orgId=${companyId}`
    );

    if (!data.ok) {
      throw new Error("Network response was not ok");
    }

    const res = await data.json();


    console.log("res fro users",res);
    

    setToggle(res.employeeCount === 0);

  } catch (error) {
    console.error("Error occurred", error);
  }
};



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

                 <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)}  disabled={toggle}/> Generate TimesheetCustomization

               <p>Note:</p>  
                <p>This button is enabled only if user present.</p> 
    </div>
  );
};

export default SettingsPage;
