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
    <div className="min-h-screen w-full flex bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      
      {/* LEFT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 md:p-16 lg:p-24 relative z-10 overflow-y-auto">
        
        {/* Header / Logo */}
        <div className="flex items-center gap-2 mb-12 lg:mb-20">
          <div className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-1.5 rounded-lg shadow-sm">
             <Sunburst className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">Antara Studio</span>
        </div>

        <div className="w-full max-w-[400px] mx-auto flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
            {isLogin ? "Welcome back! Please enter your details." : "Enter your email below to create your account"}
          </p>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg mb-6 text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
             <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm font-medium">
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
               Google
             </button>
             <button type="button" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm font-medium">
               <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.938 5.858-5.938 1.258 0 2.871.21 2.871.21v3.136h-1.616c-1.58 0-1.879.791-1.879 2.092v2.08h3.385l-.546 3.667h-2.839v7.98h-5.234z"/></svg>
               Facebook
             </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email address*
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className={`flex h-10 w-full rounded-md border bg-white dark:bg-zinc-900/50 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-zinc-300 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-400"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium leading-none">
                  Password*
                </label>
                {isLogin && (
                  <button type="button" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••••"
                  className={`flex h-10 w-full rounded-md border bg-white dark:bg-zinc-900/50 px-3 py-2 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all pr-10 ${
                    passwordError ? "border-red-500 focus:ring-red-500" : "border-zinc-300 dark:border-zinc-800 focus:ring-zinc-900 dark:focus:ring-zinc-400"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center h-10 px-4 py-2 mt-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign in to Studio" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
             {isLogin ? "New on our platform? " : "Already have an account? "}
             <button 
               type="button"
               onClick={() => { setIsLogin(!isLogin); setEmailError(""); setPasswordError(""); setSuccessMessage(""); }}
               className="font-medium text-zinc-900 dark:text-white underline hover:no-underline underline-offset-4"
             >
               {isLogin ? "Create an account" : "Sign in"}
             </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Video Carousel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden m-4 ml-0 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-zinc-900">
        
        {/* Fallback pattern if video takes time to load */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

        <AnimatePresence mode="wait">
           <motion.video 
             key={currentMediaIndex}
             src={VIDEOS[currentMediaIndex]}
             autoPlay
             muted
             loop
             playsInline
             initial={{ opacity: 0, scale: 1.05 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 1.2, ease: "easeInOut" }}
             className="absolute inset-0 w-full h-full object-cover"
           />
        </AnimatePresence>
        
        {/* Overlay gradient for text readability (ensures text is always visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
        
        {/* Quote overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white">
           <AnimatePresence mode="wait">
             <motion.div
               key={currentMediaIndex}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.8, delay: 0.2 }}
             >
                <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
                  <p className="text-2xl font-medium mb-6 leading-relaxed">
                    "{QUOTES[currentMediaIndex]}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                         <Sunburst className="h-6 w-6 text-zinc-900" />
                       </div>
                       <div>
                         <p className="text-base font-semibold text-white">Antara AI Coach</p>
                         <p className="text-sm text-zinc-300">Student Success Team</p>
                       </div>
                    </div>
                    
                    {/* Carousel Progress Indicators */}
                    <div className="flex gap-2 items-center">
                      {VIDEOS.map((_, index) => (
                        <div 
                          key={index}
                          className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                            index === currentMediaIndex 
                              ? "w-8 bg-white opacity-100" 
                              : "w-4 bg-white opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
