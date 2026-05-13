import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal, Send, BrainCircuit, Sparkles, User, Code,
    Briefcase, GraduationCap, ChevronRight, Zap
} from "lucide-react";

interface Message {
    id: string;
    sender: "user" | "ai";
    text: string;
}

export default function AICopilot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "ai",
            text: "System initialized. I have loaded your profile context: [FY B.Tech IT | Java | Arduino | mak6company]. Are you looking for Hackathons, Internships, or Open Source repos today?"
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg: Message = { id: Date.now().toString(), sender: "user", text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // MOCK AI RESPONSE TIMEOUT (Later replace with real backend API call)
        setTimeout(() => {
            let aiReply = "I'm analyzing the latest databases...";

            const lowerInput = userMsg.text.toLowerCase();
            if (lowerInput.includes("hackathon")) {
                aiReply = "I found 3 active hackathons perfectly matching your hardware/Arduino skillset. The 'Smart India Hackathon' registrations open next week. Shall I draft a project pitch based on your Force Detection System?";
            } else if (lowerInput.includes("internship")) {
                aiReply = "Scanning for FY B.Tech internships... I found an early-talent SDE role at TechCorp looking for Java developers. Your Alpha Plus 7.0 Certificate gives you a 85% match score. Want me to generate a cover letter?";
            } else {
                aiReply = "Based on your tech stack (Java, Node.js), I recommend focusing on backend API building. I can query GitHub for 'good first issues' if you want to build your open-source portfolio.";
            }

            setMessages(prev => [...prev, { id: Date.now().toString(), sender: "ai", text: aiReply }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex w-full min-h-screen pt-16 bg-[#030712] font-sans selection:bg-purple-500/30">

            {/* LEFT SIDEBAR: PROFILE CONTEXT (Simulated Database Read) */}
            <div className="hidden lg:flex flex-col w-80 bg-[#0d1117] border-r border-[#30363d] p-6 h-[calc(100vh-4rem)] sticky top-16">
                <div className="flex items-center gap-2 mb-8">
                    <BrainCircuit className="w-6 h-6 text-purple-400 animate-pulse" />
                    <h2 className="text-lg font-bold text-white font-mono">System.Context</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 font-mono mb-3 uppercase tracking-wider">Active Memory</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-300 bg-[#010409] border border-[#30363d] p-2 rounded-lg">
                                <GraduationCap className="w-4 h-4 text-blue-400" /> B.Tech IT (FY)
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300 bg-[#010409] border border-[#30363d] p-2 rounded-lg">
                                <Code className="w-4 h-4 text-purple-400" /> Java, Arduino, Node.js
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300 bg-[#010409] border border-[#30363d] p-2 rounded-lg">
                                <Briefcase className="w-4 h-4 text-green-400" /> mak6company Founder
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#30363d]">
                        <h3 className="text-xs font-bold text-slate-500 font-mono mb-3 uppercase tracking-wider">Live Scanners</h3>
                        <div className="space-y-3 font-mono text-xs text-slate-400">
                            <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Internships API: <span className="text-green-400">ONLINE</span></p>
                            <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Hackathon DB: <span className="text-green-400">ONLINE</span></p>
                            <p className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Profile Matcher: <span className="text-green-400">READY</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT MAIN: CHAT INTERFACE */}
            <div className="flex flex-col flex-1 h-[calc(100vh-4rem)] relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-blend-overlay bg-black/40">

                {/* Chat Header */}
                <div className="h-16 border-b border-[#30363d] bg-[#0d1117]/80 backdrop-blur-md flex items-center px-6 justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <Terminal className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white font-mono">ScholarSphere_Copilot_v2.0</h1>
                            <p className="text-xs text-green-400 font-mono flex items-center gap-1">
                                <Zap className="w-3 h-3" /> Connection Secure
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chat History Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>

                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mt-1">
                                        {msg.sender === "user" ? (
                                            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/50 flex items-center justify-center">
                                                <User className="w-4 h-4 text-sky-400" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                                                <Sparkles className="w-4 h-4 text-purple-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Bubble */}
                                    <div className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed ${msg.sender === "user"
                                            ? "bg-sky-600 text-white rounded-tr-none shadow-[0_5px_20px_rgba(2,132,199,0.2)]"
                                            : "bg-[#161b22] border border-[#30363d] text-slate-200 rounded-tl-none"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start">
                            <div className="flex gap-3 max-w-[85%] flex-row">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)] shrink-0 mt-1">
                                    <BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse" />
                                </div>
                                <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] rounded-tl-none flex items-center gap-1.5 h-12">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat Input Area */}
                <div className="p-4 sm:p-6 bg-[#0d1117] border-t border-[#30363d] shrink-0">
                    <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask for hackathons, resume reviews, or internship matches..."
                            className="w-full pl-4 pr-14 py-4 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500 focus:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-slate-500 mt-3 font-mono">
                        ScholarSphere AI connects to your profile vectors. Responses are generated in real-time.
                    </p>
                </div>

            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #30363d; border-radius: 10px; }`}</style>
        </div>
    );
}