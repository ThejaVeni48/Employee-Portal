import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaUsers,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaBell,
  FaClipboardList,
  FaProjectDiagram,
} from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SectionCard = ({ title, desc, icon: Icon, onClick }) => (
  <button className="sg-card" onClick={onClick}>
    <div className="sg-card-top">
      {Icon && <Icon className="sg-card-icon" />}
      <h4 className="sg-card-title">{title}</h4>
    </div>
    {desc && <p className="sg-card-desc">{desc}</p>}
  </button>
);

export default function Settings() {
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.searchQuery);
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);

  console.log("companyid",companyId);
  
  const SYSTEM = React.useMemo(() => [
    {
      key: "companyProfile",
      title: "Company Profile",
      desc: "Edit company name, logo, address, and contact details.",
      icon: FaBuilding,
      path: "company-profile",
    },
     {
      key: "Branch",
      title: "Branch",
      desc: " Add Branch.",
      icon: FaBuilding,
      path: "branch",
    },
    {
      key: "manageUsers",
      title: "Manage Users",
      desc: "Create users, assign roles, and manage access.",
      icon: FaUsers,
      path: "manage-users",
    },
    {
      key: "notifications",
      title: "Notifications",
      desc: "Email & in-app notification preferences.",
      icon: FaBell,
      path: "notifications",
    },
  ], []);

  const COMPANY_MODULES = React.useMemo(() => [
    {
      key: "timesheets",
      title: "Timesheets",
      desc: "Timesheet rules, approvals & submission settings.",
      icon: FaClipboardList,
      path: "settingspage",
    },
    {
      key: "projects",
      title: "Projects",
      desc: "Manage projects, allocations, and project managers.",
      icon: FaProjectDiagram,
      path: "projects",
    },
    {
      key: "leave",
      title: "Leave ",
      desc: "Leave types, policies",
      icon: FaCalendarAlt,
      path: "leave",
    },
    {
      key: "holidays",
      title: "Holidays",
      desc: " policies, and company holidays.",
      icon: FaCalendarAlt,
      path: "holidays",
    },
    {
      key: "payroll",
      title: "Payroll",
      desc: "Pay periods, salary components, payslips.",
      icon: FaFileInvoiceDollar,
      path: "payroll",
    },
    {
      key: "emailConfig",
      title: "Email Configuration",
      desc: "SMTP settings and test connection for company emails.",
      icon: FaEnvelope,
      path: "emailconfig",
    },
    {
      key: "roles",
      title: "Roles",
      desc: "Default and custom for your organization.",
      icon: FaUsers,
      path: "roles",
    },
    {
      key: "desigations",
      title: "Designations",
      desc: "Default and custom desigations for your organization.",
      icon: FaUsers,
      path: "orgdesignations",
    },
     {
      key: "desigations",
      title: "Access",
      desc: "Default and custom desigations for your organization.",
      icon: FaUsers,
      path: "orgacess",
    },
    {
      key: "shifts",
      title: "Shifts",
      desc: "Default and custom Shifts for your organization.",
      icon: FaUsers,
      path: "shifts",
    },
  ], []);

  const [filteredSystem, setFilteredSystem] = useState(SYSTEM);
  const [filteredModules, setFilteredModules] = useState(COMPANY_MODULES);

  const goTo = (path) => {
    console.log("path",path);
    navigate(`/dashboard/${path}`);
    
    // navigate(`/${item.path}`);
  };

  useEffect(() => {
    if (searchQuery && searchQuery.trim() !== "") {
      const lower = searchQuery.toLowerCase();

      const filteredSys = SYSTEM.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.desc.toLowerCase().includes(lower)
      );
      const filteredMod = COMPANY_MODULES.filter(
        (item) =>
          item.title.toLowerCase().includes(lower) ||
          item.desc.toLowerCase().includes(lower)
      );

      setFilteredSystem(filteredSys);
      setFilteredModules(filteredMod);
    } else {
      setFilteredSystem(SYSTEM);
      setFilteredModules(COMPANY_MODULES);
    }
  }, [searchQuery,SYSTEM,COMPANY_MODULES]);

  return (
<div className="min-h-screen font-sans text-gray-900">

  {/* HEADER */}
  <header className="mb-6">
    <h1 className="text-xl font-semibold text-slate-900 ml-1">
      Settings
    </h1>
  </header>

  {/* SYSTEM */}
  <section className="mb-8">
    <h3 className="text-xs uppercase tracking-wider text-gray-500 ml-1 mb-3">
      System
    </h3>

    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {filteredSystem.map((c) => (
        <button
          key={c.key}
          onClick={() => goTo(c.path)}
          className="
            bg-white border border-gray-200 rounded-xl p-5 text-left
            shadow-sm transition-all duration-150
            hover:-translate-y-1 hover:shadow-md hover:border-indigo-200
            focus:outline-none
            min-h-[120px]
          "
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="
                h-10 w-10 rounded-lg
                bg-indigo-50 text-indigo-600
                flex items-center justify-center text-lg
              "
            >
              <c.icon />
            </div>

            <h4 className="text-sm font-semibold text-slate-900">
              {c.title}
            </h4>
          </div>

          <p className="text-xs text-gray-500 leading-snug">
            {c.desc}
          </p>
        </button>
      ))}
    </div>
  </section>

  {/* COMPANY MODULES */}
  <section>
    <h3 className="text-xs uppercase tracking-wider text-gray-500 ml-1 mb-3">
      Company Modules
    </h3>

    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {filteredModules.map((c) => (
        <button
          key={c.key}
          onClick={() => goTo(c.path)}
          className="
            bg-white border border-gray-200 rounded-xl p-5 text-left
            shadow-sm transition-all duration-150
            hover:-translate-y-1 hover:shadow-md hover:border-indigo-200
            focus:outline-none
            min-h-[120px]
          "
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="
                h-10 w-10 rounded-lg
                bg-indigo-50 text-indigo-600
                flex items-center justify-center text-lg
              "
            >
              <c.icon />
            </div>

            <h4 className="text-sm font-semibold text-slate-900">
              {c.title}
            </h4>
          </div>

          <p className="text-xs text-gray-500 leading-snug">
            {c.desc}
          </p>
        </button>
      ))}
    </div>
  </section>

  <Outlet />
</div>

  );
}
