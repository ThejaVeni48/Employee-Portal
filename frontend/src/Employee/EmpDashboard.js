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
  MdTask,
} from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import { FcLeave } from "react-icons/fc";
import Header from "../Header/Header";

const EmpDashboard = () => {
  const [sideBar] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const companyId = useSelector((state) => state.companyId);
  const domain = useSelector((state) => state.domain);
  const role = useSelector((state) => state.Role);
  const createdBy = useSelector((state) => state.createdBy);
  const projectId = useSelector((state) => state.projectId);
  console.log("projectId",projectId);
  

  const location = useLocation();

  const menuItems = [
    { section: "Dashboard", name: "Dashboard", icon: <MdDashboard />, path: "empMainDashboard" },
    { section: "Organization", name: "Employees", icon: <MdPeople />, path: "employees" },
    { section: "Organization", name: "Projects", icon: <FaProjectDiagram />, path: "myprojects" },
    {
      section: "Organization",
      name: "Tasks",
      icon: <MdTask />,
      path: role === "Employee" ? "emptask" : "tasks",
    },
    {
      section: "Organization",
      name: "Timesheets",
      icon: <GrScorecard />,
      isDropdown: true,
      subItems: [
        { name: "Hour Sheet", path: "weektimesheet" },
        { name: "View Timesheets", path: "timesheetsummary" },
      ],
    },
    { section: "Organization", name: "Leaves", icon: <FcLeave />, path: "empleavesummary" },
    { section: "Organization", name: "Holidays", icon: <FcLeave />, path: "holiday" },
    { section: "Organization", name: "Settings", icon: <MdSettings />, path: "settings" },
  ];

  const sections = [...new Set(menuItems.map((item) => item.section))];

  useEffect(() => {
    if (location.pathname === "/employeedashboard") {
      navigate("empMainDashboard", { replace: true });
    }
  }, []);

  const handleMenuClick = (item) => {
    if (item.isDropdown) {
      setOpenMenu(openMenu === item.name ? null : item.name);
    } else {
      navigate(`/employeedashboard/${item.path}`, { state: { createdBy, role } });
    }
  };

  return (
    <div className="mainContainer">
      <aside className={`leftSection ${sideBar ? "expanded" : "collapsed"}`}>
        <div className="sidebarHeader">
          <h2 className={sideBar ? "" : "hidden"}>{role}</h2>
        </div>

        <div className="dashboardSections">
          {sections.map((section) => (
            <div key={section} className="menuSection">
              <ul>
                {menuItems
                  .filter((item) => item.section === section)
                  .map((item, idx) => (
                    <React.Fragment key={idx}>
                      <li
                        onClick={() => handleMenuClick(item)}
                        className={`menuItem ${openMenu === item.name ? "activeMenu" : ""}`}
                      >
                        <span className="icon">{item.icon}</span>
                        <span className={`text ${sideBar ? "" : "hidden"}`}>{item.name}</span>
                      </li>

                      {item.isDropdown && openMenu === item.name && (
                        <ul className="submenu">
                          {item.subItems.map((sub, i) => (
                            <li
                              key={i}
                              onClick={() =>
                                navigate(`/employeedashboard/${sub.path}`, {
                                  state: { createdBy, role },
                                })
                              }
                              className="submenuItem"
                            >
                              <span className={`text ${sideBar ? "" : "hidden"}`}>
                                ↳ {sub.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </React.Fragment>
                  ))}
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
        <Header />
        <div className="contentContainer" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmpDashboard;
