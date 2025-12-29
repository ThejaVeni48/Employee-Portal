import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const companyId = useSelector((state) => state.user.companyId);
  const email = useSelector((state) => state.user.email);
  const role = useSelector((state) => state.user.Role);
  const fullName = useSelector((state) => state.user.fullName) || "";
  const empId = useSelector((state) => state.user.empId);
  const attempts = useSelector((state) => state.user.attempts);

  const [pwd, setPwd] = useState("");
  const [conPwd, setConPwd] = useState("");
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errs = [];
    if (password.length < 8 || password.length > 20)
      errs.push("Password must be 8-20 characters long");
    if ((password.match(/[A-Za-z]/g) || []).length < 2)
      errs.push("Password must contain at least 2 letters");
    if (!/[a-z]/.test(password))
      errs.push("Password must contain at least 1 lowercase letter");
    if (!/[A-Z]/.test(password))
      errs.push("Password must contain at least 1 uppercase letter");
    if (!/[0-9]/.test(password))
      errs.push("Password must contain at least 1 number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errs.push("Password must contain at least 1 special character");
    return errs;
  };

const handlePassword = async (e) => {
  e.preventDefault();
  setErrors([]);

  if (pwd !== conPwd) {
    setErrors(["Password and Confirm Password do not match"]);
    return;
  }

  const validationErrors = validatePassword(pwd);
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/api/changePassword", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conPwd, companyId, empId, email, role }),
    });

    const result = await response.json(); 

    if (!response.ok) {
      alert([result.message || "Please try another new password"]);
      setPwd('');
      setConPwd('');
      // setErrors([result.message || "Please try another new password"]);
      return;
    }

    if (result.code === 1) {
      alert("Password updated successfully!");
      navigate("/");
    }

  } catch (err) {
    console.error(err);
    setErrors(["Server error. Please try again later."]);
  }
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Change Password</h2>
        <p style={styles.subtitle}>Hello, {fullName}. Please set a new password.</p>

        <form onSubmit={handlePassword} style={styles.form}>
          <input
            type="password"
            placeholder="Enter Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={conPwd}
            onChange={(e) => setConPwd(e.target.value)}
            style={styles.input}
            required
          />

          {errors.length > 0 && (
            <ul style={styles.errorList}>
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          )}

          <button type="submit" style={styles.button}>
            Update Password
          </button>
        </form>

        <div style={styles.rules}>
          <h4>Password Rules:</h4>
          <ul>
            <li>8-20 characters long</li>
            <li>At least 2 alphabetic characters</li>
            <li>At least 1 uppercase letter</li>
            <li>At least 1 lowercase letter</li>
            <li>At least 1 number</li>
            <li>At least 1 special character (!@#$%^&*)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f0f2f5",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "10px",
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "450px",
  },
  title: {
    marginBottom: "5px",
    fontSize: "24px",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px 20px",
    background: "#1c3681",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
  },
  buttonHover: {
    background: "#14306b",
  },
  errorList: {
    color: "red",
    paddingLeft: "20px",
  },
  rules: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
  },
};

export default ChangePassword;
