import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative flex flex-col items-center justify-center">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Hero Section */}
      <div className="z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-white/10 mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium tracking-wide">Your AI Mental Wellness Companion</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent"
        >
          Meet Antara.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted md:text-2xl mb-12 max-w-2xl leading-relaxed"
        >
          Preparing for high-stakes exams? Don't let burnout win. 
          Antara analyzes your daily journals and provides hyper-personalized coping strategies using DeepSeek AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/dashboard" className="group relative inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
            <span className="relative z-10 flex items-center gap-2">
              Enter Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-[shimmer_1.5s_infinite]" />
          </Link>
          
          <Link to="/chat" className="inline-flex items-center justify-center gap-2 bg-secondary/50 text-white px-8 py-4 rounded-xl font-semibold border border-white/10 hover:bg-secondary transition-all">
            <Brain className="w-5 h-5" /> Chat with AI
          </Link>
        </motion.div>
      </div>
      
      {/* Footer hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-muted text-sm"
      >
        Built for PromptWars Kolkata
      </motion.div>
    </div>
  );
}
