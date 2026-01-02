import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { IoMdEye } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa6";
import {
  getAccessCode,
  getCompanyId,
  getEmail,
  getEmpId,
  getFullName,
  getLoginAttempts,
  getRole,
  getUserId,
} from "../Redux/actions/UserActions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const handleNav = () => nav("/register");
  const [username, setUserName] = useState("");
 


  const location = useLocation();

  const id = location.state?.id || "";

  // console.log("id",id);

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch("http://localhost:3001/api/categoryLogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || username,
        password,
        id,
      }),
    });

    const status = response.status;
    const res = await response.json();

    console.log("res", res);

   if (status === 401 || status === 403) {

  switch (res.reason) {

    case "ORG_INACTIVE":
      alert("Your organization is inactive. Please contact support.");
      break;

    case "SUB_EXPIRED":
      alert("Your subscription has expired. Please renew your plan.");
      break;

    case "USER_INACTIVE":
      alert("Your account is inactive. Please contact your administrator.");
      break;

    default:
      alert(res.message || "Login failed");
  }

  return;
}



    if (status !== 200) {
      setError("Something went wrong");
      return;
    }

    const user = res.data?.[0] || {};

    dispatch(getEmail(email || username));
    dispatch(getUserId(res.categoryId));
    dispatch(getCompanyId(res.companyId || ""));
    dispatch(getFullName(user.ADMIN_NAME || user.DISPLAY_NAME || ""));
    dispatch(getRole(res.role));
    dispatch(getEmpId(user.EMP_ID || ""));
    dispatch(getAccessCode(res.accessCodes))

    // SSO
    if (res.categoryId === 1) {
      nav("/SSODashboard");
      return;
    }

    // ORG ADMIN
    if (res.categoryId === 2) {
      if (res.attemptsLogins === 0) {
        nav("/changePassword");
        return;
      }

      nav("/adminDashboard");
      return;
    }

    // EMPLOYEE
    if (res.categoryId === 3) {
      if (res.attemptsLogins === 0) {
        nav("/changePassword");
        return;
      }

      nav("/adminDashboard");
      return;
    }

  } catch (err) {
    console.error("Login error:", err);
    setError("Server error");
  }
};


  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #E6EBF1, #F2F4F8)",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#FFFFFF",
    padding: "40px 30px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "400px",
    transition: "all 0.3s ease",
  };

  const titleStyle = {
    fontSize: "26px",
    fontWeight: "700",
    color: "#2F3E46",
    textAlign: "center",
    marginBottom: "25px",
    letterSpacing: "0.5px",
  };

  const inputContainer = {
    position: "relative",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 40px 14px 14px",
    borderRadius: "8px",
    border: "1px solid #C7CBD1",
    outline: "none",
    fontSize: "15px",
    transition: "all 0.2s ease",
    backgroundColor: "#F9FAFB",
  };

  const inputFocusStyle = {
    border: "1px solid #9CA3AF",
    backgroundColor: "#FFFFFF",
  };

  const iconStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#6B7280",
  };

  const loginButtonStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    // backgroundColor: "#9FB6C3",
    backgroundColor: "#E65100",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
  };

  const loginButtonHoverStyle = {
    backgroundColor: "#8199A9",
    transform: "scale(1.02)",
  };

  const footerStyle = {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#6B7280",
  };

  const errorStyle = {
    color: "#DC2626",
    fontSize: "13px",
    marginTop: "5px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>
        <form onSubmit={handleLogin}>
          {id === 1 ? (
            <div style={inputContainer}>
              <input
                type="user"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                required
              />
              <CiUser style={{ ...iconStyle, right: "10px" }} size={20} />
            </div>
          ) : (
            <div style={inputContainer}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log("email");
                }}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                required
              />
              <CiUser style={{ ...iconStyle, right: "10px" }} size={20} />
            </div>
          )}

          <div style={inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                console.log("password");
              }}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
            <span
              style={iconStyle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IoMdEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </span>
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button
            type="submit"
            style={loginButtonStyle}
            onMouseOver={(e) =>
              Object.assign(e.target.style, loginButtonHoverStyle)
            }
            onMouseOut={(e) => Object.assign(e.target.style, loginButtonStyle)}
          >
            Login
          </button>
        </form>

        {/* <div style={footerStyle}>
          <p>
            Don't have an account?{" "}
            <span
              style={{ color: "#667085", fontWeight: "600", cursor: "pointer" }}
              onClick={handleNav}
            >
              Register
            </span>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
