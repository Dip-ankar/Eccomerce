import React, { useEffect } from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Register from "./user/Register";
import Login from "./user/Login";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./features/user/userSlice";
import { loadCartForUser } from "./features/cart/cartSlice";
import UserDashboard from "./user/UserDashboard";
import Profile from "./user/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProfile from "./user/UpdateProfile";
import UpdatePassword from "./user/UpdatePassword";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Cart from "./Cart/Cart";
import Shipping from "./Cart/Shipping";
import OrderConfirm from "./Cart/OrderConfirm";
import Payment from "./Cart/Payment";
import PaymentSuccess from "./Cart/PaymentSuccess";
import MyOrders from "./order/MyOrders";
import OrderDetails from "./order/OrderDetails";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  // 🔹 Load user on refresh
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  // 🔹 Load cart for logged-in user on every refresh
  useEffect(() => {
    if (user?._id) {
      dispatch(loadCartForUser(user._id));
    }
  }, [user, dispatch]);

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/profile/update"
          element={<ProtectedRoute element={<UpdateProfile />} />}
        />

        <Route
          path="/me"
          element={<ProtectedRoute element={<Profile />} />}
        />

        <Route
          path="/password/update"
          element={<ProtectedRoute element={<UpdatePassword />} />}
        />

        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route path="/cart" element={<Cart />} />

        <Route
          path="/shipping"
          element={<ProtectedRoute element={<Shipping />} />}
        />

        <Route
          path="/order/confirm"
          element={<ProtectedRoute element={<OrderConfirm />} />}
        />

        <Route
          path="/process/payment"
          element={<ProtectedRoute element={<Payment />} />}
        />
        <Route
          path="/order/success"
          element={<ProtectedRoute element={<PaymentSuccess />} />}
        />
        <Route
          path="/orders/user"
          element={<ProtectedRoute element={<MyOrders />} />}
        />
        <Route
          path="/order/:id"
          element={<ProtectedRoute element={<OrderDetails />} />}
        />
      </Routes>

      {/* Bottom Sidebar Profile */}
      {isAuthenticated && <UserDashboard user={user} />}
    </Router>
  );
};

export default App;
