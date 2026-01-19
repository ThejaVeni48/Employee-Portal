import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  const sections = [
    { id: 1, name: "Global Admin Login", desc: "SSO / Super Admin Access" },
    { id: 2, name: "Organization Admin", desc: "Company Level Administration" },
    { id: 3, name: "Employee Login", desc: "Employee Portal Access" },
    { id:4,name:"Register Your Organization"}
  ];

  const handleNav = (item) => {
    if(item.id!==4)
    navigate("/login", { state: { id: item.id } });
    if(item.id ===4)
    {
      navigate("/subscriptionplans")
    }
  };


  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #E6EBF1, #F2F4F8)",
    fontFamily: "'Inter', sans-serif",
  };

  const cardStyle = {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "26px",
    fontWeight: "700",
    color: "#2F3E46",
    marginBottom: "10px",
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "30px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #D1D5DB",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.25s ease",
  };

  const buttonHover = {
    backgroundColor: "#F9FAFB",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.08)",
  };

  const roleTitle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  };

  const roleDesc = {
    fontSize: "13px",
    color: "#6B7280",
    marginTop: "4px",
  };


  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Welcome </h2>
        <p style={subtitleStyle}>
          Choose how you want to sign in
        </p>

        {sections.map((item) => (
          <button
            key={item.id}
            style={buttonStyle}
            onClick={() => handleNav(item)}
            onMouseOver={(e) =>
              Object.assign(e.currentTarget.style, buttonHover)
            }
            onMouseOut={(e) =>
              Object.assign(e.currentTarget.style, buttonStyle)
            }
          >
            <div style={roleTitle}>{item.name}</div>
            <div style={roleDesc}>{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;