import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../features/order/orderSlice";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { Loader2 } from "lucide-react";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  return (
    <>
      <PageTitle title="My Orders" />
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-20">
        <div className="max-w-5xl mx-auto">

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            My Orders
          </h1>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 mb-4 text-center">{error}</p>
          )}

          {/* No Orders */}
          {!loading && orders?.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-4">
                You haven't placed any orders yet.
              </p>

              <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Shop Now
              </Link>
            </div>
          )}

          {/* Orders List */}
          <div className="grid sm:grid-cols-2 gap-6">
            {orders?.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
              >
                {/* Order ID */}
                <p className="text-gray-500 text-sm mb-1">
                  Order ID: <span className="font-medium">{order._id}</span>
                </p>

                {/* Status */}
                <p className="text-sm mb-3">
                  Status:
                  <span
                    className={`ml-2 px-2 py-1 rounded text-white text-xs 
                ${
                  order.orderStatus === "Delivered"
                    ? "bg-green-600"
                    : "bg-orange-500"
                }`}
                  >
                    {order.orderStatus}
                  </span>
                </p>

                {/* Price */}
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  ₹{order.totalPrice}
                </p>

                {/* Date */}
                <p className="text-gray-500 text-sm mb-4">
                  Placed on:{" "}
                  {new Date(order.createAt).toLocaleDateString("en-IN")}
                </p>

                {/* View Button */}
                <Link
                  to={`/order/${order._id}`}
                  className="block w-full bg-blue-600 text-center text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyOrders;
