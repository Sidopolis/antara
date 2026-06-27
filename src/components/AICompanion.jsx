import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Textarea } from "./ui/textarea";
import { cn } from "../lib/utils";
import {
  ArrowUpIcon,
  Paperclip,
  BrainCircuit,
  MessageCircle,
  Lightbulb,
  ShieldAlert,
  Activity,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback((reset) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }

    textarea.style.height = `${minHeight}px`;
    const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export default function AICompanion() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!value.trim() || isLoading) return;

    const userMessage = value.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setValue("");
    adjustHeight(true);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('antara_token');
      const response = await axios.post('http://localhost:8000/api/chat', 
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessages(prev => [...prev, { role: "ai", content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error connecting to AI. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass-card border border-white/5 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-black/60 pointer-events-none"></div>
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/40 backdrop-blur-md relative z-10">
         <div className="w-10 h-10 rounded-full bg-primary-color/20 flex items-center justify-center border border-primary-color/50">
            <Bot className="text-primary-color w-6 h-6" />
         </div>
         <div>
            <h3 className="text-white font-semibold">Antara Claude 3</h3>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online • LanceDB RAG Active
            </p>
         </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              What can I help you restructure?
            </h1>
            <div className="flex flex-wrap justify-center gap-3">
                <ActionButton icon={<BrainCircuit className="w-4 h-4" />} label="Analyze my last journal" onClick={() => setValue("Can you analyze the cognitive distortions in my last journal?")} />
                <ActionButton icon={<ShieldAlert className="w-4 h-4" />} label="I'm feeling panicked" onClick={() => setValue("I'm feeling panicked about my exams. Help me calm down.")} />
                <ActionButton icon={<Lightbulb className="w-4 h-4" />} label="Study Strategy" onClick={() => setValue("I can't focus. What CBT technique can help me study?")} />
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg",
                  msg.role === "user" 
                    ? "bg-primary-color text-white rounded-br-none" 
                    : "bg-white/10 text-gray-200 rounded-bl-none border border-white/5 backdrop-blur-sm"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/10 border border-white/5 backdrop-blur-sm rounded-2xl rounded-bl-none p-4 flex gap-2 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* V0 Style Input Box */}
      <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/10 relative z-10">
        <div className="relative bg-[#1A1A1A] rounded-xl border border-white/10 shadow-inner">
            <div className="overflow-y-auto">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        adjustHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Antara to restructure your thoughts..."
                    className={cn(
                        "w-full px-4 py-4",
                        "resize-none",
                        "bg-transparent",
                        "border-none",
                        "text-white text-sm leading-relaxed",
                        "focus:outline-none focus:ring-0",
                        "focus-visible:ring-0 focus-visible:ring-offset-0",
                        "placeholder:text-neutral-500 placeholder:text-sm",
                        "min-h-[60px]"
                    )}
                    style={{ overflow: "hidden" }}
                />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-b-xl">
                <div className="flex items-center gap-2">
                    <button type="button" className="group p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1">
                        <Paperclip className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </button>
                    <button type="button" className="group p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1">
                        <Activity className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSend}
                        disabled={!value.trim() || isLoading}
                        className={cn(
                            "px-2 py-2 rounded-lg text-sm transition-all flex items-center justify-center shadow-sm",
                            value.trim()
                                ? "bg-white text-black hover:bg-gray-200"
                                : "bg-white/5 text-gray-500"
                        )}
                    >
                        <ArrowUpIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-gray-300 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
