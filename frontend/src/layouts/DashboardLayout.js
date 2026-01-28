import React, { useEffect, useState } from "react";


import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/Sidebar/SideBar";
import TopBar from "../components/TopBar.js/TopBar";
import { useLocation } from "react-router-dom";


const  DashboardLayout = ()=> {



  const location = useLocation();

  const navigate = useNavigate();


  
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex-1 flex flex-col">
        <TopBar />

       <main
          className="flex-1 overflow-auto p-6"
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
}


export default DashboardLayout