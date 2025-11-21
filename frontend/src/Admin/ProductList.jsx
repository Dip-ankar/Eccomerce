// src/pages/admin/AdminProductList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  removeErrors,
} from "../features/admin/adminSlice";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";

import { Boxes, Edit, Trash, Star, AlertTriangle } from "lucide-react";

const AdminProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <PageTitle title="Admin | All Products" />

      <div className="min-h-screen bg-gray-100 py-16 px-4 md:px-14">

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(removeErrors())}
              className="font-bold"
            >
              ✖
            </button>
          </div>
        )}

        {/* HEADING */}
        <div className="flex items-center gap-3 mb-6">
          <Boxes className="text-blue-600" size={26} />
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}

        {/* TABLE */}
        {!loading && products?.length > 0 ? (
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">SL No</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* SL NO */}
                    <td className="p-3 font-semibold">{index + 1}</td>

                    {/* IMAGE */}
                    <td className="p-3">
                      <img
                        src={item.image?.[0]?.url}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg shadow"
                      />
                    </td>

                    {/* NAME */}
                    <td className="p-3 font-medium text-gray-700">
                      {item.name}
                    </td>

                    {/* CATEGORY */}
                    <td className="p-3 text-gray-600 capitalize">
                      {item.category || "N/A"}
                    </td>

                    {/* PRICE */}
                    <td className="p-3 text-green-700 font-semibold">
                      ₹{item.price}
                    </td>

                    {/* RATING */}
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500" />
                        <span className="font-medium">{item.ratings || 0}</span>
                      </div>
                    </td>

                    {/* STOCK */}
                    <td className="p-3">
                      {item.stock > 0 ? (
                        <span className="text-blue-600 font-semibold">
                          {item.stock}
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center gap-1 font-semibold">
                          <AlertTriangle size={16} />
                          Out of Stock
                        </span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="p-3 text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-3 flex gap-4 text-gray-600">
                      <button className="hover:text-blue-600 transition flex items-center gap-1">
                        <Edit size={18} /> Edit
                      </button>

                      <button className="hover:text-red-600 transition flex items-center gap-1">
                        <Trash size={18} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-500">No products found.</p>
          )
        )}
      </div>

      <Footer />
    </>
  );
};

export default AdminProductList;
