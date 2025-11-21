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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const proceedToPayment = () => {
    const orderData = { subtotal, shipping, tax, total };
    sessionStorage.setItem("orderItem", JSON.stringify(orderData));
    navigate("/process/payment");
  };

  return (
    <>
      <PageTitle title="Order Confirmation" />
      <Navbar />
      <CheckoutPath activeStep={1} />

      <div className="max-w-5xl mx-auto p-4 md:p-8 mt-6 mb-10 space-y-10">

        {/* HEADING */}
        <h1 className="text-3xl font-semibold text-gray-800 text-center">
          Order Confirmation
        </h1>

        {/* SHIPPING DETAILS */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Shipping Details
          </h2>

          <table className="w-full rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center bg-gray-50">
                <td className="p-3 font-medium">{user?.name}</td>
                <td className="p-3">{shippingInfo?.phoneNo}</td>
                <td className="p-3">
                  {shippingInfo?.address}, {shippingInfo?.city},{" "}
                  {shippingInfo?.state}, {shippingInfo?.country} -{" "}
                  {shippingInfo?.pinCode}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CART ITEMS */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Cart Items
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>

              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item.product}
                    className="text-center bg-gray-50 border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg shadow"
                      />
                    </td>
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-green-600 font-semibold">
                      ₹{item.price}
                    </td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 text-blue-600 font-semibold">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Order Summary
          </h2>

          <table className="w-full rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">Subtotal</th>
                <th className="p-3">Shipping</th>
                <th className="p-3">GST (18%)</th>
                <th className="p-3">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center bg-gray-50">
                <td className="p-3 font-semibold text-gray-700">
                  ₹{subtotal.toFixed(2)}
                </td>
                <td className="p-3 font-semibold text-gray-700">
                  ₹{shipping.toFixed(2)}
                </td>
                <td className="p-3 font-semibold text-gray-700">
                  ₹{tax.toFixed(2)}
                </td>
                <td className="p-3 text-xl font-bold text-green-700">
                  ₹{total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BUTTON */}
        <div className="text-center">
          <button
            onClick={proceedToPayment}
            className="px-10 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition"
          >
            Proceed to Payment →
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderConfirm;
