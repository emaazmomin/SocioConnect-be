import User_token from "./model/user_token.js";

export const fetchUser_token = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const tokenEntry = await User_token.findOne({ userId });

    if (!tokenEntry || !tokenEntry.accessToken) {
      return res
        .status(404)
        .json({ error: "Access token not found for the user" });
    }

    // Attach the access token to the request
    req.accessToken = tokenEntry.accessToken;

    next();
  } catch (err) {
    console.error("Error fetching Instagram token middleware:");
    res
      .status(500)
      .json({ error: "Internal server error while fetching access token" });
  }
};
