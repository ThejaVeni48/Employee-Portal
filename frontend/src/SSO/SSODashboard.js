import React, { useEffect, useState } from "react";

import "../Admin/AdminDashboard.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdDashboard,
  MdPeople,
  MdWork,
  MdSettings,
  MdLogout,

} from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import Header from "../Header/Header";




const SSODashboard = ()=>{

  const [sideBar] = useState(true);
  const userId = useSelector((state) => state.userId);

  // console.log("userId",userId);

    const navigate = useNavigate();
  

    const menuItems = [
        { section: "Organisation", name: "Organisation", icon: <MdDashboard />, path: "companies" },
        { section: "Organisation", name: "Roles", icon: <MdDashboard />, path: "roles" },
        { section: "Organisation", name: "Designation", icon: <MdDashboard />, path: "designation" },
        { section: "Organisation", name: "Access Control", icon: <MdDashboard />, path: "jobs" },
       
      ];
    
        const sections = [...new Set(menuItems.map((item) => item.section))];



   


    return(
        <>
        
     <div className="mainContainer">
      <aside className={`leftSection ${sideBar ? "expanded" : "collapsed"}`}>
        <div className="sidebarHeader">
          <h2 className={sideBar ? "" : "hidden"}>SSO</h2>
        </div>

        <div className="dashboardSections">
          {sections.map((section) => (
            <div key={section} className="menuSection">
                            <ul>
                {menuItems
                  .filter((item) => item.section === section)
                  .map((item, idx) => (
                    <li
                      key={idx}
                      onClick={()=>navigate(`/SSODashboard/${item.path}`)}
                    //   onClick={() => navigate(`/adminDashboard/${item.path}`, { state: { createdBy, role } })}

                    >
                      <span className="icon">{item.icon}</span>
                      <span className={`text ${sideBar ? "" : "hidden"}`}>
                        {item.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <button className="logoutBtn" onClick={()=>navigate('/')}>
          <MdLogout />
          <span className={sideBar ? "" : "hidden"}>Logout</span>
        </button>
      </aside>

      <main className={`rightSection ${sideBar ? "" : "expanded"}`}>
  <Header />
  <div className="contentContainer">
    <Outlet />
  </div>
</main>

    </div>
        
        </>
    )








}


export default  SSODashboard