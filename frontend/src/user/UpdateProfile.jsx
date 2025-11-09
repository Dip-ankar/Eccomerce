import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

import {
  updateProfile,
  loadUser,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, success } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/profile.png");

  // 🔹 Pre-fill user data when loaded
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar?.url || "/images/profile.png");
    }
  }, [user]);

  // 🔹 Handle image preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    if (avatar) formData.set("avatar", avatar);

    dispatch(updateProfile(formData));
  };

  // 🔹 Handle success/error states
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Profile updated successfully");
      dispatch(loadUser()); // refresh updated user info
      navigate("/me");
      dispatch(removeSuccess());
    }
  }, [error, success, dispatch, navigate]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center py-20 px-5">
        <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl transition-all duration-300 hover:shadow-purple-300">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Edit Profile
          </h2>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* Image Upload Section */}
            <div className="flex flex-col items-center space-y-3">
              <img
                src={avatarPreview}
                alt="Profile Preview"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-indigo-400 shadow-md"
              />
              <label className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-all">
                Change Image
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-auto ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white py-3 px-6 rounded-xl font-semibold transition duration-200`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/me")}
                className="w-full md:w-auto bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProfile;
