import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ added useNavigate

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Product from "../components/Product";
import Loader from "../components/Loader";
import NoProducts from "../components/NoProducts";
import Pagination from "../components/Pagination";

import { getProduct, removeErrors } from "../features/products/productSlice";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ initialize useNavigate

  const {
    loading,
    error,
    products = [],
    totalPages = 1,
    currentPage = 1,
    productCount,
  } = useSelector((state) => state.product);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const categories = [
    "All",
    "Mobile",
    "Laptop",
    "TV",
    "Headphone",
    "Men Shirt",
    "Women Shirt",
    "Smartwatch",
    "Camera",
  ];

  // fetch products
  useEffect(() => {
    dispatch(
      getProduct({
        keyword,
        category: selectedCategory,
        priceRange,
        page: currentPage,
      })
    );
  }, [dispatch, keyword, selectedCategory, priceRange, currentPage]);

  // show toast for error
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // ✅ category click handler (navigate to new URL for clarity)
  const handleCategoryChange = (cat) => {
    const newCategory = cat === "All" ? "" : cat;
    setSelectedCategory(newCategory);
    navigate(`/products?category=${encodeURIComponent(newCategory)}`);
  };

  // pagination handler
  const handlePageChange = (page) => {
    dispatch(
      getProduct({
        keyword,
        category: selectedCategory,
        priceRange,
        page,
      })
    );
    // ✅ update URL on page change
    navigate(`/products?page=${page}`);
  };

  return (
    <>
      <PageTitle title="All Products" />
      <Navbar />

      <div className="min-h-screen bg-gray-950 px-4 py-16 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-white shadow-md rounded-xl p-5 h-fit sticky top-24">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`cursor-pointer p-2 rounded-lg transition-all ${
                    selectedCategory === cat
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>

            {/* Price Filter */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Filter by Price
              </h3>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full accent-green-600"
              />
              <p className="text-gray-600 mt-1">
                ₹0 - ₹{priceRange[1].toLocaleString()}
              </p>
            </div>
          </aside>

          {/* Main Section */}
          <main className="flex-1 overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-200 mb-6">
              {keyword
                ? `Results for "${keyword}"`
                : selectedCategory
                ? `${selectedCategory} Products`
                : "All Products"}
            </h3>

            {loading ? (
              <Loader />
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination Section */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <NoProducts />
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Products;
