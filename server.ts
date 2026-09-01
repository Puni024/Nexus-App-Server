import dotenv from "dotenv";
dotenv.config();
import multer from "multer";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { sequelize } from "./config/db";
import { initDB } from "./config/initDB";
// import { seedDatabase } from "./models/seed";

import "./models";

import authRoutes from "./routes/authRoutes";
import allRoutes from "./routes/admin/allRoutes";
import notificationRoutes from "./routes/notificationRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/admin", allRoutes);

app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // await initDB();

    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully");

    await sequelize.sync();
    console.log("✅ Database synchronized successfully");
    
    // await seedDatabase();
    console.log("✅ Tables synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();