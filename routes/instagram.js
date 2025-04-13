import express from 'express';
import {
  loginWithInstagram,
  instagramCallback,
  getProfile,
  getMedia,
} from '../controllers/instagramController.js';
import { fetchUser_token } from '../middleware.js';

const router = express.Router();

router.get('/instagram', loginWithInstagram);
router.get('/instagram/callback', instagramCallback);
router.get('/profile/:userId',fetchUser_token, getProfile);
router.get('/media/:userId',fetchUser_token, getMedia);

export default router;
