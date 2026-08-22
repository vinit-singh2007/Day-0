import { getUser } from "../services/auth.js";

const verifyToken = async (req, res, next) => {
  // 1. Extract Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.uid) {
    // Optional fallback if cookies are used elsewhere
    token = req.cookies.uid;
  }

  // 2. Reject if no token is sent
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    // 3. Verify token using your getUser helper
    const user = getUser(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    // 4. Attach decoded payload ({ _id, id, email }) to req.user
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default verifyToken;