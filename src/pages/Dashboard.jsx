import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IconBrain, IconFocus2, IconHeartRateMonitor, IconStethoscope, IconNotebook, IconMessageCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const [moodData, setMoodData] = useState({ stress: 0, focus: 0, positivity: 0, distortions: "None" });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('antara_token');
        const response = await axios.get('http://localhost:8000/api/journal/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.length > 0) {
          const latest = response.data[0];
          setMoodData({
            stress: latest.stress_score || 0,
            focus: latest.focus_score || 0,
            positivity: latest.positivity_score || 0,
            distortions: latest.cognitive_distortions || "None"
          });
        }
      } catch (error) {
        console.error("Failed to fetch historical data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const features = [
    {
      title: "CBT Diagnosis",
      description: "Antara's real-time assessment of your cognitive state.",
      icon: <IconStethoscope className={moodData.distortions !== "None" ? "text-red-400 w-8 h-8" : "text-emerald-400 w-8 h-8"} />,
      className: "col-span-1 lg:col-span-4 border-b lg:border-r border-white/10",
      content: (
        <div className="flex-1 flex flex-col justify-center items-center text-center mt-6">
          {isLoading ? (
            <div className="animate-pulse w-20 h-20 bg-white/10 rounded-full"></div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest">Detected Distortions</p>
              <p className={cn(
                "text-3xl font-bold",
                moodData.distortions !== "None" ? "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" : "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              )}>
                {moodData.distortions}
              </p>
            </>
          )}
        </div>
      )
    },
    {
      title: "Cognitive Load",
      description: "Your current mental bandwidth and stress indices.",
      icon: <IconHeartRateMonitor className="text-purple-400 w-8 h-8" />,
      className: "border-b col-span-1 lg:col-span-2 border-white/10",
      content: (
        <div className="mt-6 space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 uppercase tracking-wider">Stress Index</span>
              <span className="text-white font-bold">{moodData.stress}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${moodData.stress}%` }}
                transition={{ duration: 1, type: "spring" }}
                className={cn(
                  "h-full rounded-full",
                  moodData.stress > 70 ? "bg-red-500" : "bg-blue-500"
                )}
              ></motion.div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 uppercase tracking-wider">Focus Capacity</span>
              <span className="text-white font-bold">{moodData.focus}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${moodData.focus}%` }}
                transition={{ duration: 1, type: "spring" }}
                className="h-full rounded-full bg-purple-500"
              ></motion.div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI Journal",
      description: "Log your thoughts to receive personalized restructuring.",
      icon: <IconNotebook className="text-blue-400 w-8 h-8" />,
      className: "col-span-1 lg:col-span-3 lg:border-r border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer",
      onClick: () => navigate('/journal'),
      content: (
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 rounded-full bg-blue-500/20 text-blue-400 font-medium hover:bg-blue-500/30 transition-all border border-blue-500/30 flex items-center gap-2">
            Open Journal <IconBrain className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      title: "Therapeutic Chat",
      description: "Talk to Antara in real-time to break down anxieties.",
      icon: <IconMessageCircle className="text-orange-400 w-8 h-8" />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none border-white/10 hover:bg-white/[0.02] transition-colors cursor-pointer",
      content: (
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-3 rounded-full bg-orange-500/20 text-orange-400 font-medium hover:bg-orange-500/30 transition-all border border-orange-500/30 flex items-center gap-2">
            Start Chat <IconMessageCircle className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="relative z-20 mx-auto max-w-7xl py-10 lg:py-20">
      <div className="px-8 text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
        >
          Your Cognitive <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Command Center</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-2xl text-center text-lg font-light text-gray-400"
        >
          Powered by LanceDB RAG and Amazon Titan Embeddings. We analyze your journal logs and structure your thoughts for peak performance.
        </motion.p>
      </div>

      <div className="relative px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 rounded-3xl lg:grid-cols-6 border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
        >
          {features.map((feature, idx) => (
            <div 
              key={feature.title} 
              onClick={feature.onClick}
              className={cn("relative p-8", feature.className)}
            >
              <div className="mb-4">{feature.icon}</div>
              <p className="max-w-5xl text-left text-2xl tracking-tight text-white mb-2 font-medium">
                {feature.title}
              </p>
              <p className="max-w-sm text-left text-sm font-normal text-gray-400">
                {feature.description}
              </p>
              <div className="h-full w-full">{feature.content}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
