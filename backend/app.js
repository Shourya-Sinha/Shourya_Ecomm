import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import UserRoutes from './Routes/UserRoute.js';
import ProductRoutes from './Routes/ProductRoute.js';
import BlogRoutes from './Routes/BlogRoute.js';
import CategoryRoutes from './Routes/CategoryRoute.js';
import BlogCatRoutes from './Routes/BlogCatRoute.js';
import BrandRoutes from './Routes/Brand.js';
import ColorRoutes from './Routes/ColorRoute.js';
import CouonRoutes from './Routes/CouponRoute.js';
import EnqRoutes from './Routes/EnquiryRoute.js';
import AddressRoutes from './Routes/AddressRoute.js';
import { errorHandler, notFound } from './Middlewares/ErrorHandler.js';
import path from 'path'
const __dirname = path.resolve();

dotenv.config();



const app = express();

// Middleware
//app.use(cors());
app.use(cors({
    origin: 'https://shourya-ecomm.onrender.com', // Replace with your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // This allows cookies to be sent and received
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if(process.env.NODE_ENV === 'Development'){
    app.use(morgan('dev'));
}

app.use('/auth/user',UserRoutes);
app.use('/product',ProductRoutes);
app.use('/blog',BlogRoutes);
app.use('/category',CategoryRoutes);
app.use('/blogCategory',BlogCatRoutes);
app.use('/brand',BrandRoutes);
app.use('/coupon/user',CouonRoutes);
app.use('/admin/color',ColorRoutes);
app.use('/enquiry',EnqRoutes);
app.use('/address',AddressRoutes);

// app.use(notFound);
// app.use(errorHandler);



// Serve index.html for all other routes
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

export default app;