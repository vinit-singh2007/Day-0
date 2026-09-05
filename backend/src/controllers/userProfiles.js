import userProfile from "../models/userProfile.js";

// 1. Get User Profile with Auto-Create & Populate
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    // Profile search karein aur User model se fields populate karein
    let profile = await userProfile
      .findOne({ userId })
      .populate("userId", "user_name name email avatarUrl githubUsername provider location");

    // Agar pehli baar user aaya hai aur profile nahi hai, toh auto-create karein
    if (!profile) {
      profile = await userProfile.create({
        userId,
        domainsAttempted: [],
      });

      // Populate user info on the newly created profile
      profile = await userProfile
        .findById(profile._id)
        .populate("userId", "user_name name email avatarUrl githubUsername provider location");
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update Domain Attempt with Populated Response
export const updateDomainAttempt = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { domainName, status, scoreObtained, timeSpentInMinutes } = req.body;

    if (!domainName) {
      return res.status(400).json({ success: false, message: "Domain name is required" });
    }

    // User ki profile find karein
    let profile = await userProfile.findOne({ userId });

    // Agar profile exist nahi karti toh new create karein
    if (!profile) {
      profile = new userProfile({
        userId,
        domainsAttempted: [],
      });
    }

    // Existing domain check karein
    const existingDomainIndex = profile.domainsAttempted.findIndex(
      (item) => item.domainName.toLowerCase() === domainName.toLowerCase()
    );

    if (existingDomainIndex > -1) {
      // Existing domain update karein
      profile.domainsAttempted[existingDomainIndex].status = status || "IN_PROGRESS";
      profile.domainsAttempted[existingDomainIndex].scoreObtained =
        scoreObtained ?? profile.domainsAttempted[existingDomainIndex].scoreObtained;
      profile.domainsAttempted[existingDomainIndex].timeSpentInMinutes +=
        timeSpentInMinutes || 0;

      if (status === "COMPLETED") {
        profile.domainsAttempted[existingDomainIndex].completedAt = new Date();
      }
    } else {
      // Naya domain array me push karein
      profile.domainsAttempted.push({
        domainName,
        status: status || "IN_PROGRESS",
        scoreObtained: scoreObtained || 0,
        timeSpentInMinutes: timeSpentInMinutes || 0,
        completedAt: status === "COMPLETED" ? new Date() : null,
      });
    }

    await profile.save();

    // Updated response ko populate karke return karein taaki frontend UI real-time sync ho sake
    const updatedProfile = await userProfile
      .findById(profile._id)
      .populate("userId", "user_name name email avatarUrl githubUsername provider location");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};