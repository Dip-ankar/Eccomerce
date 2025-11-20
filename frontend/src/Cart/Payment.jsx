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

  const {user} = useSelector((state)=>state.user)
  // Redirect if data missing on refresh
  useEffect(() => {
    if (!orderItem || !cartItems?.length || !shippingInfo) {
      navigate("/order/confirm");
    }
  }, [orderItem, cartItems, shippingInfo, navigate]);

  if (!orderItem) return null;

  const { subtotal, shipping, tax, total } = orderItem;

  // 🔥 Razorpay Payment Handler
const handlePayment = async () => {
  try {
    // 1️⃣ Get Razorpay API key
    const keyRes = await fetch("/api/payment/razorpay-key");
    const { key } = await keyRes.json();

    // 2️⃣ Create order on backend
    const orderRes = await fetch("/api/payment/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: total }),
    });

    const { order } = await orderRes.json();

    // 3️⃣ Razorpay Options
    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "FirstShop",
      description: "Eccommerce Website Payment Transaction",
      order_id: order.id,
      prefill: {
        name: user.name,
        email: user.email,
        contact: shippingInfo.phoneNo,
      },

      // 💥 PAYMENTS SUCCESS HANDLER (CALLS BACKEND VERIFY)
      handler: async function (response) {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verification = await verifyRes.json();

        if (verification.success) {
          navigate("/order/success");
        } else {
          alert("Payment Verification Failed ❌");
        }
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Payment failed, try again.");
  }
};


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

          {/* Pay Button */}
          <button
            onClick={handlePayment}
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

          <p className="mt-3 text-xs text-gray-500 text-center">
            Secure payment powered by Razorpay.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Payment;
