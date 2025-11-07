// pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Imageslider from "../components/Imageslider";

import { getProduct, removeErrors } from "../features/products/productSlice";
import NoProducts from "../components/NoProducts";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products = [] } = useSelector((state) => state.product);

  const [randomProducts, setRandomProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    dispatch(getProduct({ page: 1 }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Shuffle products for random display
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 8)); // Display first 8
    }
  }, [products]);

  return (
    <>
      <PageTitle title="FirstShop" />
      <Navbar />
      <Imageslider />

      <div className="min-h-screen bg-gray-950 px-4 py-16 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-400 mb-10 text-center">
          Trending Product
        </h2>

        {loading ? (
          <Loader />
        ) : randomProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {randomProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <NoProducts/>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;
