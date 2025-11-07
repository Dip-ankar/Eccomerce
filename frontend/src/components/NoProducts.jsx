import React, { useEffect } from "react";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const NoProducts = ({ showToast }) => {
  useEffect(() => {
    if (showToast) {
      toast.info("No products available at the moment!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    }
  }, [showToast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-blue-100"></div>

      <div className="bg-blue-100 text-blue-600 p-6 rounded-full shadow-md mb-6 animate-bounce">
        <SentimentDissatisfiedIcon style={{ fontSize: 48 }} />
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        No Products Found
      </h1>

      <p className="text-gray-500 max-w-md mb-6">
        It seems there are no products available right now.  
        Try adjusting your filters or check back later!
      </p>

      <Link
        to="/products"
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 shadow-md"
      >
        Browse All Products
      </Link>
    </div>
  );
};

export default NoProducts;
