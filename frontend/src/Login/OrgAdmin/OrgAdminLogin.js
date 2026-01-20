import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getEmail,
  getUserId,
  getCompanyId,
  getFullName,
  getRole,
  getEmpId,
  getAccessCode
} from '../../Redux/actions/UserActions.js'
export default function GALogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id || "";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/categoryLogin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, id }),
        }
      );

      const res = await response.json();
      console.log("res",res);
      

      if (res.status === 401 || res.status === 403) {

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



    if (res.status !== 200) {
      setError("Something went wrong");
      return;
    }

    const user = res.data?.[0] || {};

    console.log("user",user);
    

    dispatch(getEmail(email));
    dispatch(getUserId(res.categoryId));
    dispatch(getCompanyId(res.companyId || ""));
    dispatch(getFullName(res.ADMIN_NAME || user.DISPLAY_NAME || ""));
    dispatch(getRole(res.role));
    dispatch(getEmpId(res.empId|| ""));
    dispatch(getAccessCode(res.accessCodes))

   

    // // ORG ADMIN

      if (res.attemptsLogins === 0) {
        navigate("/changePassword");
        return;
      }

      navigate("/adminDashboard");
      return;
    }

   

   catch (err) {
    console.error("Login error:", err);
    setError("Server error");
  }
};

  return (
    <div className="min-h-screen flex">
      {/* LEFT BRANDING PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              {/* <Clock className="size-7" /> */}
            </div>
            <span className="text-xl">Timesheet System</span>
          </div>

          <h1 className="text-4xl mb-6">Organization Admin Portal</h1>
          <p className="text-lg text-purple-100 mb-12">
            Centralized control for organizations, users, workflows, and system
            configurations.
          </p>

          <div className="space-y-6">
            <Feature
              // icon={<BarChart3 className="size-5" />}
              title="System Analytics"
              desc="Monitor system-wide performance and usage"
            />
            <Feature
              // icon={<Building2 className="size-5" />}
              title="Organization Control"
              desc="Oversee all organizations and configurations"
            />
            <Feature
              // icon={<Settings className="size-5" />}
              title="Advanced Controls"
              desc="Full system access and administration"
            />
          </div>
        </div>

        <div className="relative z-10 text-sm text-purple-200">
          © 2026 Timesheet Management System | Global Administration
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              {/* <Clock className="size-6 text-white" /> */}
            </div>
            <span className="text-lg">Timesheet System</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                {/* <Shield className="size-6 text-indigo-600" /> */}
              </div>
              <div>
                <h2 className="text-gray-900">
                  Global Admin Login
                </h2>
                <p className="text-sm text-gray-500">
                  Authorized access only
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@system.com"
                  required
                  className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 text-sm
                             focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm">Password</label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 pr-10 text-sm
                               focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {/* {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )} */}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold
                           hover:bg-indigo-700 transition"
              >
                Login
              </button>
            </form>

            <div className="mt-6 flex justify-between text-sm">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                {/* <ArrowLeft className="size-4" /> */}
                Back
              </button>
              <button className="text-indigo-600 hover:text-indigo-700">
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="lg:hidden mt-8 text-center text-sm text-gray-500">
            © 2026 Timesheet Management System
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Feature */
function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="mb-1">{title}</h3>
        <p className="text-sm text-purple-100">{desc}</p>
      </div>
    </div>
  );
}
