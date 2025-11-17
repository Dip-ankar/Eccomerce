import React from "react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import CheckoutPath from "./CheckoutPath";
import { useNavigate } from "react-router-dom";

const OrderConfirm = () => {
  const navigate = useNavigate();

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  // Price calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // 🔥 When clicking Proceed → Save to sessionStorage → Navigate
  const proceedToPayment = () => {
    const orderData = {
      subtotal,
      shipping,
      tax,
      total,
    };

    // Save to session storage
    sessionStorage.setItem("orderItem", JSON.stringify(orderData));

    // Navigate to payment page
    navigate("/process/payment");
  };

  return (
    <>
      <PageTitle title="Order Confirmation" />
      <Navbar />
      <CheckoutPath activeStep={1}/>

      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>

        {/* SHIPPING DETAILS */}
        <table className="w-full border mb-6">
          <caption className="font-bold text-lg mb-2">
            Shipping Details
          </caption>
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center">
              <td className="p-2">{user?.name}</td>
              <td className="p-2">{shippingInfo?.phoneNumber}</td>
              <td className="p-2">
                {shippingInfo?.address}, {shippingInfo?.city},
                {shippingInfo?.state}, {shippingInfo?.country} -
                {shippingInfo?.pincode}
              </td>
            </tr>
          </tbody>
        </table>

        {/* CART ITEMS */}
        <table className="w-full border mb-6">
          <caption className="font-bold text-lg mb-2">Cart Items</caption>

          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Image</th>
              <th className="p-2">Product Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>

          <tbody>
            {cartItems.map((item) => (
              <tr key={item.product} className="text-center">
                <td className="p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover mx-auto"
                  />
                </td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">₹{item.price}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ORDER SUMMARY */}
        <table className="w-full border mb-6">
          <caption className="font-bold text-lg mb-2">
            Order Summary
          </caption>

          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Subtotal</th>
              <th className="p-2">Shipping</th>
              <th className="p-2">GST (18%)</th>
              <th className="p-2">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="text-center">
              <td className="p-2">₹{subtotal.toFixed(2)}</td>
              <td className="p-2">₹{shipping.toFixed(2)}</td>
              <td className="p-2">₹{tax.toFixed(2)}</td>
              <td className="p-2 font-bold">₹{total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* BUTTON */}
        <button
          onClick={proceedToPayment}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      </div>

      <Footer />
    </>
  );
};

export default OrderConfirm;
