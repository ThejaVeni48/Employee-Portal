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
import "./Settings.css";
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
  const companyId = useSelector((state) => state.companyId);

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
  ], []);

  const [filteredSystem, setFilteredSystem] = useState(SYSTEM);
  const [filteredModules, setFilteredModules] = useState(COMPANY_MODULES);

  const goTo = (path) => {
    console.log("path",path);
    navigate(`/adminDashboard/${path}`);
    
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
    <div className="sg-page">
      <header className="sg-header">
        <h1>Settings</h1>
      </header>

      <section className="sg-section">
        <h3 className="sg-section-title">System</h3>
        <div className="sg-grid">
          {filteredSystem.map((c) => (
            <SectionCard
              key={c.key}
              title={c.title}
              desc={c.desc}
              icon={c.icon}
              onClick={() => goTo(c.path)}
            />
          ))}
        </div>
      </section>

      <section className="sg-section">
        <h3 className="sg-section-title">Company Modules</h3>
        <div className="sg-grid">
          {filteredModules.map((c) => (
            <SectionCard
              key={c.key}
              title={c.title}
              desc={c.desc}
              icon={c.icon}
              onClick={() => goTo(c.path)}
            />
          ))}
        </div>
      </section>

      <Outlet />
    </div>
  );
}
