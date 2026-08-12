import User from '../models/user.js';
import bcrypt from "bcryptjs";
import {setUser,getUser} from "../services/auth.js";

async function handleSignup(req,res){
      const { user_name, email, password } = req.body;
      if(
        !user_name ||
        !email||
        !password
      ){
        return res.status(400).json({ message: "All fields are required" })
      }
      const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser=await User.create({
        user_name,
        email,
        password:hashedPassword,
      })
      const token=setUser(newUser);
      res.cookie("uid", token, {
        httpOnly: true, // Security ke liye
        secure: false,  // Localhost (http) par test kar rahe ho toh FALSE rakhein
        sameSite: "lax", // Local development ke liye "lax" best hai
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      
      return res.status(200).json({
        message: "Signup successful",
        user: {
          id: newUser._id,
          user_name: newUser.user_name,
          email: newUser.email,
        },})
    }

async function handleLogin(req,res) {
    const {email,password}= req.body;

      if (!email || !password) {
        return res.status(400).json({message:"All fields (email, password) are required"});
      }
      try {
        const user = await User.findOne({ email:email });

        if (!user) {
          return res.status(400).json({message:"User not found or invalid email"});
        }
        console.log("Entered Password:", password);
        console.log("Stored DB Password Hash:", user.password);
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({message:"Invalid credentials / wrong password"});
        }

        const token=setUser(user)
        console.log("User logged in:", user);
        res.cookie("uid", token, {
         httpOnly: true, 
         secure: false,  
         sameSite: "lax", 
         maxAge: 24 * 60 * 60 * 1000, // 1 day
  })

        return res.status(200)
            .json({
            message: "Login successful",
            token,
            user: { id: user._id, user_name: user.user_name, email: user.email }
  });

      } catch (error) {
        console.error(error);
        return res.status(500).json({message:"server error"});
      }
}

function handleSignout(req,res){
  try {
    
    res.clearCookie("uid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Match your cookie config
      sameSite: "strict",
      path: "/", // Match the path used when setting the cookie
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message,
    });
  }
}


export  {handleLogin,handleSignup,handleSignout};