import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { IoMdEye } from "react-icons/io";
import { FaRegEyeSlash } from "react-icons/fa6";

export default function GALogin() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id || "";

  console.log("id",id);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/categoryLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email:username, password, id }),
      });

      const res = await response.json();
      if (response.status !== 200) {
        setError(res.message || "Login failed");
        return;
      }

      if (res.categoryId === 1) navigate("/SSODashboard");
      else if (res.categoryId === 2) navigate("/adminDashboard");
      else navigate("/employeeDashboard");
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 to-blue-900 text-white p-12 flex-col justify-between overflow-hidden">
        
        <div className="absolute -bottom-16 -left-24 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-16 -right-16 w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-xl">
              
            </div>
            <span className="text-lg font-semibold">Timesheet System</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Global Admin Portal
          </h1>

          <p className="text-white/80 mb-8">
            Centralized control for organizations, users, workflows, and system configurations.
          </p>

          <div className="space-y-4">
            {[
              ["", "System Analytics", "Monitor system-wide performance"],
              ["", "Organization Management", "Oversee organizations"],
              ["", "Advanced Controls", "Full system access"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-white/80">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-white/70 relative z-10">
          © 2026 Timesheet Management System
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center text-xl">
              
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Sign in as Global Admin
              </h2>
              <p className="text-sm text-gray-500">
                Authorized access only
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <input
                type="text"
                placeholder="Email Address"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-3 py-3 pr-10 rounded-lg border border-gray-300 bg-gray-50 text-sm
                           focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 outline-none"
              />
              <CiUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 pr-10 rounded-lg border border-gray-300 bg-gray-50 text-sm
                           focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 outline-none"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEye size={20} /> : <FaRegEyeSlash size={20} />}
              </span>
            </div>

            {/* Environment */}
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm
                         focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 outline-none"
            >
              <option value="production">Production</option>
              <option value="test">Test</option>
            </select>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800
                         text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Login
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
            <strong>Security Notice:</strong> Authorized Global Administrators only.
          </div>

          {/* Links */}
          <div className="mt-6 flex justify-between text-sm text-blue-600">
            <button onClick={() => navigate(-1)} className="hover:underline">
              Back
            </button>
            <button className="hover:underline">
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
