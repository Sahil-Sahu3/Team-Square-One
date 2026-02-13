const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      res.status(400); throw new Error("name, phone and password are required");
    }
    if (await User.findOne({ phone })) {
      res.status(400); throw new Error("Phone number already registered");
    }
    const user = await User.create({ name, phone, password });
    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, phone: user.phone, token: generateToken(user._id) },
    });
  } catch (err) { next(err); }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      res.status(400); throw new Error("phone and password are required");
    }
    const user = await User.findOne({ phone }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      res.status(401); throw new Error("Invalid phone or password");
    }
    res.json({
      success: true,
      data: { _id: user._id, name: user.name, phone: user.phone, token: generateToken(user._id) },
    });
  } catch (err) { next(err); }
};

// GET /auth/me
const getMe = (req, res) => res.json({ success: true, data: req.user });

module.exports = { register, login, getMe };
