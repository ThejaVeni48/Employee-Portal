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
  const states  = useSelector((state)=>state);

  console.log("states",states);

  

  console.log("fullname",fullName);
  console.log("companyId",companyId);
  console.log("email",email);
  console.log("role",role);
  console.log("attempts",attempts);
  
  const validatePassword = (password) => {
    const errs = [];

    if (password.length < 8 || password.length > 20)
      errs.push("Password must be 8 - 20 characters.");
    if ((password.match(/[A-Za-z]/g) || []).length < 2)
      errs.push("Password must contain at least 2 alphabetic characters.");
    if (!/[a-z]/.test(password))
      errs.push("Password must contain at least 1 lowercase letter.");
    if (!/[A-Z]/.test(password))
      errs.push("Password must contain at least 1 uppercase letter.");
    if (!/[0-9]/.test(password))
      errs.push("Password must contain at least 1 number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errs.push("Password must contain at least 1 special character.");

    return errs;
  };

  const handlePassword = async (e) => {
    e.preventDefault();

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
        body: JSON.stringify({
          conPwd,
          companyId,
          empId,
          email,
          role
        }),

      });

      if (!response.ok) throw new Error("Network error");

      const result = await response.json();
      if (result.code === 1) {
        alert("Password has been updated successfully.");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErrors(["Failed to update password. Please try again."]);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handlePassword}>
        <input
          type="password"
          placeholder="Enter Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={conPwd}
          onChange={(e) => setConPwd(e.target.value)}
          required
        />
        {errors.length > 0 && (
          <ul style={{ color: "red" }}>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
        <button type="submit">Update Password</button>

        <ul>

          <li>Password must not be greater than 20 charachters</li>
          <li>Password should contain altealst 2 alphabetic characters</li>
          <li>Password should contain altealst 2 alphabetic characters</li>
          <li>Password should be atelat 8 characters long</li>
          <li>Should contain atleast1 lowercase</li>
          <li>Should contain atleast1 numeric</li>
          <li>Should contain atleat 1 special character</li>
          <li>Should contain atleast 1 upper case character</li>

        </ul>
      </form>
    </div>
  );
};

export default ChangePassword;
