import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFirebaseAuth from "../components/auth/globalAuth";
import { Loader2 } from "lucide-react";

// Component Props interface
interface LoginProps {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

/**
 * LoginPage Component
 * Handles User Login, Registration, and Social Authentication (Google & GitHub)
 */
const LoginPage = ({ setIsAuthenticated }: LoginProps) => {
  // Form view state: toggle between Sign In (false) and Sign Up (true)
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // Form inputs state
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
  });

  // UI Error state
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // Custom hook for social authentication logic
  const { handleGoogleSignIn, handleGithubLogin, loadingProvider } =
    useFirebaseAuth({
      setIsAuthenticated,
      setError,
    });

  /**
   * Auto-Authentication Check Effect
   * Runs on mount to check if user already has an active session via cookie
   */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) return;

    // AbortController to handle component unmounting safely
    const controller = new AbortController();

    const checkAuthStatus = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${baseURL}/api/dash`, {
          method: "GET",
          credentials: "include", // Send HTTP-only session cookies
          signal: controller.signal,
        });

        if (response.ok) {
          setIsAuthenticated(true);
          navigate("/dashboard", { replace: true });
        } else {
          // If session expired on backend, clear local flag
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuthStatus();

    // Cleanup API call on unmount
    return () => controller.abort();
  }, [navigate, setIsAuthenticated]);

  /**
   * Native Email/Password Submission Handler (Login & Signup)
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const API_URL = import.meta.env.VITE_API_URL || "";
    const endpoint = isSignUp ? "/api/signup" : "/api/login";
    
    // Send full object on Sign Up, only email & password on Login
    const payload = isSignUp
      ? formData
      : {
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Secure cookie handling
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Fallback chain to compute display name
        const displayName =
          data.user?.user_name ||
          formData.user_name ||
          formData.email?.split("@")[0] ||
          "User";

        // Store non-sensitive user metadata locally
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "user",
          JSON.stringify({ name: displayName })
        );

        setIsAuthenticated(true);
        navigate("/dashboard", { replace: true });
      } else {
        setError(
          data.message || "Authentication failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError(
        "Network error. Unable to connect to the server."
      );
    }
  };

  /**
   * Reset form data when toggled between Sign In and Sign Up
   */
  const handleToggleAuthMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
    setFormData({
      user_name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-background px-4 selection:bg-primary/20">
      
      {/* Loading Overlay during Social Auth (Google / GitHub) */}
      {loadingProvider && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
                Connecting to {loadingProvider}...
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                Please wait while we complete verification
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Visual Background Elements */}
      <div
        className="grid-bg pointer-events-none absolute inset-0 opacity-65"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card/85 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:border-primary/45">
        
        {/* Header Section */}
        <div className="mb-6 text-center">
          <span className="rounded-sm border border-primary/35 bg-primary/15 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Secure Portal
          </span>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isSignUp
              ? "Experience the work before the job."
              : "Please enter your credentials to log in."}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Dynamic Field: Name (Only shown during Sign Up) */}
          {isSignUp && (
            <div className="space-y-2">
              <label 
                htmlFor="user_name"
                className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Your Name
              </label>
              <input
                id="user_name"
                type="text"
                required={isSignUp}
                value={formData.user_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    user_name: e.target.value,
                  })
                }
                className="w-full rounded-md border border-border/90 bg-background/50 px-4 py-2.5 text-base placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="John Doe"
              />
            </div>
          )}

          {/* Email Address Input */}
          <div className="space-y-2">
            <label 
              htmlFor="email"
              className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              className="w-full rounded-md border border-border/90 bg-background/50 px-4 py-2.5 text-base placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="name@company.com"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password"
                className="block font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </label>

              {!isSignUp && (
                <a
                  href="#forgot-password"
                  className="font-mono text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                >
                  Forgot?
                </a>
              )}
            </div>

            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full rounded-md border border-border/90 bg-background/50 px-4 py-2.5 text-base placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div 
              role="alert" 
              className="rounded-md border border-destructive/30 bg-destructive/15 p-2.5 text-xs font-semibold text-destructive"
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full cursor-pointer rounded-md bg-primary py-3 text-base font-bold text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            {isSignUp ? "Get Started" : "Access Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-4">
          <div className="grow border-t border-border/80" />
          <span className="mx-4 shrink-0 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
            or continue with
          </span>
          <div className="grow border-t border-border/80" />
        </div>

        {/* Social Authentication Buttons */}
        <div className="grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border/80 font-mono text-muted-foreground uppercase hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <svg
              className="h-5 w-5 shrink-0 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.08-1.31-.176-1.874l-10.617-.34z" />
            </svg>
            <span className="text-sm font-bold">Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border/80 font-mono text-muted-foreground uppercase hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <svg
              className="h-5 w-5 shrink-0 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              />
            </svg>
            <span className="text-sm font-bold">GitHub</span>
          </button>
        </div>

        {/* Footer Toggle (Sign In / Sign Up) */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "New to Day 0?"}{" "}
          <button
            type="button"
            onClick={handleToggleAuthMode}
            className="ml-1 border-none bg-transparent font-bold text-primary hover:underline cursor-pointer"
          >
            {isSignUp ? "Sign In" : "Create one now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;