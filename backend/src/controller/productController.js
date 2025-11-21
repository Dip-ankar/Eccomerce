import Product from "../models/productModel.js";
import { uploadImage } from "../utils/imagekit.js";

import multer from "multer";

const storage = multer.memoryStorage();

export const uploadProductImages = multer({ storage }).array("images", 10);


export const createProducts = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product images are required" });
    }

    // Upload all images
    let imagesArray = [];

    for (const file of req.files) {
      const uploaded = await uploadImage(file, "Ecommerce/products");

      imagesArray.push({
        public_id: uploaded.fileId,
        url: uploaded.url,
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: imagesArray,
      user: req.user.id, // from auth middleware
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Product Create Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllProducts = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 10, category } = req.query;

    const minPrice = req.query.price?.gte;
    const maxPrice = req.query.price?.lte;

    const currentPage = parseInt(page, 10);
    const resultPerPage = parseInt(limit, 8);

    let query = {};

    // ✅ Search by keyword
    if (keyword) {
      const regex = new RegExp(keyword.trim(), "i");
      query.$or = [
        { name: regex },
        { category: regex },
        { description: regex },
      ];
    }

    // ✅ Filter by category
    if (category) {
      query.category = new RegExp(category.trim(), "i");
    }

    // ✅ Filter by price range (supports ?price[gte]= & price[lte]= )
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ✅ Pagination + Count
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / resultPerPage);

    const products = await Product.find(query)
      .select("_id name price category description image stock ratings numOfReviews")
      .skip((currentPage - 1) * resultPerPage)
      .limit(resultPerPage);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};


// update product

export const updateProduct = async(req,res)=>{
    const product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }

    res.status(200).json({
        success:true,
        product
    })
}


//Delete Product

export const deleteProduct = async(req,res)=>{

   const product=await Product.findByIdAndDelete(req.params.id);

        if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }

    res.status(200).json({
        success:true,
        message:"Product deleted succesfully"
    })
}


//accesing single product

export const getSingleProduct = async(req,res)=>{

    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }


    res.status(200).json({
        success:true,
        product
    })
}

export const getAdminProducts = async(req,res)=>{
  const products = await Product.find();
  res.status(200).json({
    success:true,
    products
  })
}

//creating and upadating review

export const createReviewForProduct = async(req,res)=>{
    const{rating,comment,productId} = req.body;
    const review = {
      user:req.user._id,
      name:req.user.name,
      rating:Number(rating),
      comment
    }

    const product = await Product.findById(productId);
    
    const reviewExists=product.reviews.find(review=>review.user && review.user.toString()===req.user.id.toString());

    if(reviewExists){
      product.reviews.forEach(review=>{
        if(review.user && review.user.toString()===req.user.id.toString()){
          review.rating=rating,
          review.comment=comment
        }
      })
    }else{
      product.reviews.push(review);
    }

    product.numOfReviews=product.reviews.length

    let sum =0;
    product.reviews.forEach(review=>{
      sum+=review.rating
    })

    product.ratings=product.reviews.length>0?sum/product.reviews.length:0
    await product.save({validateBeforeSave:false});

    res.status(200).json({
      success:true,
      product
    })
}


export const getProductsReview = async(req,res)=>{
  const product = await Product.findById(req.query.id);

  if(!product){
    return res.status(400).json({
      success:false,
      message:"product are not found"
    })
  }

  res.status(200).json({
    success:true,
    message:"review fetched are successfully",
    reviews:product.reviews
  })
}


export const deleteReview = async(req,res)=>{
  const product = await Product.findById(req.query.productId);

  if(!product){
    return res.status(400).json({
      success:false,
      message:"product are not found"
    })
  }

  const reviews = product.reviews.filter(review=>review._id.toString() !== req.query.id.toString())

  let sum =0;
  reviews.forEach(review=>{
    sum +=review.rating
  })

  const ratings = sum/reviews.length>0?sum/reviews.length:0;

  const numOfReviews=reviews.length;
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews
  },{
    new:true,
    runValidators:true
  })

  res.status(200).json({
    success:true,
    message:"review deleted successfully"
  })
}
