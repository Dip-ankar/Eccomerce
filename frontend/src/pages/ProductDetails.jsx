import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "@mui/material/Rating";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductDetails, removeErrors } from "../features/products/productSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, error, product } = useSelector((state) => state.product);

  // ✅ Fetch product details
  useEffect(() => {
    if (id) dispatch(getProductDetails(id));

    return () => {
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  // ✅ Handle error toast
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // ✅ Rating change handler
  const handleRatingChange = (event, newValue) => {
    setUserRating(newValue);
  };

  // ✅ Review submit handler
  const handleReviewSubmit = (e) => {
    e.preventDefault(); // prevent reload
    console.log("Rating:", userRating);
    console.log("Comment:", comment);

    // Clear fields
    setUserRating(0);
    setComment("");

    toast.success("Review submitted!", { position: "top-center", autoClose: 3000 });

    // You can dispatch Redux action later:
    // dispatch(submitReview({ id: product._id, rating: userRating, comment }))
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  // ✅ Error / Not Found UI
  if (error || !product) {
    return (
      <>
        <PageTitle title="Product Not Found" />
        <Navbar />
        <div className="min-h-[50vh] flex items-center justify-center text-gray-500 text-lg">
          Product not found or failed to load.
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title={`${product.name} - Details`} />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Product Section */}
        <div className="flex flex-col md:flex-row gap-10 items-start py-10">
          {/* Product Image */}
          <div className="w-full md:w-1/2 flex justify-center items-center py-30">
            <img
              src={product.image && product.image[0]?.url?.replace("./", "/")}
              alt={product.name}
              className="rounded-2xl shadow-md object-cover w-full sm:w-3/4 md:w-full max-w-md"
            />
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h2>
            <p className="text-gray-600 mb-3 leading-relaxed">{product.description}</p>
            <p className="text-2xl font-semibold text-green-600 mb-4">
              ₹{product.price}
            </p>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <Rating value={product.ratings || 0} precision={0.5} readOnly />
              <span className="ml-2 text-gray-500 text-sm">
                ({product.numOfReviews}{" "}
                {product.numOfReviews === 1 ? "Review" : "Reviews"})
              </span>
            </div>

            {/* Stock */}
            <p
              className={`text-sm mb-4 ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <button
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                <button className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-all w-full sm:w-auto">
                  Add to Cart
                </button>
              </>
            )}

            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="mt-10">
              <h3 className="text-xl font-semibold mb-3">Write a Review</h3>
              <Rating
                value={userRating}
                onChange={handleRatingChange}
                className="mb-3"
              />
              <textarea
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-24 border border-gray-300 rounded-lg p-2 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-5 text-gray-800">
            Customer Reviews
          </h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition"
                >
                  <Rating value={review.rating} readOnly size="small" />
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-1 font-medium">
                    — {review.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-5">
              No reviews yet. Be the first to review this product.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetails;
