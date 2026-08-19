import "../config/firebaseAdmin.js";
import { getAuth } from "firebase-admin/auth";
import User from "../models/user.js";
import { setUser } from "../services/auth.js";

const handleFirebaseAuth = async (req, res) => {
  try {
    let token = req.body?.token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      token = parts.length === 2 ? parts[1] : req.headers.authorization;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Firebase token provided.",
      });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const provider = decodedToken.firebase?.sign_in_provider;

    // 1. EXTENDED EMAIL EXTRACTION FALLBACK
    let email =
      decodedToken.email ||
      decodedToken.firebase?.identities?.email?.[0] ||
      null;

    let userName =
      decodedToken.name ||
      (email ? email.split("@")[0] : null) ||
      `user_${uid.slice(0, 6)}`;

    // ---------------------------------------------------------------
    // GITHUB SPECIFIC EMAIL FETCHING
    // ---------------------------------------------------------------
    if (provider === "github.com") {
      const githubAccessToken = req.body?.githubAccessToken;

      if (!githubAccessToken) {
        return res.status(400).json({
          success: false,
          message: "GitHub access token is missing.",
        });
      }

      const githubResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubAccessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (!githubResponse.ok) {
        return res.status(400).json({
          success: false,
          message: "Unable to fetch GitHub email.",
        });
      }

      const githubEmails = await githubResponse.json();

      const primaryEmail = githubEmails.find(
        (item) => item.primary === true && item.verified === true
      );
      const verifiedEmail = githubEmails.find((item) => item.verified === true);

      const selectedEmail = primaryEmail?.email || verifiedEmail?.email || null;

      if (!selectedEmail) {
        return res.status(400).json({
          success: false,
          message: "No verified email was found on your GitHub account.",
        });
      }

      email = selectedEmail.toLowerCase();

      if (!decodedToken.name) {
        const githubUserResponse = await fetch("https://api.github.com/user", {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${githubAccessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });

        if (githubUserResponse.ok) {
          const githubUser = await githubUserResponse.json();
          userName = githubUser.name || githubUser.login || userName;
        }
      }
    }

    // ---------------------------------------------------------------
    // 2. BACKUP FETCH FROM FIREBASE ADMIN IF EMAIL STILL NULL
    // ---------------------------------------------------------------
    if (!email) {
      try {
        const userRecord = await getAuth().getUser(uid);
        email = userRecord.email || userRecord.providerData?.[0]?.email || null;
        if (!userName && userRecord.displayName) {
          userName = userRecord.displayName;
        }
      } catch (adminError) {
        console.error("Firebase Admin getUser Error:", adminError);
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "No email address is available for this account.",
      });
    }

    email = email.toLowerCase().trim();

    // ---------------------------------------------------------------
    // DATABASE USER VERIFICATION & CREATION
    // ---------------------------------------------------------------
    let user = await User.findOne({ firebaseId: uid });

    if (!user) {
      const existingUser = await User.findOne({ email: email });

      if (existingUser) {
        if (existingUser.firebaseId && existingUser.firebaseId !== uid) {
          return res.status(409).json({
            success: false,
            message:
              "An account with this email already exists using another sign-in method.",
          });
        }

        existingUser.firebaseId = uid;
        if (userName && !userName.startsWith("user_")) {
          existingUser.user_name = userName;
        }

        user = await existingUser.save();
      } else {
        // Safe creation handling unique username collisions
        let finalUserName = userName;
        const usernameExists = await User.findOne({ user_name: userName });
        if (usernameExists) {
          finalUserName = `${userName}_${Math.floor(1000 + Math.random() * 9000)}`;
        }

        user = await User.create({
          user_name: finalUserName,
          email: email,
          firebaseId: uid,
        });
      }
    } else {
      if (userName && !userName.startsWith("user_")) {
        user.user_name = userName;
      }
      if (email && user.email !== email) {
        user.email = email;
      }
      await user.save();
    }

    // ---------------------------------------------------------------
    // JWT & COOKIE RESPONSE
    // ---------------------------------------------------------------
    const jwtToken = setUser(user);

    res.cookie("uid", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.user_name,
        user_name: user.user_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Firebase Authentication Error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
      error: error.message,
    });
  }
};

export default handleFirebaseAuth;