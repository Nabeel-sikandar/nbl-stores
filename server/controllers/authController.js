// Auth Controller — Signup, Signin, Admin Signin logic
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

// ==================== USER SIGNUP ====================
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check: saare fields filled hain?
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check: passwords match?
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // Check: password minimum 6 characters?
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    // Check: email already exists?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Password hash karo — bcrypt se (teacher ke approach jaisa)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Naya user banao MongoDB mein
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save(); // Database mein save

    // JWT token generate karo
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // 7 din valid
    );

    // Response bhejo
    res.status(201).json({
      msg: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== USER SIGNIN ====================
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check: saare fields filled?
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check: user exists?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check: password match? (bcrypt compare — teacher ke approach jaisa)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // JWT token generate karo
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Response
    res.status(200).json({
      msg: "Signed in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== ADMIN SIGNIN ====================
export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check: fields filled?
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Hardcoded admin credentials (teacher ke approach jaisa)
    const ADMIN_EMAIL = "admin@nblstores.com";
    const ADMIN_PASSWORD = "adminnabeel";

    // Check: email match?
    if (email !== ADMIN_EMAIL) {
      return res.status(400).json({ msg: "Invalid admin credentials" });
    }

    // Check: password match?
    if (password !== ADMIN_PASSWORD) {
      return res.status(400).json({ msg: "Invalid admin credentials" });
    }

    // JWT token generate — role "admin"
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Admin token 1 hour valid
    );

    res.status(200).json({
      msg: "Admin signed in successfully",
      token,
      user: {
        email: ADMIN_EMAIL,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin Signin Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ==================== GET USER PROFILE ====================
export const getProfile = async (req, res) => {
  try {
    // req.user middleware se aata hai (token verify ke baad)
    const user = await User.findById(req.user.id).select("-password"); // password nahi bhejenge
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Profile Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
// ==================== GOOGLE LOGIN ====================
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ msg: "Google credential is required" });
    }

    // Google token verify karo
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check: user already exists?
    let user = await User.findOne({ email });

    if (!user) {
      // Naya user banao — random password (Google user ko password nahi chahiye)
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();
    }

    // JWT token generate karo
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      msg: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error.message);
    res.status(500).json({ msg: "Google login failed" });
  }
};