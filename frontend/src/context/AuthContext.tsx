import React, { createContext, useContext, useEffect, useState } from "react";

// Types definition
export interface DomainAttempt {
  domainName: string;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  scoreObtained: number;
  timeSpentInMinutes: number;
  completedAt?: string;
}

export interface UserProfileData {
  _id?: string;
  name?: string;
  displayName?: string;
  user_name?: string;
  email?: string;
  githubUsername?: string;
  provider?: "github" | "email" | "google";
  avatarUrl?: string;
  location?: string;
  bio?: string;
  domainsAttempted?: DomainAttempt[];
}

interface AuthContextType {
  user: UserProfileData | null;
  loading: boolean;
  refetchProfile: () => Promise<void>;
  updateDomain: (data: DomainAttempt) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfileData | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. Profile Fetch Logic (Fixed with Firebase & MongoDB Fallbacks)
  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${baseURL}/api/profile`, {
        method: "GET",
        credentials: "include", // Cookie/Session Token pass karne ke liye
      });

      // Token Expired ya Unauthorized
      if (res.status === 401) {
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("jobsim_user");
        localStorage.removeItem("user");
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          // Check ki userId object hai (Populated) ya string hai
          const userIdObj = typeof data.profile.userId === "object" ? data.profile.userId : {};

          // Backup for login time saved details in localStorage
          const cachedUser = JSON.parse(
            localStorage.getItem("user") || localStorage.getItem("jobsim_user") || "{}"
          );

          // Name Fallback Hierarchy: name -> displayName -> user_name -> cached -> "User"
          const resolvedName =
            userIdObj.name ||
            userIdObj.displayName ||
            userIdObj.user_name ||
            data.profile.name ||
            cachedUser.name ||
            cachedUser.displayName ||
            "User";

          // Email Fallback Hierarchy
          const resolvedEmail =
            userIdObj.email ||
            data.profile.email ||
            cachedUser.email ||
            "";

          // Avatar Fallback Hierarchy
          const resolvedAvatar =
            userIdObj.avatarUrl ||
            userIdObj.photoURL ||
            data.profile.avatarUrl ||
            cachedUser.avatarUrl ||
            cachedUser.photoURL ||
            "";

          const profileData: UserProfileData = {
            ...userIdObj,
            _id: userIdObj._id || data.profile._id || data.profile.userId,
            name: resolvedName,
            displayName: resolvedName,
            email: resolvedEmail,
            user_name: userIdObj.user_name || userIdObj.displayName || resolvedName,
            bio: data.profile.bio,
            avatarUrl: resolvedAvatar,
            domainsAttempted: data.profile.domainsAttempted || [],
          };

          setUser(profileData);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("jobsim_user", JSON.stringify(profileData));
        }
      } else {
        const storedUser = localStorage.getItem("jobsim_user");
        if (storedUser) setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error fetching user profile in AuthContext:", err);
      const storedUser = localStorage.getItem("jobsim_user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } finally {
      setLoading(false);
    }
  };

  // 2. Update Domain Progress & Auto-Refetch Profile
  const updateDomain = async (domainData: DomainAttempt) => {
    try {
      const res = await fetch(`${baseURL}/api/update-domain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(domainData),
      });

      if (res.ok) {
        await fetchUserProfile();
      } else {
        console.error("Failed to update domain progress");
      }
    } catch (error) {
      console.error("Error in updateDomain:", error);
    }
  };

  // 3. Centralized Logout Helper
  const logout = async () => {
    try {
      await fetch(`${baseURL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("jobsim_user");
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refetchProfile: fetchUserProfile,
        updateDomain,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};