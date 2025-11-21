import express from 'express';
import { createProducts, createReviewForProduct, deleteProduct, deleteReview, getAdminProducts, getAllProducts, getProductsReview, getSingleProduct, updateProduct, uploadProductImages } from '../controller/productController.js';
import { isAuthenticatedUser,roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();


router.route("/products").get(getAllProducts)

router.route("/admin/products").get(isAuthenticatedUser,roleBasedAccess("admin"),getAdminProducts);

router.route("/admin/product/create").post(isAuthenticatedUser,roleBasedAccess("admin"),uploadProductImages,createProducts);

router.route("/admin/product/:id").put(isAuthenticatedUser,roleBasedAccess("admin"),updateProduct).delete(isAuthenticatedUser,roleBasedAccess("admin"),deleteProduct)

router.get("/product/:id",getSingleProduct);

router.route("/review").put(isAuthenticatedUser,createReviewForProduct)


router.route("/reviews").get(isAuthenticatedUser,getProductsReview).delete(isAuthenticatedUser,roleBasedAccess("admin"),deleteReview);


export default router;