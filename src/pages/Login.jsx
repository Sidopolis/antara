import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { SunIcon as Sunburst, Eye, EyeOff, Loader2 } from "lucide-react";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { motion, AnimatePresence } from "framer-motion";

const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || "ap-south-1_RQE0iqB6L",
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID || "3dc82s1j1bks6lpdooohkf8f5d"
};
const userPool = new CognitoUserPool(poolData);

// ============================================================================
// 🚨 PLACE YOUR CUSTOM STOCK VIDEO URLs HERE 🚨
// Replace these Pixabay placeholder links with the direct URLs to your videos
// (e.g. from your AWS S3 bucket, Cloudflare, or local public folder).
// Make sure the links end in .mp4 for the best browser compatibility!
// ============================================================================
const VIDEOS = [
  "https://cdn.pixabay.com/video/2020/05/21/40034-424840847_tiny.mp4", 
  "https://cdn.pixabay.com/video/2021/08/04/83896-584742548_tiny.mp4", 
  "https://cdn.pixabay.com/video/2019/11/12/29241-373809630_tiny.mp4"  
];
// ============================================================================

// Simplified, non-technical quotes
const QUOTES = [
  "Stay calm, stay focused, and achieve your goals with your personal student coach.",
  "Understand your feelings, manage exam stress, and study better.",
  "Join thousands of students taking control of their academic journey."
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 8000); // Crossfade every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    setSuccessMessage("");
    setEmailError("");
    setPasswordError("");

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    }

    if (!valid) return;
    
    setIsLoading(true);

    if (isLogin) {
      const authenticationDetails = new AuthenticationDetails({ Username: email, Password: password });
      const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
              const idToken = result.getIdToken().getJwtToken();
              localStorage.setItem('antara_token', idToken);
              setIsLoading(false);
              navigate('/');
          },
          onFailure: (err) => {
              setPasswordError(err.message || "Authentication failed");
              setIsLoading(false);
          }
      });
    } else {
      const attributeList = [
          new CognitoUserAttribute({ Name: 'email', Value: email })
      ];

      userPool.signUp(email, password, attributeList, null, (err, result) => {
          setIsLoading(false);
          if (err) {
              setPasswordError(err.message || "Registration failed");
              return;
          }
          setSuccessMessage("Registration successful! Please check your email for a verification link, then log in.");
          setIsLogin(true);
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center overflow-hidden p-4 sm:p-8">
      <div className="w-full relative max-w-5xl overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl border border-zinc-800">
        <div className="w-full h-full z-10 absolute bg-linear-to-t from-black/90 to-transparent pointer-events-none"></div>
        <div className="flex absolute z-10 overflow-hidden backdrop-blur-xl pointer-events-none">
          <div className="h-[40rem] z-10 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-10 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-10 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-10 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-10 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
          <div className="h-[40rem] z-10 w-[4rem] bg-linear-90 from-[#ffffff00] via-[#000000] via-[69%] to-[#ffffff30] opacity-30 overflow-hidden"></div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="w-[15rem] h-[15rem] bg-orange-500 absolute z-0 rounded-full bottom-0 -left-10 blur-3xl opacity-20 pointer-events-none"></div>
        <div className="w-[8rem] h-[5rem] bg-white absolute z-0 rounded-full bottom-20 left-20 blur-2xl opacity-10 pointer-events-none"></div>
 
        <div className="bg-zinc-950 text-white p-8 md:p-12 md:w-1/2 relative flex flex-col justify-end overflow-hidden border-r border-zinc-800/50">
          <h1 className="text-3xl md:text-4xl font-medium leading-tight z-20 tracking-tight relative mb-4">
            {isLogin ? "Welcome back to Antara Studio." : "Design and dev partner for students and founders."}
          </h1>
          <p className="text-zinc-400 z-20 relative text-lg">
            {isLogin 
              ? "Stay calm, stay focused, and achieve your goals with your personal student coach." 
              : "Join thousands of students taking control of their academic journey."}
          </p>
        </div>
 
        <div className="p-8 md:p-12 md:w-1/2 flex flex-col bg-zinc-900 z-20 text-zinc-100">
          <div className="flex flex-col items-start mb-8">
            <div className="text-orange-500 mb-4 bg-orange-500/10 p-2.5 rounded-xl">
              <Sunburst className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-medium mb-2 tracking-tight">
              {isLogin ? "Sign in" : "Get Started"}
            </h2>
            <p className="text-left text-zinc-400">
              Welcome to Antara Studio — {isLogin ? "Please enter your details." : "Let's get started"}
            </p>
          </div>

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg mb-6 text-sm">
              {successMessage}
            </div>
          )}
 
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label htmlFor="email" className="block text-sm mb-2 text-zinc-300">
                Your email
              </label>
              <input
                type="email"
                id="email"
                placeholder="hi@antarastudio.in"
                className={`text-sm w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:ring-orange-500 transition-colors ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-zinc-800 hover:border-zinc-700"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1">
                  {emailError}
                </p>
              )}
            </div>
 
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm text-zinc-300">
                  {isLogin ? "Password" : "Create new password"}
                </label>
                {isLogin && (
                  <button type="button" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••••"
                  className={`text-sm w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-1 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:ring-orange-500 transition-colors pr-10 ${
                    passwordError ? "border-red-500 focus:ring-red-500" : "border-zinc-800 hover:border-zinc-700"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">
                  {passwordError}
                </p>
              )}
            </div>
 
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign in to Studio" : "Create a new account"}
            </button>
 
            <div className="text-center text-zinc-500 text-sm mt-4">
              {isLogin ? "New on our platform?" : "Already have an account?"}{" "}
              <button 
                type="button" 
                onClick={() => { setIsLogin(!isLogin); setEmailError(""); setPasswordError(""); setSuccessMessage(""); }}
                className="text-white font-medium underline hover:text-orange-400 transition-colors"
              >
                {isLogin ? "Create an account" : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
