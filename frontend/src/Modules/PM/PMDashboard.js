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
import Header from "../Header/Header";

const PMDashboard = () => {
  const [sideBar] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const companyId = useSelector((state) => state.companyId);
  const projectId = useSelector((state) => state.projectId);
  const domain = useSelector((state) => state.domain);
  const role = useSelector((state) => state.Role);
  const createdBy = useSelector((state) => state.createdBy);

  console.log("projectId", projectId);

  const menuItems = [
    { section: "Dashboard", name: "Dashboard", icon: <MdDashboard />, path: "pmmaindashboard" },
    { section: "Organization", name: "Employees", icon: <MdPeople />, path: "pmteam" },
    { section: "Organization", name: "Projects", icon: <FaProjectDiagram />, path: "pmprojectsdashboard" },
    { section: "Organization", name: "Timesheets", icon: <GrScorecard />, path: "timesheetapprovals" },
    { section: "Organization", name: "Leaves", icon: <MdSettings />, path: "leavesrequest" },
    { section: "Organization", name: "Holidays", icon: <MdSettings />, path: "pmholiday" },
    { section: "Organization", name: "Settings", icon: <MdSettings />, path: "settings" },
        { section: "Organization", name: "My Timesheets", icon: <MdSettings />, path: "weektimesheet" },
        { section: "Organization", name: "Timesheets Summary", icon: <MdSettings />, path: "timesheetsummary" },
       
        { section: "Organization", name: "My Leaves", icon: <MdSettings />, path: "empleavesummary" },
   

  ];

  const sections = [...new Set(menuItems.map((item) => item.section))];

  useEffect(() => {
    if (location.pathname === "/pmDashboard") {
      navigate("pmmaindashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleMenuClick = (item) => {
    if (item.isDropdown) {
      setOpenMenu(openMenu === item.name ? null : item.name);
    } else {
      // ✅ If Projects → go to root-level URL
      if (item.name === "Projects") {
        navigate(`/${item.path}`, { state: { createdBy, role } });
      } else {
        // 🧩 Everything else → stays under /pmDashboard/
        navigate(`/pmDashboard/${item.path}`, { state: { createdBy, role } });
      }
    }
  };

  const handleChildClick = (path) => {
    navigate(`/pmDashboard/${path}`, { state: { createdBy, role } });
  };

  return (
    <div className="mainContainer">
      <aside className={`leftSection ${sideBar ? "expanded" : "collapsed"}`}>
        <div className="sidebarHeader">
          <h2 className={sideBar ? "" : "hidden"}>{role}</h2>
          <p>Sidebar</p>
        </div>

        <div className="dashboardSections">
          {sections.map((section) => (
            <div key={section} className="menuSection">
              <ul>
                {menuItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <li key={item.name}>
                      <div
                        className="menuItem"
                        onClick={() => handleMenuClick(item)}
                      >
                        <span className="icon">{item.icon}</span>
                        <span className={`text ${sideBar ? "" : "hidden"}`}>
                          {item.name}
                        </span>
                        {item.isDropdown && (
                          <span className="arrow">
                            {openMenu === item.name ? "▲" : "▼"}
                          </span>
                        )}
                      </div>

                      {item.isDropdown && openMenu === item.name && (
                        <ul className="nestedMenu">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <span className="nestedHeader">{child.name}</span>
                              {child.children && (
                                <ul className="nestedMenuChild">
                                  {child.children.map((grandChild) => (
                                    <li
                                      key={grandChild.name}
                                      className="nestedItem"
                                      onClick={() =>
                                        handleChildClick(grandChild.path)
                                      }
                                    >
                                      {grandChild.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
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

export default PMDashboard;
