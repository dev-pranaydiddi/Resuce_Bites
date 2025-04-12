import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectDB from './utils/db.js';
// import userModel from './models/user.model.js';
import {userRoutes,requestRoutes,donationRoutes,deliveryRoutes} from './routes/index.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));
const PORT = process.env.PORT;
app.use('/rescue_bites/user', userRoutes);
app.use('/rescue_bites/request', requestRoutes);
app.use('/rescue_bites/donation', donationRoutes);


// const sessionOptions = {
//     // store,
//     secret: process.env.SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie : {
//         expires: Date.now() * 7 * 24 * 60 * 60 *1000, // 7 days
//         maxAge: 7 * 24 * 60 * 60 *1000, // 7 days
//         httpOnly : true,
//     }
// };
// app.use(session(sessionOptions));

app.use('/', (req, res) => {
    res.send("Hello World")
});

app.use(cors());

app.listen(PORT, (req, res) => {
    connectDB();
    // res.send("Server is running on port 8080");
    console.log(`server is listening to port ${PORT}`);
});