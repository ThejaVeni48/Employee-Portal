import React, { useState,useEffect } from "react";
import { IoMdEye } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [branch,setBranch] = useState("");
  const [formData,setFormData] = useState([]);





  useEffect(() => {
  console.log("Updated formData:", formData);
}, [formData]);

 


  const handleCreateAccount = async (e) => {
    e.preventDefault();

    

    const res = await fetch("http://localhost:3001/api/registerCompany", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        companyName,
        email,
        branch,
        address,
      }),
    });

    const data = await res.json();
    console.log("data", data);

    if (data.status === 201) {
      alert(data.message);
      setFirstName("");
      setLastName("");
      setCompanyName("");
      setEmail("");
      setRole("");
      setPassword("");
      setAddress("");
      setTimeout(() => navigate("/"), 1000);
    } else if (data.status === 400) {
      alert("This company name is already registered");
    }
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e0e7ff, #f3f4f6)",
    fontFamily: "'Inter', sans-serif",
    padding: "30px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "45px 40px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
    width: "100%",
    maxWidth: "440px",
    transition: "all 0.3s ease",
  };

  const titleStyle = {
    fontSize: "26px",
    fontWeight: "700",
    textAlign: "center",
    color: "#4f46e5",
    marginBottom: "25px",
    letterSpacing: "0.2px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  };

  const inputStyle = {
    width: "96%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    color: "#111827",
    backgroundColor: "#f9fafb",
    transition: "border-color 0.3s, box-shadow 0.3s",
  };

  const inputFocusStyle = {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
    backgroundColor: "#fff",
  };

  const selectStyle = {
    width: "96%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#111827",
    backgroundColor: "#f9fafb",
  };

  const selectFocusStyle = {
    borderColor: "#6366f1",
    boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
    backgroundColor: "#fff",
  };

  const passwordBoxStyle = {
    display: "flex",
    alignItems: "center",
    width: "96%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "0 8px",
    backgroundColor: "#f9fafb",
    transition: "border-color 0.3s, box-shadow 0.3s",
  };

  const passwordInputStyle = {
    flex: 1,
    padding: "10px 8px",
    fontSize: "14px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#111827",
  };

  const buttonStyle = {
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "#6366f1",
    color: "#fff",
    width: "100%",
    marginTop: "12px",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#4f46e5",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 15px rgba(99, 102, 241, 0.3)",
  };

  // const handleNext = ()=>{
  //   navigate('/vieworg')
  // }
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Register Your Company</h2>
        <form
          onSubmit={handleCreateAccount}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* First Name */}
          <div>
            <label style={labelStyle}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>

          {/* Company Name */}
          <div>
            <label style={labelStyle}>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Domain Name</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>

          {/* Password */}
          {/* <div>
            <label style={labelStyle}>Password</label>
            <div style={passwordBoxStyle}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={passwordInputStyle}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPassword ? (
                  <IoMdEye size={20} />
                ) : (
                  <FaRegEyeSlash size={20} />
                )}
              </button>
            </div>
          </div> */}

          {/* Role */}
          {/* <div>
            <label style={labelStyle}>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={selectStyle}
              onFocus={(e) => Object.assign(e.target.style, selectFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, selectStyle)}
              required
            >
              <option value="">-- Select Role --</option>
              <option value="Admin">Admin</option>
            </select>
          </div> */}

          {/* Address */}
          <div>
            <label style={labelStyle}>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => Object.assign(e.target.style, buttonHoverStyle)}
            onMouseOut={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Create Account
          </button>
{/* <button type="button" onClick={handleNext}>Next</button> */}
        </form>
      </div>
    </div>
  );
};

export default Register;
