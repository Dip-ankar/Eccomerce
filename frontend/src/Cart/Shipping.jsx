import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { shippingInfo } = useSelector((state) => state.cart);

  // ✅ Load previously saved info (if any)
  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [postalCode, setPostalCode] = useState(shippingInfo?.postalCode || "");
  const [country, setCountry] = useState(shippingInfo?.country || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || "");

  useEffect(() => {
    // ✅ Redirect to login if user not logged in
    if (!user) {
      navigate("/login?redirect=shipping");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Save shipping info to redux + localStorage
    dispatch(
      saveShippingInfo({ address, city, postalCode, country, phoneNo })
    );

    // ✅ Go to order confirmation page
    navigate("/order/confirm");
  };

  return (
    <>
      <PageTitle title="Shipping Details" />
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            🏠 Shipping Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Postal Code
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter postal code"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Country
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country name"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="Enter 10-digit phone number"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
            >
              Continue to Order Confirmation →
            </button>
          </form>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8 space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span>Shipping</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Confirm Order</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Shipping;
