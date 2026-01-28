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
import { useMutation } from "@tanstack/react-query";
import { categoryLoginApi } from "../../apis/Login/Login.js";


export default function EmpLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id || "";

 

  const { mutate, isPending } = useMutation({
  mutationFn: categoryLoginApi,

  onSuccess: (res) => {
    console.log("EMP LOGIN:", res);

    dispatch(getEmail(email));
    dispatch(getCompanyId(res.companyId || ""));
    dispatch(getRole(res.role || ""));
    dispatch(getEmpId(res.empId || ""));
    dispatch(getAccessCode(res.accessCodes || []));

    dispatch(getFullName(res.displayName || ""));

    if (res.attemptsLogins ===0)
 {
      navigate("/changePassword");
      return;
    }

    navigate("/dashboard");
  },

  onError: (err) => {
    console.log("EMP LOGIN ERROR:", err);

    switch (err.reason) {
      case "ORG_INACTIVE":
        alert("Your organization is inactive.");
        break;

      case "SUB_EXPIRED":
        alert("Subscription expired.");
        break;

      case "USER_INACTIVE":
        alert("Your account is inactive.");
        break;

      default:
        alert(err.message || "Login failed");
    }
  },
});


const handleLogin = (e) => {
  e.preventDefault();

  mutate({
    email,
   password,
    id,
  });
};


  return (
    <div className="min-h-screen flex">
      {/* LEFT BRANDING PANEL */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              {/* <Clock className="size-7 text-white" /> */}
            </div>
            <span className="text-xl">Timesheet System</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl mb-6">
              Employee Portal
            </h1>
            <p className="text-lg text-teal-100 mb-12">
              Track your time, submit timesheets, and monitor your work hours with ease.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  {/* <ClipboardList className="size-5" /> */}
                </div>
                <div>
                  <h3 className="mb-1">Time Tracking</h3>
                  <p className="text-sm text-teal-100">
                    Log your daily work hours across projects and tasks
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  {/* <FileText className="size-5" /> */}
                </div>
                <div>
                  <h3 className="mb-1">Submit Timesheets</h3>
                  <p className="text-sm text-teal-100">
                    Easily submit your timesheets for approval
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  {/* <CheckCircle className="size-5" /> */}
                </div>
                <div>
                  <h3 className="mb-1">View Status</h3>
                  <p className="text-sm text-teal-100">
                    Track approval status and view your timesheet history
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-teal-200">
          © 2026 Timesheet Management System | Employee Portal
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            </div>
            <span className="text-lg">Timesheet System</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                {/* <Shield className="size-6 text-indigo-600" /> */}
              </div>
              <div>
                  <h2 className="text-gray-900">Employee Login</h2>
                  <p className="text-sm text-gray-500">Access your timesheet portal</p>
                </div>
            </div>

             <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="text-sm">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="employee@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                 className="mt-1.5 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 text-sm
                             focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-sm">Password</label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 pr-10 text-sm
                               focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/20 outline-none"                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {/* {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )} */}
                  </button>
                
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 rounded border-gray-300"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <button type="submit" 
              disabled={isPending} 
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold
                           hover:bg-black-700 transition">
                {/* <Lock className="size-4 mr-2" /> */}
                  {isPending ? "Logging in..." : "Login"}

              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                type="button"
                // onClick={onBack}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                {/* <ArrowLeft className="size-4" /> */}
                Back to Welcome Page
              </button>
              <button
                type="button"
                className="text-emerald-600 hover:text-emerald-700"
              >
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
