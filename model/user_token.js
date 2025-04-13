import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema(
  {
    accessToken: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User_token = mongoose.model("User_token", userTokenSchema);
export default User_token;
