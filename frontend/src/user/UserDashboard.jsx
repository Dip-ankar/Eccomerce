import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // 👈 control dropdown open/close

  // Navigation functions
  const orders = () => {
    navigate("/orders/user");
    setOpen(false);
  };
  const profile = () => {
    navigate("/me");
    setOpen(false);
  };
  const logout = () => {
    navigate("/register");
    setOpen(false);
  };
  const dashboard = () => {
    navigate("/admin/dashboard");
    setOpen(false);
  };

  // Options for dropdown
  const options = [
    { name: "Orders", funcName: orders },
    { name: "Account", funcName: profile },
    { name: "Logout", funcName: logout },
  ];

  if (user?.role === "admin") {
    options.unshift({ name: "Admin Dashboard", funcName: dashboard });
  }

  return (
    <div className="fixed top-2 right-6 z-50">
      <div className="relative cursor-pointer select-none">
        {/* Profile Section */}
        <div
          onClick={() => setOpen(!open)} // 👈 toggle dropdown
          className="flex items-center space-x-3 bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-full hover:from-indigo-200 hover:to-purple-200 transition-all shadow-md"
        >
          <img
            src={user?.avatar?.url || "/images/profile.png"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400 shadow-sm hover:scale-105 transition-transform duration-300"
          />
          <span className="font-semibold text-gray-800 text-sm md:text-base tracking-wide">
            {user?.name || "User"}
          </span>
        </div>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-3 w-52 bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-out">
            {options.map((item, index) => (
              <button
                key={item.name}
                onClick={item.funcName}
                className={`w-full text-left px-5 py-3 text-gray-700 text-sm font-medium hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white transition-all ${
                  index !== options.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
