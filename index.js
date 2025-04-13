import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import instagramRoutes from "./routes/instagram.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send({ Success: "Working" });
});
app.use(express.json());
app.use("/auth", instagramRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("MongoDB connected to Database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
