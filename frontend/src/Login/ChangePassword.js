import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

import { Outlet, useLocation, useNavigate } from "react-router-dom";









const ChangePassword = ()=>{

      const companyId = useSelector((state) => state.companyId);
      const email = useSelector((state) => state.email);
      const fullName = useSelector((state) => state.fullName);
  const role = useSelector((state) => state.Role);
  const empId = useSelector((state) => state.empId);


const navigate = useNavigate();
      console.log("companyId",companyId);
    
      console.log("email",email);
      console.log("fullName",fullName);
      console.log("role",role);
      console.log("empId",empId);
      



    const [pwd,setPwd] = useState('');
    const [conPwd,setConPwd] = useState('');




    const handlePassword = async (e)=>{
        e.preventDefault();

        if(pwd.length !==conPwd.length)
        {
            alert("Both should be of same length");
            return;
        }
        if(pwd !== conPwd)
        {
            alert("Password and confirm password are not same, please check again");
            return;
        }

        


          try {
            const data = await fetch("http://localhost:3001/api/changePassword",{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         conPwd,
         companyId,
         email,
         fullName,
empId,
role
          
        }),
      });

      if (!data.ok) throw new Error("Network response was not ok");

      const result = await data.json();
      console.log("result", result);
      if(result.code ===1)
      {
        alert("Password has been updated successfully.");
        navigate('/')
      }

        
      }
        
        
        catch (error) {
            console.error("Error occured during password update",error);
            
        }

    }



    return(
        <>
        <p>ChangePassword</p>

        <input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)}

        placeholder="Enter Password" />

          <input type="password" value={conPwd} onChange={(e)=>setConPwd(e.target.value)}

        placeholder="Enter Confirm Password" />



 <button onClick={handlePassword}>update Password</button>


        
        
        </>
    )





}


export default ChangePassword