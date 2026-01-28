import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import {
  MdDashboard,
  MdPeople,
  MdSettings,
  MdHolidayVillage,
  MdWork,
  MdOutlineLogout,
  MdKeyboardArrowDown,
  MdMenuOpen,
  MdMenu,
} from "react-icons/md";

import { GrScorecard } from "react-icons/gr";

export default function SideBar() {
  const role = useSelector((state) => state.user.Role);
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const menu = {
    "Org Admin": [
      { name: "Dashboard", path: "", icon: <MdDashboard /> },
      { name: "Branches", path: "branches", icon: <MdWork /> },
      { name: "employees", path: "employee", icon: <MdPeople /> },
      { name: "Projects", path: "Projects", icon: <MdSettings /> },
      {
        name: "Timesheets",
        icon: <GrScorecard />,
        dropdown: true,
        children: [
          { name: "Hour Sheet", path: "weektimesheet" },
          { name: "Approvals", path: "timesheetweeks" },
          { name: "Summary", path: "timesheetsummary" },
        ],
      },
      { name: "Holidays", path: "holidays", icon: <MdHolidayVillage /> },
      { name: "Settings", path: "settings", icon: <MdSettings /> },
    ],

    SUPER_USER: [
      { name: "Dashboard", path: "", icon: <MdDashboard /> },
      { name: "employees", path: "employee", icon: <MdPeople /> },
            { name: "Projects", path: "Projects", icon: <MdSettings /> },

      {
        name: "Timesheets",
        icon: <GrScorecard />,
        dropdown: true,
        children: [
          { name: "Hour Sheet", path: "weektimesheet" },
          { name: "Approvals", path: "timesheetweeks" },
        ],
      },
      { name: "Holidays", path: "holidays", icon: <MdHolidayVillage /> },
    ],

    EMPLOYEE: [
      { name: "Dashboard", path: "", icon: <MdDashboard /> },
      { name: "My Timesheet", path: "timesheet", icon: <GrScorecard /> },
      { name: "Leaves", path: "leaves", icon: <MdHolidayVillage /> },
            { name: "Projects", path: "Projects", icon: <MdSettings /> },

      { name: "Settings", path: "settings", icon: <MdSettings /> },
    ],

    Admin: [
      { name: "Dashboard", path: "", icon: <MdDashboard /> },
      { name: "Organizations", path: "organizations", icon: <MdWork /> },
      { name: "Plans", path: "subscriptions", icon: <MdSettings /> },
      { name: "Users", path: "users", icon: <MdPeople /> },
    ],
  };

  const items = menu[role] || [];

  const closeSidebarOnClick = () => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  };

  return (
    <aside
      className={`bg-white border-r shadow-sm flex flex-col transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* LOGO */}
      <div className="h-16 flex items-center justify-between px-5 border-b">
        {!collapsed && (
          <span className="text-lg font-semibold text-indigo-700">
            Timesheet
          </span>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-indigo-600"
        >
          {collapsed ? <MdMenu size={22} /> : <MdMenuOpen size={22} />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-3 space-y-2">

        {items.map((item, idx) => {
          if (item.dropdown) {
            return (
              <div key={idx}>
                <button
                  onClick={() =>
                    setOpenMenu(
                      openMenu === item.name ? null : item.name
                    )
                  }
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                      openMenu === item.name
                        ? "bg-indigo-50 text-indigo-700"
                        : "hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-indigo-600">
                      {item.icon}
                    </span>

                    {!collapsed && item.name}
                  </div>

                  {!collapsed && (
                    <MdKeyboardArrowDown
                      className={`transition ${
                        openMenu === item.name
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  )}
                </button>

                {/* SUB MENU */}
                {openMenu === item.name && !collapsed && (
                  <div className="ml-12 mt-1 space-y-1">
                    {item.children.map((sub, sIdx) => (
                      <NavLink
                        key={sIdx}
                        to={`/dashboard/${sub.path}`}
                        onClick={closeSidebarOnClick}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-sm transition ${
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "hover:bg-gray-100"
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={idx}
              to={`/dashboard/${item.path}`}
              onClick={closeSidebarOnClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg text-indigo-600">
                {item.icon}
              </span>

              {!collapsed && item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t p-4">
        <button className="flex items-center gap-3 text-red-500 hover:text-red-600 text-sm font-medium">
          <MdOutlineLogout size={20} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
