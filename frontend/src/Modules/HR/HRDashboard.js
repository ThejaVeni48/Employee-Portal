import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdLogout,
  MdDashboard,
  MdPeople,
  MdWork,
  MdSettings,
} from "react-icons/md";
import Header from "../Header/Header";

const HRDashboard = () => {
  const [sideBar] = useState(true);
  const navigate = useNavigate();
  const companyId = useSelector((state) => state.companyId);
  const empId = useSelector((state) => state.empId);

  console.log("companyId", companyId);
  console.log("createdBy", empId);
  const location = useLocation();

  const menuItems = [
    {
      section: "Menu",
      name: "Dashboard",
      icon: <MdDashboard />,
      path: "maindashboard",
    },

    { section: "Recruitment", name: "Jobs", icon: <MdWork />, path: "jobs" },
    {
      section: "Recruitment",
      name: "Candidates",
      icon: <MdPeople />,
      path: "candidates",
    },
    {
      section: "Organization",
      name: "Employee",
      icon: <MdPeople />,
      path: "employees",
    },
    {
      section: "Organization",
      name: "Leaves",
      icon: <MdPeople />,
      path: "leavesmanagement",
    },
    {
      section: "Organization",
      name: "Department",
      icon: <MdPeople />,
      path: "adddept",
    },
    // { section: "Organization", name: "Settings", icon: <MdSettings />, path: "settings" },
    {
      section: "Organization",
      name: "Holidays",
      icon: <MdSettings />,
      path: "holidays",
    },
  ];
  useEffect(() => {
    if (location.pathname === "/hrDashboard") {
      navigate("maindashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const sections = [...new Set(menuItems.map((item) => item.section))];

  return (
    <>
      <div className="mainContainer">
        <div className={`leftSection ${sideBar ? "expanded" : "collapsed"}`}>
          <div className="dashboardSections">
            {sections.map((section) => (
              <div key={section} className="menuSection">
                <h5 className={sideBar ? "" : "hidden"}>{section}</h5>
                <ul>
                  {menuItems
                    .filter((item) => item.section === section)
                    .map((item, idx) => (
                      <li key={idx} onClick={() => navigate(item.path)}>
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
          <button className="logoutBtn" onClick={() => navigate("/")}>
            <MdLogout />
            <span className={sideBar ? "" : "hidden"}>Logout</span>
          </button>
        </div>

        <div className={`rightSection ${sideBar ? "" : "expanded"}`}>
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default HRDashboard;
