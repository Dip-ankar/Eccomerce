import express from "express";
import { isAuthenticatedUser, roleBasedAccess } from '../middleware/authMiddleware.js';
import { allMyOrders, cancelOrder, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/orderController.js";

const router = express.Router();


router.route('/new/order').post(isAuthenticatedUser,createNewOrder);

router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)

router.route('/admin/order/:id').get(isAuthenticatedUser,roleBasedAccess("admin"),getSingleOrder)
.put(isAuthenticatedUser,roleBasedAccess("admin"),updateOrderStatus)
.delete(isAuthenticatedUser,roleBasedAccess("admin"),deleteOrder);

router.route('/admin/orders').get(isAuthenticatedUser,roleBasedAccess("admin"),getAllOrders);

router.route('/orders/user').get(isAuthenticatedUser,allMyOrders)

router.put("/order/:id/cancel", isAuthenticatedUser, cancelOrder);
export default router;