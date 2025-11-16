import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, removeErrors, removeSuccess } from "../features/user/userSlice";

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const { error, loading, success, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // ------------------------------
  // Handle Input
  // ------------------------------
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ------------------------------
  // Submit Login
  // ------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("Please fill all fields");
      return;
    }

    dispatch(login({ email: user.email, password: user.password }));
  };

  // ------------------------------
  // Show Error Toast
  // ------------------------------
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2500,
        toastId: "login_error",
      });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  // ------------------------------
  // SUCCESS LOGIN TOAST + REDIRECT
  // ------------------------------
  useEffect(() => {
    if (success && isAuthenticated) {
      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 2000,
        toastId: "login_success", // 👉 shows only once
      });

      dispatch(removeSuccess());

      // redirect only once
      navigate(redirect);
    }
  }, [success, isAuthenticated, dispatch, navigate, redirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400"
          />

          <div className="text-right text-sm">
            <Link to="/password/forgot" className="text-pink-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
            } text-white py-3 rounded-lg font-semibold transition duration-200`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-pink-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
