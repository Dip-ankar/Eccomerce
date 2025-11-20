import crypto from "crypto";
import instance from "../config/razorpay.js";

// ----------------------------------------
// 1️⃣ Create Razorpay Order
// ----------------------------------------
export const processPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const options = {
      amount: Number(amount * 100), // Convert to paise
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.message,
    });
  }
};

// ----------------------------------------
// 2️⃣ Send Razorpay API Key to Frontend
// ----------------------------------------
export const sendAPIKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_API_KEY, // Public key only
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load Razorpay Key",
    });
  }
};

// ----------------------------------------
// 3️⃣ Verify Razorpay Payment Signature
// ----------------------------------------
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed!",
      });
    }

    // 👍 VERIFIED
    res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};
