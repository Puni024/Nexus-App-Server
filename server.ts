import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { sequelize } from "./config/db";
import { initDB } from "./config/initDB";

import "./models";

import userRoutes from "./routes/userRoutes";

const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.use(express.json());



app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;

(async () => {
  try {

    await initDB();
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully");

    await sequelize.sync();
    console.log("✅ Database synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server Connection failed");
    console.error(error);
  }
})();