import express from "express";
import { handleLogin, handleSignout, handleSignup } from "../controllers/auth.js";
import verifyToken from "../middlewares/auth.js";
import { getDashboard } from "../controllers/dash.js";
const router =express.Router();

router.post("/login",handleLogin)
router.post("/signup",handleSignup)
router.get("/dash",verifyToken,getDashboard)
router.post("/logout",handleSignout)

export default router;