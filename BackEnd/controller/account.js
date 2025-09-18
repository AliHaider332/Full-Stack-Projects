const USER = require('../module/dbSchema');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const path = require('path');
const {cloudinary}=require('../util/cloudinary')
const { check, validationResult } = require('express-validator');
exports.accountDetailController = async (req, res) => {
  try {
    const { id } = req.body;

    const data = await USER.findById(id);
    return res
      .status(200)
      .json({ status: 200, message: 'got request', user: data });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, error: 'Internal Server Error' });
  }
};

exports.profileUpdateController = [
  // 🔹 Name validation
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name must contain only letters and spaces'),

  // 🔹 Email validation
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  // 🔹 Phone validation
  check('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  // 🔹 Address validation
  check('address')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Address must be at least 5 characters long'),

  // 🔹 Password validation (optional for updates)
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[@$#<>^~!%*?&]/)
    .withMessage('Password must contain at least one special character'),

  // 🔹 Confirm Password validation
  check('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (req.body.password && value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  // 🔹 Controller logic
  async (req, res) => {
    try {
      // Step 1: Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errors: errors.array().map((err) => ({
            field: err.param,
            message: err.msg,
          })),
        });
      }

      const { id, name, email, phone, address, password } = req.body;

      // Step 2: Find user
      const user = await USER.findById(id);
      if (!user) {
        return res.status(404).json({ status: 404, message: 'User not found' });
      }

      // Step 3: Handle profile picture
      let picData = user.pic; // { url, pic_id }
      if (req.file) {
        try {
          // Delete old pic from Cloudinary
          if (picData && picData.pic_id) {
            await cloudinary.uploader.destroy(picData.pic_id);
          }

          // Upload new pic
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'users/profile_pics',
          });

          // Delete temp file
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting local file:', err);
          });

          // Replace pic data
          picData = { url: result.secure_url, pic_id: result.public_id };
        } catch (err) {
          console.error('Profile picture update failed:', err);
        }
      }

      // Step 4: Hash password if provided
      let hashedPassword = user.password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // Step 5: Update user
      const updatedUser = await USER.findByIdAndUpdate(
        id,
        { name, email, phone, address, pic: picData, password: hashedPassword },
        { new: true }
      );

      return res.status(200).json({
        status: 200,
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  },
];

exports.deleteAccountController = async (req, res) => {
  try {
    const { id, password } = req.body;

    // Step 1: Find user
    const user = await USER.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    // Step 2: Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: 'Incorrect password',
      });
    }

    // Step 3: Delete profile picture from Cloudinary
    if (user.pic && user.pic.pic_id) {
      try {
        await cloudinary.uploader.destroy(user.pic.pic_id);
      } catch (err) {
        console.error('Error deleting profile picture from Cloudinary:', err);
      }
    }

    // Step 4: Delete user from DB
    await USER.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      message: 'Account successfully deleted',
    });
  } catch (error) {
    console.error('Error in deleteAccountController:', error);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

