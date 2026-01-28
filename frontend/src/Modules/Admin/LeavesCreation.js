import React, { useState } from "react";
import { useSelector } from "react-redux";





const LeavesCreation = ()=>{

    const [leaveType,setLeaveType] = useState('');
    const [leaveShortForm,setLeaveShortForm] = useState('');
    const [leaveDesc,setLeaveDesc] = useState('');
    const [days,setDays] = useState('');
  const companyId = useSelector((state) => state.companyId);



    const handleSubmit = async(e)=>{
        e.preventDefault();

        console.log("leavetype",leaveType);
        console.log("leaveShortForm",leaveShortForm);
        console.log("leaveDesc",leaveDesc);
        console.log("days",days);
console.log("companyId",companyId);

        try{

            const res = await fetch("http://localhost:3001/api/leavesCreate", {

         method:'POST',
         headers:{'Content-Type':"application/json"},
         body:JSON.stringify({
            leaveType,
            leaveShortForm: leaveShortForm.toUpperCase(),
            leaveDesc,
            days,
            companyId
         })
        });

         const result = await res.json();
console.log("result",result);

         



            }

        catch(error)
        {
            console.error("error occured",error);
            
        }
        
    }


    return(
        <>
         <h4>Leaves</h4>


         <form>
            <div>
                <label>Leave Type</label>
                <input type="text" value={leaveType} onChange={(e)=>setLeaveType(e.target.value)}/>
            </div>
            <div>
                <label>Leave Shortform</label>
                <input type="text" value={leaveShortForm} onChange={(e)=>setLeaveShortForm(e.target.value)}/>
            </div>
            <div>
                <label>Leave Description</label>
                <input type="text" value={leaveDesc} onChange={(e)=>setLeaveDesc(e.target.value)}/>
            </div>
             <div>
                <label>Days</label>
                <input type="text" value={days} onChange={(e)=>setDays(e.target.value)}/>
            </div>
            <button onClick={handleSubmit}>Create</button>
         </form>
        
        </>
    )






}


export default LeavesCreation