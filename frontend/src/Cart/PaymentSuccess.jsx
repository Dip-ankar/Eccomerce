// src/pages/PaymentSuccess.jsx

import React, { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, removeErrors, removeSuccess } from "../features/order/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paymentId = searchParams.get("payment_id");
  const orderId = searchParams.get("order_id");

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {
    // Prevent direct open
    if (!paymentId || !cartItems.length || !shippingInfo) {
      navigate("/");
      return;
    }

    const createOrderHandler = async () => {
      try {
        const orderData = {
          shippingInfo,
          orderItems: cartItems.map((item) => ({
            name: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            product: item._id,
          })),

          itemPrice: Number(sessionStorage.getItem("subtotal")),
          taxPrice: Number(sessionStorage.getItem("tax")),
          shippingPrice: Number(sessionStorage.getItem("shipping")),
          totalPrice: Number(sessionStorage.getItem("total")),

          paymentInfo: {
            id: paymentId,
            status: "Paid",
          },
        };

        const res = await dispatch(createOrder(orderData));

        if (res.payload?.success) {
          toast.success("Order Created Successfully!", {
            autoClose: 2000,
            position: "top-center",
          });

          // 🟢 FIXED → Call functions properly
          dispatch(clearCart());
          dispatch(removeSuccess());

          // Remove all cart data
          localStorage.removeItem("cartItems");
          sessionStorage.removeItem("orderItem");
        }
      } catch (error) {
        toast.error("Failed to create order!", {
          autoClose: 2000,
          position: "top-center",
        });

        // 🟢 FIXED
        dispatch(removeErrors());
      }
    };

    createOrderHandler();
  }, [dispatch, paymentId, cartItems, shippingInfo, navigate]);

  return (
    <>
      <PageTitle title="Payment Status" />
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-green-500" size={70} />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful 🎉
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for your purchase! Your order has been placed.
          </p>

          <div className="bg-gray-100 py-3 px-4 rounded-xl border border-gray-200 mb-6">
            <p className="text-gray-500 text-sm">Payment ID</p>
            <p className="text-gray-800 font-semibold">{paymentId}</p>

            <p className="text-gray-500 text-sm mt-3">Order ID</p>
            <p className="text-gray-800 font-semibold">{orderId}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/orders/user"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold transition hover:bg-green-700"
            >
              View My Orders
            </Link>

            <Link
              to="/"
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition hover:bg-gray-300"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentSuccess;
