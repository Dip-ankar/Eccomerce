import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, removeErrors, removeSuccess } from "../features/user/userSlice";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.user);

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, avatar } = formData;

    if (!name || !email || !password || !avatar) {
      toast.error("All fields are required");
      return;
    }

    const form = new FormData();
    form.set("name", name);
    form.set("email", email);
    form.set("password", password);
    form.set("avatar", avatar);

    dispatch(register(form));
  };

  // React to Redux state changes
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Registration successful 🎉");
      navigate("/");
      dispatch(removeSuccess());
    }
  }, [error, success, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Username"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            onChange={handleChange}
          />

          <div className="flex flex-col items-center space-y-2">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="w-full border rounded-lg p-2"
              onChange={handleChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white py-3 rounded-lg font-semibold transition duration-200`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
