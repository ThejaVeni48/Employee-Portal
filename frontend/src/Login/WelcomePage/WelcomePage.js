import React from "react";
import { useNavigate } from "react-router-dom";

const  WelcomePage = ()=> {
  const navigate = useNavigate();

  const loginOptions = [
    {
      id:1,
      iconClass: "pi pi-shield",
      title: "Global Admin Login",
      description: "Full system access and configuration",
      path: "galogin",
    },
    {
      id:2,
      iconClass: "pi pi-building",
      title: "Organization Admin Login",
      description: "Manage organization, employees, and approvals",
      path: "orgadminlogin",
    },
    {
      id:3,
      iconClass: "pi pi-user",
      title: "Employee Login",
      description: "Submit timesheets and view approvals",
      path: "emplogin",
    },
    {
      iconClass: "pi pi-headphones",
      title: "Customer Support Login",
      description: "Support and issue management",
      path: "/login/support",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="pi pi-clock text-white text-3xl" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Welcome to Timesheet Management System
          </h3>
          <p className="text-gray-600">
            Please choose how you want to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-10 border border-gray-200 shadow-xl">
          
          {/* Login Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {loginOptions.map((option) => (
              <button
                key={option.title}
onClick={() =>
  navigate(option.path, {
    state: { id: option.id }
  })
}
                className="w-full text-left border-2 border-gray-200 rounded-2xl p-6 transition-all
                           hover:border-blue-600 hover:shadow-lg group"
              >
                <div className="flex gap-4">
                  <div
                    className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center
                               text-blue-600 transition group-hover:bg-blue-100"
                  >
                    <i className={`${option.iconClass} text-xl`} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 transition group-hover:text-blue-600">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 top-1/2 border-t border-gray-300" />
            <span className="relative bg-white px-4 text-sm text-gray-500">
              New to the system?
            </span>
          </div>

          {/* Register Button */}
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-blue-600 text-white rounded-2xl p-6
                       shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-4">
              <div className="w-12  bg-blue-500 rounded-xl flex items-center justify-center">
                <i className="pi pi-user-plus text-xl text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">
                  Register Organization
                </h3>
                <p className="text-sm text-blue-200">
                  New organization onboarding and setup
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2026 Timesheets
        </div>
      </div>
    </div>
  );
}

export default WelcomePage