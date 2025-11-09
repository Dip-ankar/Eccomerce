import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";

const Profile = () => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // 🔹 Redirect if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center py-10 px-5">
      <PageTitle title={`${user?.name || "User"}'s Profile`} />

      {/* Profile Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-3xl transition-all duration-300 hover:shadow-purple-300">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Image */}
          <div className="relative group">
            <img
              src={user?.avatar?.url || "/images/profile.png"}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-400 shadow-md group-hover:scale-105 transition-transform duration-300"
            />
            <Link
              to="/profile/update"
              className="absolute bottom-2 right-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-indigo-600 transition-all"
            >
              Edit
            </Link>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              My Profile
            </h1>

            <div>
              <h2 className="text-sm text-gray-500 uppercase font-semibold">
                Name
              </h2>
              <p className="text-lg font-medium text-gray-800">
                {user?.name || "Guest"}
              </p>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 uppercase font-semibold">
                Email
              </h2>
              <p className="text-lg font-medium text-gray-800">
                {user?.email || "guest@example.com"}
              </p>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 uppercase font-semibold">
                Joined On
              </h2>
              <p className="text-lg font-medium text-gray-800">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "January 1, 2025"}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* Profile Actions */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
          <Link
            to="/orders/user"
            className="w-full md:w-auto text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            My Orders
          </Link>

          <Link
            to="/password/update"
            className="w-full md:w-auto text-center bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold px-6 py-3 rounded-xl shadow hover:from-pink-600 hover:to-red-600 transition-all duration-300"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
