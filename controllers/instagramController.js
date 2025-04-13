import axios from "axios";
import dotenv from "dotenv";
import qs from "qs";
import User_token from "../model/user_token.js";

dotenv.config();

const { INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET } = process.env;

const REDIRECT_URI =
  "https://5578-103-116-239-162.ngrok-free.app/auth/instagram/callback";
const FRONTEND_URL = "http://localhost:5173";

export const loginWithInstagram = (req, res) => {
  const authUrl = `https://www.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish`;
  // console.log(authUrl);

  res.redirect(authUrl);
};

export const instagramCallback = async (req, res) => {
  try {
    const { code } = req.query;
    let jso = {
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
      code,
    };
    const tokenRes = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      qs.stringify(jso),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenRes.data.access_token;
    const userId = tokenRes.data.user_id;
    await User_token.findOneAndUpdate(
      { userId }, // Assuming you want to update if exists
      { accessToken, userId },
      { upsert: true, new: true }
    );

    res.redirect(`${FRONTEND_URL}/dashboard?userId=${userId}`);
  } catch (err) {
    res.status(500).send("Error exchanging code for token");
  }
};

export const getProfile = async (req, res) => {
  try {
    const profileRes = await axios.get("https://graph.instagram.com/me", {
      params: {
        fields:
          "id,followers_count,follows_count,profile_picture_url,username,account_type,media_count",
        access_token: req.accessToken,
      },
    });
    res.json(profileRes.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const getMedia = async (req, res) => {
  try {
    const mediaRes = await axios.get(
      "https://graph.instagram.com/v22.0/me/media",
      {
        params: {
          fields:
            "id,caption,media_url,media_type,permalink,thumbnail_url,timestamp",
          access_token: req.accessToken,
        },
      }
    );
    res.json(mediaRes.data.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch media" });
  }
};


// export const getMediaComments = async (req, res) => {
//   const { IG_MEDIA_ID } = req.params;
//   try {
//     const mediaRes = await axios.get(
//       `https://graph.instagram.com/v22.0/${IG_MEDIA_ID}/comments?access_token=${accessToken}`
//     );
//     res.json(mediaRes.data.data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch media" });
//   }
// };

// export const commentOnMedia = async (req, res) => {
//   const { mediaId } = req.params;
//   const { message } = req.body;
//   console.log(accessToken);

//   try {
//     const commentRes = await axios.post(
//       `https://graph.instagram.com/${mediaId}/comments`,
//       null,
//       {
//         params: {
//           message,
//           access_token: accessToken,
//         },
//       }
//     );

//     res.json({ success: true, commentId: commentRes.data.id });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to comment" });
//   }
// };
