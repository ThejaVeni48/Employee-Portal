import React, { useEffect, useState } from "react";
import "../../Admin/AdminDashboard.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdDashboard,
  MdPeople,
  MdLogout,
} from "react-icons/md";

import { HiOutlineArrowLongLeft } from "react-icons/hi2";





const PMProjectsDashboard  = ()=>{

     const [sideBar] = useState(true);
  const navigate = useNavigate();
  const companyId = useSelector((state) => state.companyId);
  const domain = useSelector((state) => state.domain);
  const role = useSelector((state) => state.Role);
  const createdBy = useSelector((state) => state.createdBy);

  console.log("DOMAIN", domain);
  console.log("companyId", companyId);

  const location = useLocation();

  const menuItems = [
    {
      section: "My Projects",
      name: "My Projects",
      icon: <MdDashboard />,
      path: "pmprojects",
    },
    {
      section: "Organization",
      name: "Tasks",
      icon: <MdPeople />,
      path: "pmtasks",
    },
   
  ];

  const sections = [...new Set(menuItems.map((item) => item.section))];


   useEffect(() => {
    if (location.pathname === "/pmprojectsdashboard") {
      navigate("pmprojects", { replace: true });
    }
  }, []);
  
  

  const styles = {
    // backbtnContainer:{
    
    
    // },
    btnStyles:{
      border:'none',
      backgroundColor:'transparent',
      display:'flex',
    alignItems:'center',
    }
  }

    return(

        <>
     <div className="mainContainer">
        <aside className={`leftSection ${sideBar ? "expanded" : "collapsed"}`}>
          <div className="sidebarHeader backbtnContainer">
            <button style={styles.btnStyles} onClick={()=>navigate('/pmDashboard')}><HiOutlineArrowLongLeft size={20}/>Back To Dashboard</button>
          </div>

          <div className="dashboardSections">
            {sections.map((section) => (
              <div key={section} className="menuSection">
                <ul>
                  {menuItems
                    .filter((item) => item.section === section)
                    .map((item, idx) =>
                     
                        <li
                          key={idx}
                          onClick={() =>
                            navigate(`/pmprojectsdashboard/${item.path}`, {
                              state: { createdBy, role },
                            })
                          }
                        >
                          <span className="icon">{item.icon}</span>
                          <span className={`text ${sideBar ? "" : "hidden"}`}>
                            {item.name}
                          </span>
                        </li>
                      )
                    }
                </ul>
              </div>
            ))}
          </div>

          <button className="logoutBtn" onClick={() => navigate("/")}>
            <MdLogout />
            <span className={sideBar ? "" : "hidden"}>Logout</span>
          </button>
        </aside>

        <main className={`rightSection ${sideBar ? "" : "expanded"}`}>
          {/* <Header /> */}
          <div className="contentContainer" key={location.pathname}>
            <Outlet />
          </div>

        </main>

      
      </div>
        
        
        
        </>
    )





}

export default PMProjectsDashboard