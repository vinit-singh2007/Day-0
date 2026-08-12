import jwt from "jsonwebtoken";
import { getUser } from "../services/auth.js";

const verifyToken = async (req, res, next) => {
  const token = req.cookies.uid;

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }
  try{
    const user=getUser(token);
    req.user = user;
    next();
    
  }catch(error){
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

export default verifyToken