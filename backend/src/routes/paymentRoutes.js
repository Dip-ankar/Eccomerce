import express from "express";
import {
  processPayment,
  sendAPIKey,
  verifyPayment,
} from "../controller/paymentController.js";
import { isAuthenticatedUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/payment/process",isAuthenticatedUser, processPayment);
router.get("/payment/razorpay-key",isAuthenticatedUser, sendAPIKey);
router.post("/payment/verify",isAuthenticatedUser, verifyPayment);

export default router;
