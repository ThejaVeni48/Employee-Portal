import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { getSearchQuery } from "../../Redux/actions/UserActions";


import {
  MdNotificationsNone,
  MdKeyboardArrowDown,
  MdOutlineLogout,
  MdSettings,
} from "react-icons/md";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const fullName = useSelector((state) => state.user.fullName);
  const role = useSelector((state) => state.user.Role);

  const [openProfile, setOpenProfile] = useState(false);


  const [search, setSearch] = useState("");

const handleSearch = (e) => {
  const value = e.target.value;
  setSearch(value);
  dispatch(getSearchQuery(value));
};


  // Simple breadcrumb title
  const pageTitle = location.pathname
    .split("/")
    .filter(Boolean)
    .slice(-1)[0]
    ?.replace(/-/g, " ")
    ?.toUpperCase();

  return (
    <header className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">

    <div className="flex items-center gap-6">

  <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">
    Good Morning
  </h1>

  {/* 🔍 SEARCH */}
  <div className="relative hidden md:block">
    <MdSearch
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />

    <input
      type="text"
      placeholder="Search employees, projects..."
      value={search}
      onChange={handleSearch}
      className="pl-10 pr-4 py-2 w-72 rounded-lg border border-gray-200 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                 bg-gray-50"
    />
  </div>

</div>


      <div className="flex items-center gap-6">

        <button className="relative text-gray-500 hover:text-indigo-600 transition">
          <MdNotificationsNone size={22} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </button>

        <div className="relative">

          <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {fullName?.[0] || "U"}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-800">
                {fullName}
              </p>
              <span className="text-xs text-gray-500">
                {role}
              </span>
            </div>

            <MdKeyboardArrowDown />
          </button>

          {/* 🔽 DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50">

              <button
                onClick={() => navigate("/dashboard/settings")}
                className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-gray-50"
              >
                <MdSettings size={18} />
                Settings
              </button>

              <button
                onClick={() => navigate("/changePassword")}
                className="w-full px-4 py-2 flex items-center gap-3 text-sm hover:bg-gray-50"
              >
                <MdSettings size={18} />
                Change Password
              </button>

              <hr />

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
                className="w-full px-4 py-2 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50"
              >
                <MdOutlineLogout size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
