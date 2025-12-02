import React from "react";

import { useNavigate } from "react-router-dom";










const WelcomePage = ()=>{



    const sections = [
        {
            id:1,
            name:"SSO_Admins_logins"
        },
         {
            id:2,
            name:"Organization Admin"
        },
         {
            id:3,
            name:"Employee Login"
        }

    ]

    const navigate = useNavigate();






    const handleNav = (item)=>{
console.log("rtyui");
navigate('/login',{state:{id:item.id}})
    }




    return(
        <>
        <p>Welcome Page </p>


      {
        sections.map((item)=>(
            <>

           <button onClick={()=>handleNav(item)}>{item.name}</button>
            </>
        ))
      }
        </>

    )





}


export default  WelcomePage