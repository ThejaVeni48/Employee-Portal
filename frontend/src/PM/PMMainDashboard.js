import React from "react";

import { useSelector } from "react-redux";









const PMMainDashboard = ()=>{
  const role = useSelector((state) => state.Role);


    return(


        <>
        <p>{role}</p>

<p>Over all dashboard of {role}</p>

        
        
        </>
    )







}


export default PMMainDashboard