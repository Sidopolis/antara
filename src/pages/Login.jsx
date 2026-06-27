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
      <div className="w-full relative max-w-[1200px] shadow-2xl rounded-[2rem] border border-zinc-800/80 bg-zinc-900 overflow-hidden min-h-[700px] flex flex-col md:flex-row">
        
        {/* LEFT SIDE: Video Panel (hidden on mobile) */}
        <div className="hidden md:flex w-full md:w-1/2 relative flex-col justify-end p-8 md:p-12 overflow-hidden border-r border-zinc-800/50">
          <div className="absolute inset-0 z-0">
             <AnimatePresence mode="popLayout">
               <motion.video
                 key={currentMediaIndex}
                 src={VIDEOS[currentMediaIndex]}
                 autoPlay
                 muted
                 loop
                 playsInline
                 className="absolute inset-0 w-full h-full object-cover"
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
               />
             </AnimatePresence>
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          </div>

          <div className="relative z-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-white tracking-tight mb-4 drop-shadow-xl">
              {isLogin ? "Welcome back to Antara Studio." : "Your AI companion for student success."}
            </h1>
            <p className="text-zinc-200 text-lg drop-shadow-md">
              "{QUOTES[currentMediaIndex]}"
            </p>
            
            <div className="flex gap-2 items-center mt-8" aria-label="Carousel Progress">
              {VIDEOS.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                    index === currentMediaIndex 
                      ? "w-8 bg-white opacity-100" 
                      : "w-4 bg-white opacity-40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
 
        {/* RIGHT SIDE: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col bg-zinc-950 z-20 text-zinc-100 relative justify-center">
          {/* Subtle glow behind the form for flair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-sm mx-auto">
            <div className="flex flex-col items-start mb-8">
              <div className="text-orange-500 mb-6 bg-orange-500/10 p-3 rounded-2xl border border-orange-500/20 shadow-inner">
                <Sunburst className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-semibold mb-2 tracking-tight">
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
              className="flex flex-col gap-5"
              onSubmit={handleSubmit}
              noValidate
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-zinc-300">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="hi@antarastudio.in"
                  className={`text-sm w-full py-3 px-4 border rounded-xl focus:outline-none focus:ring-1 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:ring-orange-500 transition-all shadow-sm ${
                    emailError ? "border-red-500 focus:ring-red-500" : "border-zinc-800 hover:border-zinc-700"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {emailError}
                  </p>
                )}
              </div>
   
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
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
                    className={`text-sm w-full py-3 px-4 border rounded-xl focus:outline-none focus:ring-1 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:ring-orange-500 transition-all shadow-sm pr-11 ${
                      passwordError ? "border-red-500 focus:ring-red-500" : "border-zinc-800 hover:border-zinc-700"
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">
                    {passwordError}
                  </p>
                )}
              </div>
   
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all mt-2 disabled:opacity-50 shadow-md shadow-orange-500/20 active:scale-[0.98]"
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
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
    </div>
  );
}
