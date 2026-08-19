import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------
// 1. FIREBASE CONFIGURATION & INITIALIZATION
// ----------------------------------------------------------------------

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey) {
  console.error("Firebase Configuration Error: VITE_FIREBASE_API_KEY is missing.");
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize OAuth Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Scopes to ensure email & profile are always returned
googleProvider.addScope("email");
googleProvider.addScope("profile");
githubProvider.addScope("user:email");

// Default App Persistence Setup
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence configuration error:", error);
});

// ----------------------------------------------------------------------
// 2. TYPES & INTERFACES
// ----------------------------------------------------------------------

interface LoginProps {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
}

export type SocialProviderName = "Google" | "GitHub";

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK FOR FIREBASE AUTHENTICATION
// ----------------------------------------------------------------------

export const useFirebaseAuth = ({
  setIsAuthenticated,
  setError,
}: LoginProps) => {
  const navigate = useNavigate();
  const authInProgress = useRef<boolean>(false);
  const [loadingProvider, setLoadingProvider] = useState<SocialProviderName | null>(null);

  const handleSocialAuth = async (
    provider: GoogleAuthProvider | GithubAuthProvider,
    providerName: SocialProviderName
  ) => {
    if (authInProgress.current) return;

    authInProgress.current = true;
    setLoadingProvider(providerName);

    try {
      setError("");

      // DIRECT POPUP TRIGGER (No await before this line to avoid auth/popup-blocked)
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken(true);

      let githubAccessToken: string | null = null;

      if (providerName === "GitHub") {
        const credential = GithubAuthProvider.credentialFromResult(result);
        githubAccessToken = credential?.accessToken || null;

        if (!githubAccessToken) {
          throw new Error("GitHub access token could not be obtained.");
        }
      }

      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${baseURL}/api/firebase-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          token: idToken,
          githubAccessToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || `${providerName} authentication failed.`);
        return;
      }

      if (data.success) {
        const userData = {
          name:
            data.user?.user_name ||
            data.user?.name ||
            result.user.displayName ||
            result.user.email?.split("@")[0] ||
            "User",
          email: data.user?.email || result.user.email || "",
        };

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(userData));

        setIsAuthenticated(true);
        navigate("/dashboard", { replace: true });
      }
    } catch (error: any) {
      console.error(`${providerName} Sign-In Error:`, error);

      switch (error.code) {
        case "auth/account-exists-with-different-credential":
          setError("An account already exists with the same email using a different sign-in method.");
          break;
        case "auth/popup-closed-by-user":
          setError("Sign-in process was cancelled.");
          break;
        case "auth/cancelled-popup-request":
          setError("Sign-in request is already in progress.");
          break;
        case "auth/popup-blocked":
          setError("Popup was blocked by your browser. Please allow popups for localhost:5173 from the address bar.");
          break;
        case "auth/unauthorized-domain":
          setError("This domain is not authorized in Firebase Authentication config.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection and try again.");
          break;
        default:
          setError(error.message || `${providerName} sign-in failed.`);
      }
    } finally {
      authInProgress.current = false;
      setLoadingProvider(null);
    }
  };

  return {
    handleGoogleSignIn: () => handleSocialAuth(googleProvider, "Google"),
    handleGithubLogin: () => handleSocialAuth(githubProvider, "GitHub"),
    loadingProvider,
  };
};

export default useFirebaseAuth;