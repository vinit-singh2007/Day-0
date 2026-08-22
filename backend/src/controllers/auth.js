import User from '../models/user.js';
import bcrypt from "bcryptjs";
import { setUser } from "../services/auth.js";
import UserProfile from '../models/userProfile.js';

// Cookie Options Utility (Consistent settings across all handlers)
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

async function handleSignup(req, res) {
  try {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      user_name,
      email,
      password: hashedPassword,
    });

    await UserProfile.create({ 
      userId: newUser._id,
      domainsAttempted: [] 
    });

    const token = setUser(newUser);

    // Cookie set using shared config
    res.cookie("uid", token, COOKIE_OPTIONS);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        user_name: newUser.user_name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error during signup" });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "No password set. Try logging in with OAuth."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = setUser(user);

    // Cookie set using shared config
    res.cookie("uid", token, COOKIE_OPTIONS);

    // Removed token from JSON response to keep client storage clean
    return res.status(200).json({
      message: "Login successful",
      user: { 
        id: user._id, 
        user_name: user.user_name, 
        email: user.email 
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
}

function handleSignout(req, res) {
  try {
    // Exact matching options used for clearing cookie
    res.clearCookie("uid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
}

export { handleLogin, handleSignup, handleSignout };