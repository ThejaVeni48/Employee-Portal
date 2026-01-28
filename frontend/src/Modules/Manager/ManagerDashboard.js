import React, { useEffect, useState } from "react";
import "../Admin/AdminDashboard.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdDashboard,
  MdPeople,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import { FcLeave } from "react-icons/fc";
import Header from "../Header/Header";

const ManagerDashboard = () => {
  const [sideBar] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null); // 👈 added for nested dropdown
  const navigate = useNavigate();
  const companyId = useSelector((state) => state.companyId);
  const domain = useSelector((state) => state.domain);
  const role = useSelector((state) => state.Role);
  const createdBy = useSelector((state) => state.createdBy);
  const projectId = useSelector((state) => state.projectId);
  const deptId = useSelector((state) => state.deptId);

  const location = useLocation();

  const menuItems = [
    {
      section: "Dashboard",
      name: "Dashboard",
      icon: <MdDashboard />,
      path: "mngmainDashboard",
    },
      {
      section: "Organization",
      name: " My Activity",
      icon: <GrScorecard />,
      isDropdown: true,
      subItems: [
        {
          name: "Timesheets",
          isDropdown: true,
          subItems: [
        { name: "Hour Sheet", path: "weektimesheet" },
        { name: "View Timesheets", path: "timesheetsummary" },
      ],
        },
        {
          name: "Leaves",
         icon: <FcLeave />, path: "empleavesummary"
         
        },
      ],
    },
    {
      section: "Organization",
      name: "Employees",
      icon: <MdPeople />,
      path: "employees",
    },
    {
      section: "Organization",
      name: "Projects",
      icon: <FaProjectDiagram />,
      path: "myprojects",
    },
    {
      section: "Organization",
      name: "Timesheets",
      icon: <GrScorecard />,
      path: "timesheetapprovals",
    },
    {
      section: "Organization",
      name: "Leaves",
      icon: <FcLeave />,
      path: "leavesrequest",
    },
    {
      section: "Organization",
      name: "Holidays",
      icon: <FcLeave />,
      path: "holiday",
    },
      { section: "Organization", name: "My Timesheets", icon: <MdSettings />, path: "weektimesheet" },
        { section: "Organization", name: "My Leaves", icon: <MdSettings />, path: "empleavesummary" },
    {
      section: "Organization",
      name: "Settings",
      icon: <MdSettings />,
      path: "settings",
    },
  
  ];

  const sections = [...new Set(menuItems.map((item) => item.section))];

  useEffect(() => {
    if (location.pathname === "/managerdashboard") {
      navigate("mngmainDashboard", { replace: true });
    }
  }, []);

  const handleMenuClick = (item) => {
    if (item.isDropdown) {
      setOpenMenu(openMenu === item.name ? null : item.name);
      setOpenSubMenu(null); // close nested when switching main
    } else {
      navigate(`/managerdashboard/${item.path}`, { state: { createdBy, role } });
    }
  };

  const handleSubMenuClick = (sub) => {
    if (sub.isDropdown) {
      setOpenSubMenu(openSubMenu === sub.name ? null : sub.name);
    } else {
      navigate(`/managerdashboard/${sub.path}`, { state: { createdBy, role } });
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
                        className={`menuItem ${
                          openMenu === item.name ? "activeMenu" : ""
                        }`}
                      >
                        <span className="icon">{item.icon}</span>
                        <span className={`text ${sideBar ? "" : "hidden"}`}>
                          {item.name}
                        </span>
                      </li>

                      {/* ✅ First-level dropdown */}
                      {item.isDropdown && openMenu === item.name && (
                        <ul className="submenu">
                          {item.subItems.map((sub, i) => (
                            <React.Fragment key={i}>
                              <li
                                onClick={() => handleSubMenuClick(sub)}
                                className="submenuItem"
                              >
                                <span
                                  className={`text ${sideBar ? "" : "hidden"}`}
                                >
                                  ↳ {sub.name}
                                </span>
                              </li>

                              {/* ✅ Second-level dropdown (Hour Sheet) */}
                              {sub.isDropdown && openSubMenu === sub.name && (
                                <ul className="nestedMenu">
                                  {sub.subItems.map((nested, j) => (
                                    <li
                                      key={j}
                                      className="nestedItem"
                                      onClick={() =>
                                        navigate(
                                          `/managerdashboard/${nested.path}`,
                                          {
                                            state: { createdBy, role },
                                          }
                                        )
                                      }
                                    >
                                      ↳ {nested.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </React.Fragment>
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

export default ManagerDashboard;
