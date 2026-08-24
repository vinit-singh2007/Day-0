import express from "express";
import { handleLogin, handleSignout, handleSignup } from "../controllers/auth.js";
import verifyToken from "../middlewares/auth.js";
import { getDashboard } from "../controllers/dash.js";
import handleFirebaseAuth from "../controllers/firebaseauth.js";
import { getUserProfile, updateDomainAttempt } from "../controllers/userProfiles.js";
import { handleAssesment } from "../controllers/assesment.js";
import { getFullAIReview } from "../controllers/fullreview.js";
import { getUserProgress } from "../controllers/userProgress.js";

const router = express.Router();

// Auth Routes
router.post("/login", handleLogin);
router.post("/signup", handleSignup);
router.post("/logout", handleSignout);
router.post("/firebase-auth", handleFirebaseAuth);

// Dashboard Route
router.get("/dash", verifyToken, getDashboard);

// User Profile & Progress Routes
router.get("/profile", verifyToken, getUserProfile); 
router.get('/user-progress/:domain', verifyToken, getUserProgress);
router.post("/update-domain", verifyToken, updateDomainAttempt); 

// Assessment & Review Routes
router.post("/evaluate-assessment", verifyToken, handleAssesment);
router.post("/full-ai-review", verifyToken, getFullAIReview); // 🔐 Secured with verifyToken

export default router;