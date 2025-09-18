// controller/auth.js
const USER = require('../module/dbSchema');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { uploadToCloudinary } = require('../util/cloudinary');

// =============================
// User Sign In (Registration)
// =============================
exports.userSignInController = [
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

  // 🔹 Password validation
  check('password')
    .notEmpty()
    .withMessage('Password is required')
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
    .notEmpty()
    .withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
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

      const { name, email, phone, address, password } = req.body;
      const file = req.file; // multer single upload

      // Step 2: Check uniqueness
      const existingEmail = await USER.findOne({ email });
      if (existingEmail) {
        return res
          .status(409)
          .json({ status: 409, message: 'Email already exists' });
      }

      const existingPhone = await USER.findOne({ phone });
      if (existingPhone) {
        return res
          .status(409)
          .json({ status: 409, message: 'Phone number already exists' });
      }

      // Step 3: Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 4: Handle profile picture
      let picData = null;
      if (file) {
        try {
          const result = await uploadToCloudinary(
            file.buffer,
            'users/profile_pics'
          );
          picData = { url: result.secure_url, pic_id: result.public_id };
        } catch (err) {
          console.error('Profile picture upload failed:', err);
        }
      }

      // Step 5: Create user
      const user = new USER({
        name,
        email,
        phone,
        address,
        pic: picData,
        password: hashedPassword,
      });

      await user.save();

      return res
        .status(201)
        .json({ status: 201, message: 'User registered successfully', user });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 500, message: 'Internal Server Error' });
    }
  },
];

exports.userLogInController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const LoginUser = await USER.findOne({ email: email });
    if (!LoginUser) {
      return res
        .status(404)
        .json({ status: 404, message: 'Email not registered' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, LoginUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: 401, message: "Password don't match" });
    }

    // 3. Successful login
    req.session.user = {
      id: LoginUser._id,
      email: LoginUser.email,
      name: LoginUser.name,
      pic: LoginUser.pic.url,
    };

    return res.status(200).json({
      status: 200,
      message: 'Successfully Logged In',
      user: {
        id: LoginUser._id,
        email: LoginUser.email,
        name: LoginUser.name,
        pic: LoginUser.pic?.url || null,
      },
      loggedIn: true,
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal Server Error' });
  }
};

exports.loginStatusController = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({
      loggedIn: true,
      user: req.session.user,
    });
  } else {
    return res.status(200).json({
      loggedIn: false,
      user: null,
    });
  }
};

exports.logOutController = (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ status: 500, message: 'Logout failed' });
      }

      res.clearCookie('connect.sid'); // important: clears session cookie
      return res
        .status(200)
        .json({ status: 200, message: 'Logged Out Successfully' });
    });
  } else {
    return res.status(201).json({ status: 201, message: 'Already Logged Out' });
  }
};
