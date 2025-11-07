import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';


//create new order

// export const createNewOrder = async(req,res)=>{
//     const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice} = req.body;


//     const order = await Order.create({
//         shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,
//         shippingPrice,
//         totalPrice,
//         paidAt:Date.now(),
//         user:req.user._id
//     })

//     res.status(200).json({
//         success:true,
//         order
//     })

// }

export const createNewOrder = async (req, res) => {
  try {
    const { shippingInfo, orderItems, paymentInfo } = req.body;

    // 1️⃣ Calculate itemPrice
    const itemPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 2️⃣ Calculate tax and shipping
    const taxPrice = itemPrice * 0.18; // 18% tax
    const shippingPrice = itemPrice > 1000 ? 0 : 50;

    // 3️⃣ Calculate total
    const totalPrice = itemPrice + taxPrice + shippingPrice;

    // 4️⃣ Create order
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};



//get single orders
export const getSingleOrder = async(req,res)=>{
    const order = await Order.findById(req.params.id).populate("user","name email")

    if(!order){
        return res.status(404).json({
            success:false,
            message:"no order are found"
        })
    }

    res.status(200).json({
        success:true,
        order
    })
}

//all my orders
export const allMyOrders = async(req,res)=>{
    const orders = await Order.find({user:req.user._id});

    if(!orders){
        return res.status(404).json({
            success:false,
            message:"Order are not found"
        })
    }

    res.status(200).json({
        success:true,
        orders
    })
}

//getting all orders
export const getAllOrders = async(req,res)=>{
    const orders = await Order.find();
    let totalAmount =0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
}


//update porder status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order already delivered",
      });
    }

    if (req.body.status === "Shipped" || req.body.status === "Delivered") {
      for (const item of order.orderItems) {
        const updated = await updateQuantity(item.product, item.quantity);
        if (!updated.success) {
          return res.status(400).json({
            success: false,
            message: updated.message,
          });
        }
      }
    }

    order.orderStatus = req.body.status;
    if (order.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

async function updateQuantity(id, quantity) {
  const product = await Product.findById(id);

  if (!product) {
    return { success: false, message: "Product not found" };
  }

  if (product.stock < quantity) {
    return {
      success: false,
      message: `${product.name} is out of stock (available: ${product.stock})`,
    };
  }

  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });

  return { success: true };
}

//delete orders

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if(order.orderStatus!=='Delivered'){
        return res.status(404).json({
            success:false,
            message:"order is processing so order cann't be deleted"
        })
    }

    await order.deleteOne(); // or await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

//cancele order

export const cancelOrder = async (req, res) => {
  try {
    // find order by user id and order id
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not owned by user",
      });
    }

    // ❌ Prevent cancel after delivery
    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a delivered order",
      });
    }

    // ♻️ Restore product stock
    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findById(item.product);

        if (product) {
          product.stock += item.quantity;
          await product.save({ validateBeforeSave: false });
        }
      })
    );

    // 🚫 Mark order as cancelled
    order.orderStatus = "Cancelled";
    order.cancelledAt = Date.now();

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};