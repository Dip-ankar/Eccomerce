// import Cart from "../models/cartModel.js";
// import Product from "../models/productModel.js";

// // ========================================
// // ADD TO CART
// // ========================================
// export const addToCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { productId, quantity } = req.body;

//     const product = await Product.findById(productId);
//     if (!product)
//       return res.status(404).json({ message: "Product not found" });

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = await Cart.create({
//         user: userId,
//         items: [{ product: productId, quantity }],
//       });
//     } else {
//       const itemIndex = cart.items.findIndex(
//         (item) => item.product.toString() === productId
//       );

//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         cart.items.push({ product: productId, quantity });
//       }
//     }

//     await cart.save();
//     res.json({ message: "Added to cart", cart });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // ========================================
// // GET USER CART
// // ========================================
// export const getCartItems = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.id }).populate(
//       "items.product"
//     );

//     if (!cart) return res.json({ items: [] });

//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // ========================================
// // UPDATE CART QUANTITY
// // ========================================
// export const updateCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === productId
//     );

//     if (itemIndex === -1)
//       return res.status(404).json({ message: "Item not found in cart" });

//     cart.items[itemIndex].quantity = quantity;

//     await cart.save();
//     res.json({ message: "Cart updated", cart });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// // ========================================
// // REMOVE ITEM FROM CART
// // ========================================
// export const removeCartItem = async (req, res) => {
//   try {
//     const { productId } = req.params;

//     const cart = await Cart.findOne({ user: req.user.id });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     cart.items = cart.items.filter(
//       (item) => item.product.toString() !== productId
//     );

//     await cart.save();
//     res.json({ message: "Item removed", cart });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };
