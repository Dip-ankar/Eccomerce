import express from "express";
import product from './routes/productRoutes.js';
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";
import cookieParser from "cookie-parser";



const app = express();

// Middleware 
app.use(express.json());
app.use(cookieParser());





app.use("/api",product);
app.use("/api",user);
app.use("/api",order);

app.use("/api",payment)


export default app;