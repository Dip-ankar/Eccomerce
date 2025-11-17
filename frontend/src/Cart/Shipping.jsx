// src/pages/Shipping.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import CheckoutPath from "../Cart/CheckoutPath"

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // ==============================
  // Redirect if user NOT Logged In
  // ==============================
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/shipping");
    }
  }, [isAuthenticated, navigate]);

  // =================================
  // Local State Pre-filled from Redux
  // =================================
  const [address, setAddress] = useState(shippingInfo.address || "");
  const [city, setCity] = useState(shippingInfo.city || "");
  const [state, setState] = useState(shippingInfo.state || "");
  const [country, setCountry] = useState(shippingInfo.country || "");
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || "");

  // ==============================
  // Submit Handler
  // ==============================
  const shippingSubmit = (e) => {
    e.preventDefault();

    const data = {
      address,
      city,
      state,
      country,
      pinCode,
      phoneNo,
    };

    dispatch(saveShippingInfo(data));

    navigate("/order/confirm");
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Shipping Details" />

      <CheckoutPath/>

      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">

        <h2 className="text-2xl font-semibold mb-6">Shipping Information</h2>

        <form onSubmit={shippingSubmit} className="space-y-5">

          {/* Address */}
          <div>
            <label className="block mb-1">Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter address"
            />
          </div>

          {/* City */}
          <div>
            <label className="block mb-1">City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter city"
            />
          </div>

          {/* State */}
          <div>
            <label className="block mb-1">State</label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter state"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block mb-1">Country</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter country"
            />
          </div>

          {/* Pin Code */}
          <div>
            <label className="block mb-1">Pin Code</label>
            <input
              type="number"
              required
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter pin code"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="number"
              required
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter phone number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Continue
          </button>

        </form>
      </div>

      <Footer />
    </>
  );
};

export default Shipping;
