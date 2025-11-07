// components/Product.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  const [rating, setRating] = useState(product.ratings || 0);
  const isInStock = Number(product.stock) > 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="block bg-gray-900 text-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
    >
      {/* Mobile: flex-row, Desktop (md): flex-col */}
      <div className="flex flex-row md:flex-col">
        {/* Product Image */}
        <div className="w-1/2 md:w-full">
          <img
            src={product.image?.[0]?.url || "/placeholder.jpg"}
            alt={product.name || "Product"}
            className="w-full h-40 md:h-56 object-cover md:rounded-t-2xl md:rounded-b-none rounded-l-2xl"
          />
        </div>

        {/* Product Info */}
        <div className="w-1/2 md:w-full p-3 flex flex-col justify-between text-left">
          <div className="space-y-1">
            <h3 className="text-sm md:text-lg font-semibold truncate">
              {product.name || "Unnamed Product"}
            </h3>

            <p className="text-blue-400 text-sm md:text-base font-medium">
              <strong>Price:</strong> ₹{product.price || 0}/-
            </p>

            <p className="text-gray-400 text-xs md:text-sm line-clamp-2">
              {product.description || "No description available."}
            </p>

            <div className="flex items-center mt-1">
              <Rating value={rating} onRatingChange={setRating} disabled={true} />
              <span className="text-gray-400 text-xs md:text-sm ml-2">
                ({product.numOfReviews || 0} {product.numOfReviews === 1 ? "Review" : "Reviews"})
              </span>
            </div>

            <p className={`text-sm md:text-base font-semibold mt-1 ${isInStock ? "text-green-400" : "text-red-400"}`}>
              {isInStock ? `In Stock (${product.stock})` : "Out of Stock"}
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className={`px-2 py-1 rounded-md text-xs md:text-sm transition duration-300 w-full ${
                isInStock ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-600 cursor-not-allowed text-gray-300"
              }`}
              disabled={!isInStock}
            >
              Add To Cart
            </button>

            <button
              className={`px-2 py-1 rounded-md text-xs md:text-sm transition duration-300 w-full ${
                isInStock ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-600 cursor-not-allowed text-gray-300"
              }`}
              disabled={!isInStock}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;
