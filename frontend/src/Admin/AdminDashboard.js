import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { MdDashboard, MdPeople, MdSettings, MdLogout } from "react-icons/md";
import { GrScorecard } from "react-icons/gr";
import Header from "../Header/Header";
import moment from "moment";
import { ActiveProjects } from "../Redux/actions/activeProjectsActions";

const AdminDashboard = () => {
  const [sideBar] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const companyId = useSelector((state) => state.user.companyId);
  const empId = useSelector((state) => state.user.empId);
  const role = useSelector((state) => state.user.Role);
  const loginAttempts = useSelector((state) => state.user.loginAttempts);
  const fullName = useSelector((state) => state.user.fullName);
  const accessCode = useSelector((state) => state.user.accessCode || []);
  const [approveAccess, setApproveAccess] = useState("");
  console.log("accessCode:", accessCode);

  const activeprojects = useSelector(
    (state) => state.activeprojects.activeProjectsList
  );

  const projectsId = activeprojects.map((item) => item.PROJ_ID);

  console.log("Received projectIds in Approvals:", projectsId);

  console.log("activeProjects", activeprojects);

  const dispatch = useDispatch();

  useEffect(() => {
    if (loginAttempts === 1) {
      const timer = setTimeout(() => {
        alert("Please change your password");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  useEffect(() => {
    // getActiveProjects();
    getApproveAccess();
  }, []);

  useEffect(() => {
    if (companyId && empId) {
      dispatch(ActiveProjects(companyId, empId));
    }
  }, [companyId, empId]);

  const today = moment().format("YYYY-MM-DD");

  const getApproveAccess = async () => {
    try {
      const data = await fetch(
        `http://localhost:3001/api/showApproveAccess?companyId=${companyId}&empId=${empId}&currentDate=${today}`
      );

      if (!data.ok) {
        throw new Error("Network response was not ok");
      }

      const res = await data.json();

      console.log("res for access", res);
      console.log("res for access", res.canApprove);
      console.log("res for access", typeof res);

      if (res.canApprove) {
        setApproveAccess(res.canApprove);
      }

      // if(!data && data.l)
      // console.log(res.data[0][1]);
      // if(res.data.length >0)
      // setApproveAccess(res.data[0][1])
    } catch (error) {
      console.error("error occured", error);
    }
  };

  const menuItems = [
    {
      section: "Dashboard",
      name: "Dashboard",
      icon: <MdDashboard />,
      path: "dashboard",
    },
    {
      section: "Organization",
      name: "Employees",
      icon: <MdPeople />,
      path: "employees",
    },
    {
      section: "Organization",
      name: "Departments",
      icon: <MdPeople />,
      path: "departments",
    },
    {
      section: "Organization",
      name: "Projects",
      icon: <MdSettings />,
      path: "projects",
      requiredAccess: ["ALL_R", "P_T"],
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
      requiredAccess: ["ALL_R", "TS_TAB"],
    },

    ...(approveAccess
      ? [
          {
            section: "Organization",
            name: "Timesheet Approvals",
            icon: <MdSettings />,
            path: "timesheetweeks",
          },
        ]
      : []),

    {
      section: "Organization",
      name: "Leaves",
      icon: <MdSettings />,
      path: "LeavesDashboard",
      requiredAccess: ["ALL_R", "LEAVE_TAB"],
    },
    {
      section: "Organization",
      name: "Holidays",
      icon: <MdSettings />,
      path: "holidays",
      requiredAccess: ["ALL_R", "HD_TAB"],
    },
    {
      section: "Organization",
      name: "Settings",
      icon: <MdSettings />,
      path: "settings",
    },
    {
      section: "Organization",
      name: "Change Password",
      icon: <MdSettings />,
      path: "changePassword",
    },
  ];

  console.log("approveaccess", approveAccess);

  const filteredMenu = menuItems.filter((item) => {
    if (!item.requiredAccess) return true;

    return item.requiredAccess.some((acc) => accessCode.includes(acc));
  });
  const sections = [...new Set(filteredMenu.map((item) => item.section))];

  useEffect(() => {
    if (location.pathname === "/adminDashboard") {
      navigate("dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleMenuClick = (item) => {
    if (item.isDropdown) {
      setOpenMenu(openMenu === item.name ? null : item.name);
    } else {
      console.log("Passing projectIds to approvals:", projectsId);

      navigate(`/adminDashboard/${item.path}`, {
        state: { projectsId },
      });
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="mainContainer">
      <aside className={`leftSection ${sideBar ? "expanded" : "collapsed"}`}>
        <div className="sidebarHeader">
          <h2 className={sideBar ? "" : "hidden"}>
            {role} - {fullName}
          </h2>
        </div>

        <div className="dashboardSections">
          {sections.map((section) => (
            <div key={section} className="menuSection">
              <ul>
                {filteredMenu
                  .filter((item) => item.section === section)
                  .map((item, idx) => (
                    <React.Fragment key={idx}>
                      <li
                        className={isActive(item.path) ? "activeMenu" : ""}
                        onClick={() => handleMenuClick(item)}
                      >
                        <span className="icon">{item.icon}</span>
                        <span className={`text ${sideBar ? "" : "hidden"}`}>
                          {item.name}
                        </span>
                      </li>

                      {/* Dropdown */}
                      {item.isDropdown && openMenu === item.name && (
                        <ul className="dropdownMenu">
                          {item.subItems.map((sub, sIdx) => (
                            <li
                              key={sIdx}
                              className={
                                isActive(sub.path) ? "activeSubMenu" : ""
                              }
                              onClick={() =>
                                navigate(`/adminDashboard/${sub.path}`, {
                                  state: { projectsId },
                                })
                              }
                            >
                              <span className="text">{sub.name}</span>
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

      {/* RIGHT CONTENT */}
      <main className={`rightSection ${sideBar ? "" : "expanded"}`}>
        <Header />
        <div className="contentContainer" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
