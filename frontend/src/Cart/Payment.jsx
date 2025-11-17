import React, { useEffect } from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();

  const orderItem = JSON.parse(sessionStorage.getItem("orderItem"));
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  // ❗ Redirect if user refreshes and required data is missing
  useEffect(() => {
    if (!orderItem || !cartItems?.length || !shippingInfo) {
      navigate("/order/confirm");
    }
  }, [orderItem, cartItems, shippingInfo, navigate]);

  if (!orderItem) return null;

  const { subtotal, shipping, tax, total } = orderItem;

  return (
    <>
      <PageTitle title="Payment Processing" />
      <Navbar />
      <CheckoutPath activeStep={2} />

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back Button */}
        <Link
          to="/order/confirm"
          className="inline-block mb-5 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Go Back
        </Link>

        {/* Payment Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Payment Summary
          </h2>

          {/* Summary Details */}
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Charges</span>
              <span className="font-medium">₹{shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span className="font-medium">₹{tax.toFixed(2)}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={() => navigate("/order/success")}
            className="
              w-full 
              bg-blue-600 
              text-white 
              py-3 
              mt-6 
              rounded-lg 
              text-lg 
              font-semibold 
              hover:bg-blue-700 
              transition 
              duration-200
            "
          >
            Pay ₹{total.toFixed(2)}
          </button>

          {/* Note */}
          <p className="mt-3 text-xs text-gray-500 text-center">
            You will be redirected to the order success page.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Payment;
