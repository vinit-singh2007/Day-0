import userProfile from "../models/userProfile.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // 2. Mongoose Schema ka key name aur local variable name match ho gaya ({ userId })
    let profile = await userProfile
      .findOne({ userId })
      .populate("userId", "user_name name email avatarUrl githubUsername provider location");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import UserProfile from "../models/userProfile.js";

// 1. Profile Update ya Domain Attempt Add karne ka API
export const updateDomainAttempt = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { domainName, status, scoreObtained, timeSpentInMinutes } = req.body;

    if (!domainName) {
      return res.status(400).json({ success: false, message: "Domain name is required" });
    }

    // User ki profile dhoondho
    let profile = await UserProfile.findOne({ userId });

    // Agar profile nahi bani hai toh naye tarike se create karo
    if (!profile) {
      profile = new UserProfile({
        userId,
        domainsAttempted: [],
      });
    }

    // Check karo kya ye domain pehle se array me hai?
    const existingDomainIndex = profile.domainsAttempted.findIndex(
      (item) => item.domainName.toLowerCase() === domainName.toLowerCase()
    );

    if (existingDomainIndex > -1) {
      // Agar pehle se exist karta hai, toh use UPDATE karo
      profile.domainsAttempted[existingDomainIndex].status = status || "IN_PROGRESS";
      profile.domainsAttempted[existingDomainIndex].scoreObtained = scoreObtained ?? profile.domainsAttempted[existingDomainIndex].scoreObtained;
      profile.domainsAttempted[existingDomainIndex].timeSpentInMinutes += timeSpentInMinutes || 0;
      
      if (status === "COMPLETED") {
        profile.domainsAttempted[existingDomainIndex].completedAt = new Date();
      }
    } else {
      // Agar naya domain hai, toh NAYA object PUSH karo
      profile.domainsAttempted.push({
        domainName,
        status: status || "IN_PROGRESS",
        scoreObtained: scoreObtained || 0,
        timeSpentInMinutes: timeSpentInMinutes || 0,
        completedAt: status === "COMPLETED" ? new Date() : null,
      });
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};