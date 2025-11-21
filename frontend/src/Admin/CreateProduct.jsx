import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.admin);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  /* ==============================
       HANDLE IMAGES (MULTIPLE)
  =============================== */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages(files);

    const previewList = [];
    files.forEach((file) => {
      previewList.push(URL.createObjectURL(file));
    });

    setPreviewImages(previewList);
  };

  /* ==============================
       SUBMIT FORM
  =============================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload product images!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);

    images.forEach((img) => formData.append("images", img));

    dispatch(createProduct(formData));
  };

  /* ==============================
       HANDLE ERRORS + SUCCESS
  =============================== */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Product Created Successfully!");

      dispatch(removeSuccess());
      
      // Optional redirect after creation
      navigate("/admin/products");
    }
  }, [error, success, dispatch, navigate]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NAME */}
        <div>
          <label className="block font-medium mb-1">Product Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block font-medium mb-1">Price</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        {/* STOCK */}
        <div>
          <label className="block font-medium mb-1">Stock</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Enter stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        {/* IMAGES */}
        <div>
          <label className="block font-medium mb-1">Product Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* IMAGE PREVIEW */}
        {previewImages.length > 0 && (
          <div className="flex gap-3 flex-wrap mt-2">
            {previewImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
