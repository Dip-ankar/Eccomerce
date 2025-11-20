// src/pages/OrderDetails.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../features/order/orderSlice";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, order, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Order Details
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center my-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 font-medium bg-red-100 p-3 rounded mb-5">
            {error}
          </p>
        )}

        {/* Order Details Card */}
        {!loading && order && order._id && (
          <div className="bg-white shadow-lg rounded-xl p-6 space-y-6 border">

            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Order Summary
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm
                    ${order.orderStatus === "Delivered" ? "bg-green-600" : 
                     order.orderStatus === "Shipped" ? "bg-blue-600" : 
                     "bg-yellow-600"}`}>
                    {order.orderStatus}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Total Amount:</span> ₹{order.totalPrice}
                </p>
                <p>
                  <span className="font-semibold">Payment Mode:</span> {order.paymentInfo?.method}
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Shipping Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-700">
                <p><span className="font-semibold">Name:</span> {order.user?.name}</p>
                <p><span className="font-semibold">Phone:</span> {order.shippingInfo?.phone}</p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {`${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.state} - ${order.shippingInfo?.pincode}`}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Items</h2>
              
              <div className="space-y-4">
                {order.orderItems?.map((item) => (
                  <div 
                    key={item._id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>

                    <p className="font-semibold text-gray-800">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default OrderDetails;
