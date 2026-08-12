
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const LoginPage = ({ setIsAuthenticated }: LoginProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ user_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
  const checkAuth = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${baseURL}/api/dash`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        setIsAuthenticated(true);
        navigate("/dashboard", { replace: true });
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  checkAuth();
}, [navigate, setIsAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const API_URL = import.meta.env.VITE_API_URL ;
    const endpoint = isSignUp ? "/api/signup" : "/api/login";
    const payload = isSignUp 
      ? formData 
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      
     if (response.ok) {
  // 1. Name Nikalo (Backend response se, ya form data se, ya Email se formatted name)
  let displayName = "";

  if (data.user && data.user.user_name) {
    displayName = data.user.user_name;
  } else if (formData.user_name) {
    displayName = formData.user_name;
  } else if (formData.email) {
    // Agar name nahi mila, toh "riya@gmail.com" me se sirf "riya" nikalo
    displayName = formData.email.split("@")[0];
  } else {
    displayName = "User";
  }
  // 2. LocalStorage me sirf 'name' store karo (Gmail kabhi nahi dikhega)
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", JSON.stringify({ name: displayName }));

  setIsAuthenticated(true);
  navigate("/dashboard",{
    replace:true
  });



        
        if (isSignUp) {
          alert(`Registration Success for: ${formData.user_name}`);
        } else {
          alert(`Login Success for: ${formData.email}`);
        }
      } else {
        setError(data.message || "Authentication failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check if backend server is running.");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-background selection:bg-primary/20">
      
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none grid-bg opacity-65" aria-hidden />
      
      {/* Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Glassmorphism Auth Card */}
      <div className="relative w-full max-w-md p-8 rounded-2xl border border-border bg-card/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.18)] transition-all duration-300 hover:border-primary/45 z-10">
        
        {/* Header */}
        <div className="text-center mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.2em] px-3 py-1 bg-primary/15 text-primary border border-primary/35 rounded-sm font-semibold">
            Secure Portal
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {isSignUp ? "Experience the work before the job." : "Please enter your credentials to log in."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Input (Sign Up Only) */}
          {isSignUp && (
            <div className="space-y-2">
              <label className="block font-mono text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-md border border-border/90 bg-background/50 text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/60"
                placeholder="John Doe"
              />
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-2">
            <label className="block font-mono text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md border border-border/90 bg-background/50 text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/60"
              placeholder="name@company.com"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block font-mono text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Password
              </label>
              {!isSignUp && (
                <a href="#" className="font-mono text-xs uppercase tracking-wider font-semibold text-primary hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md border border-border/90 bg-background/50 text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/60"
              placeholder="••••••••"
            />
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-2.5 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}
              
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-primary text-primary-foreground text-base font-bold rounded-md shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:translate-y-1px transition-all duration-250 cursor-pointer"
          >
            {isSignUp ? "Get Started" : "Access Account"}
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-4 items-center">
          <div className="grow border-t border-border/80"></div>
          <span className="flex-shrink mx-4 text-muted-foreground font-mono text-xs uppercase tracking-widest font-medium">
            or continue with
          </span>
          <div className="flex-grow border-t border-border/80"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 h-11 border border-border/80 hover:border-primary/50 hover:bg-muted/50 rounded-md transition-all duration-200 font-mono text-xs font-bold text-muted-foreground uppercase cursor-pointer"
          >
            <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.745-.08-1.31-.176-1.874l-10.617-.34z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 h-11 border border-border/80 hover:border-primary/50 hover:bg-muted/50 rounded-md transition-all duration-200 font-mono text-xs font-bold text-muted-foreground uppercase cursor-pointer"
          >
            <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>GitHub</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 h-11 border border-border/80 hover:border-primary/50 hover:bg-muted/50 rounded-md transition-all duration-200 font-mono text-xs font-bold text-muted-foreground uppercase cursor-pointer"
          >
            <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <span>LinkedIn</span>
          </button>
        </div>

        {/* Footer Switcher */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "New to Day 0?"}{" "}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setFormData({ user_name: "", email: "", password: "" }); }}
            className="font-bold text-primary hover:underline cursor-pointer bg-transparent border-none ml-1"
          >
            {isSignUp ? "Sign In" : "Create one now"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;