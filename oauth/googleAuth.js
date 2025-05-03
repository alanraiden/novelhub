const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const secret_key = process.env.jwt_secret;

const googleAuthController = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ success: false, msg: "No token provided" });
    }

    try {
      // Get user info directly from Google using the access token
      const googleUserInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { email, sub: googleId, name, picture } = googleUserInfo.data;

      if (!email) {
        return res.status(400).json({ success: false, msg: "Email not provided by Google" });
      }

      // Check if user exists in the database
      let user = await User.findOne({ email });

      if (user) {
        user.password = googleId + secret_key;
        user.userimage = picture || user.userimage;
        user.name = name || user.name;
        await user.save();
      } else {
        const password = googleId + secret_key; // Generate a secure password
        user = new User({
          name,
          email,
          password,
          role: 'user',
          userimage: picture,
        });
        await user.save();
      }

      // Generate JWT token
      const authToken = jwt.sign(
        { userId: user._id },
        secret_key,
        { expiresIn: '1d' }
      );

      // Set secure cookie
      res.cookie("token", authToken);

      // Prepare user response
      const userResponse = user.toObject();
      delete userResponse.password;

      return res.status(200).json({
        success: true,
        msg: "Google authentication successful",
        token: authToken,
        userId: user._id,
        user: userResponse,
      });

    } catch (googleError) {
      console.error('Google API Error:', googleError.response?.data || googleError.message);
      return res.status(401).json({ 
        success: false, 
        msg: "Failed to verify Google token",
        error: process.env.NODE_ENV !== 'production' ? googleError.message : undefined
      });
    }

  } catch (error) {
    console.error('Auth controller error:', error);

    // Send detailed error in development mode
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({
        success: false,
        msg: "Authentication failed",
        error: error.message,
        stack: error.stack,
      });
    }

    // Generic error response in production
    return res.status(500).json({
      success: false,
      msg: "Authentication failed",
    });
  }
};

module.exports = { googleAuthController };
