// src/pages/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, removeErrors, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { error, success, loading } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warn("Please enter your email!");
      return;
    }
    dispatch(forgotPassword({ email }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Password reset link sent to your email!");
      dispatch(removeSuccess());
    }
  }, [dispatch, error, success]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-2xl w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
