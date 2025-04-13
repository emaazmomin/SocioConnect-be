import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import instagramRoutes from "./routes/instagram.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
// Middleware
app.use(express.json());
app.use("/auth", instagramRoutes);

const PORT = process.env.PORT || 5000;
// Connect to MongoDB and start the server
mongoose
  .connect("mongodb+srv://mominemaz:KLJK8798kjkj@cluster0.gapl5.mongodb.net/socio_connect?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("MongoDB connected to Database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
