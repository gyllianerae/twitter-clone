import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from 'cloudinary';

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js"

import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 3000;
const FALLBACK_PORT = 4000; // Fallback port

app.use(express.json()); //to parse req.body
app.use(express.urlencoded({ extended: true })); //to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// app.listen(PORT, () => {
//     console.log(`server is up and running on port ${PORT}`);
//     connectMongoDB();
// })

// Function to start the server
function startServer(port) {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      connectMongoDB();
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Trying fallback port ${FALLBACK_PORT}`);
        startServer(FALLBACK_PORT); // Retry on fallback port
      } else {
        console.error(`Failed to start server on port ${port}:`, err);
        process.exit(1); // Exit on other errors
      }
    });
  }
  
// Start the server on the default port
startServer(PORT);