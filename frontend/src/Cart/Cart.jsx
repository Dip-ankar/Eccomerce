import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  addItemsToCart,
  removeErrors,
  removeMessage,
  removeCartItem,
} from "../features/cart/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, loading, error, success, message } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.user);

  const [quantities, setQuantities] = useState({});

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) {
      toast.info("Please login to view your cart!", { position: "top-center" });
      navigate("/login?redirect=cart");
    }
  }, [user, navigate]);

  // Initialize quantities
  useEffect(() => {
    const q = {};
    cartItems.forEach((item) => {
      q[item.product] = item.quantity;
    });
    setQuantities(q);
  }, [cartItems]);

  // Error handler
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  // Success message handler
  useEffect(() => {
    if (success && message) {
      toast.success(message, { autoClose: 1200 });
      dispatch(removeMessage());
    }
  }, [success, message, dispatch]);

  // Format INR money
  const format = (num) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(num);

  // Quantity logic
  const increaseQuantity = (id, stock) => {
    setQuantities((prev) => {
      const newQty = prev[id] + 1;
      if (newQty > stock) {
        toast.warn("Cannot exceed available stock!");
        return prev;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => {
      const newQty = prev[id] - 1;
      if (newQty < 1) {
        toast.warn("Quantity cannot be less than 1");
        return prev;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const handleUpdate = (id, quantity) => {
    dispatch(addItemsToCart({ id, quantity, userId: user._id }));
  };

  const handleRemove = (id) => {
    dispatch(removeCartItem({ id, userId: user._id }));
  };

  // Price calculations
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  // Checkout redirect
  const checkoutHandler = () => {
    navigate("/shipping");
  };

  if (!user) return null;

  // Empty cart UI
  if (cartItems.length === 0) {
    return (
      <>
        <PageTitle title="Your Cart" />
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Your cart is empty 🛒
          </h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Your Cart" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">
          🛍️ Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const currentQty = quantities[item.product] || item.quantity;
              const isUpdated = currentQty !== item.quantity;

              return (
                <div
                  key={item.product}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Price: {format(item.price)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Stock: {item.stock}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => decreaseQuantity(item.product)}
                      className="px-3 py-1 text-lg border rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={currentQty}
                      readOnly
                      className="w-12 text-center border rounded-lg"
                    />
                    <button
                      onClick={() => increaseQuantity(item.product, item.stock)}
                      className="px-3 py-1 text-lg border rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>

                    {/* Update */}
                    <button
                      onClick={() =>
                        handleUpdate(item.product, quantities[item.product])
                      }
                      disabled={!isUpdated || loading}
                      className={`ml-3 px-4 py-2 rounded-lg text-sm font-semibold ${
                        isUpdated
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      {loading && isUpdated ? "Updating..." : "Update"}
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.product)}
                      className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right mt-3 sm:mt-0">
                    <p className="font-semibold">
                      {format(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <aside className="bg-white p-6 rounded-2xl shadow-md sticky top-20 h-fit">
            <h2 className="text-xl font-bold mb-4 border-b pb-3">
              🧾 Order Summary
            </h2>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : format(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>{format(tax)}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-indigo-600">{format(total)}</span>
            </div>

            <button
              onClick={checkoutHandler}
              className="w-full mt-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Cart;
