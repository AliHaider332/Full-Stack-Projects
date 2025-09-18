const cloudinary = require('cloudinary').v2; // use v2 API
require('dotenv').config();
function cloudinaryConfig() {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  } catch (error) {
    console.log('cloudinary error', error);
    console.log(error);
  }
}

module.exports = { cloudinary, cloudinaryConfig };
