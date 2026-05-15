import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal, Send, BrainCircuit, Sparkles, User, Code,
    Zap, ChevronRight, Calendar, CheckCircle2, FileText, X, Download, Copy
} from "lucide-react";

// --- TYPES ---
interface Artifact {
    id: string;
    title: string;
    type: "text" | "code";
    content: string;
}

interface Message {
    id: string;
    sender: "user" | "ai";
    text?: string;
    telemetry?: string[];
    widget?: "hackathons" | "internships";
    artifactTrigger?: Artifact;
}

// --- SUBCOMPONENTS ---

// 1. Telemetry Stream (Instant feedback "thought process")
const TelemetryStream = ({ logs }: { logs: string[] }) => {
    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < logs.length) {
                setVisibleLogs(prev => [...prev, logs[i]]);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 300); // Ultra-fast streaming effect
        return () => clearInterval(interval);
    }, [logs]);

    return (
        <div className="font-mono text-xs text-slate-500 mb-2 space-y-1">
            {visibleLogs.map((log, index) => (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={index} className="flex items-center gap-2">
                    <span className="text-purple-500">{">"}</span> {log}
                </motion.div>
            ))}
            {visibleLogs.length < logs.length && (
                <div className="flex items-center gap-2"><span className="text-purple-500">{">"}</span> <span className="w-1.5 h-3 bg-slate-500 animate-pulse"></span></div>
            )}
        </div>
    );
};

// 2. Generative UI Widget: Hackathon Carousel
const HackathonWidget = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 overflow-x-auto pb-4 mt-4 custom-scrollbar w-full max-w-full sm:max-w-[500px]">
        {[
            { name: "Smart India Hackathon", match: "95%", date: "Aug 2026", tech: "Hardware / IoT" },
            { name: "HackNITR 5.0", match: "82%", date: "Oct 2026", tech: "Node.js / APIs" },
            { name: "Devfolio Build", match: "78%", date: "Nov 2026", tech: "Java / Backend" }
        ].map((h, i) => (
            <div key={i} className="min-w-[220px] sm:min-w-[240px] p-4 bg-[#050b14] border border-cyan-500/30 rounded-xl hover:border-cyan-400 transition-all cursor-pointer group flex-shrink-0 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-50"></div>
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-200 text-sm group-hover:text-cyan-400 transition-colors">{h.name}</h4>
                    <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {h.match}</span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-2 font-mono"><Calendar className="w-3 h-3 text-slate-500" /> {h.date}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-mono"><Code className="w-3 h-3 text-slate-500" /> {h.tech}</p>
                <button className="mt-4 w-full py-2 text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all flex justify-center items-center gap-1">
                    Initialize <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        ))}
    </motion.div>
);


import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are ScholarSphere AI, an elite AI copilot for Indian undergraduate students. Your tone is engineering-focused, slightly futuristic, and highly efficient. You help students find scholarships, hackathons, and internships. You can also help draft cover letters and application answers. Use terminal-style language occasionally (e.g., 'neural link established', 'scanning registers'). If you generate a long document (like a cover letter), format it clearly with markdown."
});

// --- MAIN APP ---
export default function AICopilot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "ai",
            text: "Neural link established. Accessing matrix... Context loaded: [Engineering/Tech Navigator]. Awaiting your command parameter."
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isProcessing, activeArtifact]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: "user", text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsProcessing(true);

        try {
            // Add a telemetry message for realism
            const telemetryMsg: Message = { 
                id: (Date.now() + 1).toString(), 
                sender: "ai",
                telemetry: ["Initializing cognitive engine...", "Querying semantic knowledge graph...", "Compiling response vectors..."]
            };
            setMessages(prev => [...prev, telemetryMsg]);

            const chat = model.startChat({
                history: messages.filter(m => m.text).map(m => ({
                    role: m.sender === "user" ? "user" : "model",
                    parts: [{ text: m.text || "" }]
                })),
            });

            const result = await chat.sendMessage(userMsg.text!);
            const responseText = result.response.text();

            let aiMsg: Message = { 
                id: (Date.now() + 2).toString(), 
                sender: "ai", 
                text: responseText 
            };

            // Detect if response contains a large markdown block (potential artifact)
            if (responseText.includes("```")) {
                const parts = responseText.split("```");
                if (parts.length >= 3) {
                    const content = parts[1].split("\n").slice(1).join("\n"); // Remove language tag
                    const title = responseText.toLowerCase().includes("cover letter") ? "Cover_Letter.md" : "Generated_Document.md";
                    const artifactData: Artifact = {
                        id: Date.now().toString() + "_art",
                        title,
                        type: "text",
                        content: content
                    };
                    aiMsg.artifactTrigger = artifactData;
                    // Automatically open if it's a specific generation request
                    if (inputValue.toLowerCase().includes("draft") || inputValue.toLowerCase().includes("generate")) {
                        setActiveArtifact(artifactData);
                    }
                }
            }

            // Update the last message (the telemetry one) with the real response
            setMessages(prev => prev.map(m => m.id === telemetryMsg.id ? aiMsg : m));

        } catch (error: any) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, { 
                id: Date.now().toString(), 
                sender: "ai", 
                text: "ERROR: Neural connection interrupted. Please verify API protocols." 
            }]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen pt-16 bg-[#030712] font-sans selection:bg-purple-500/30 overflow-hidden relative">

            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            {/* --- THE SPLIT SCREEN ENGINE --- */}
            <div className="flex w-full h-[calc(100vh-4rem)] relative z-10">

                {/* LEFT: CHAT INTERFACE (Shrinks when Canvas is open on desktop, hides completely on mobile if canvas is open) */}
                <motion.div
                    layout
                    className={`flex flex-col h-full bg-[#030712] transition-all duration-500 ease-in-out ${activeArtifact
                        ? 'w-full md:w-[400px] lg:w-[450px] border-r border-[#30363d] hidden md:flex shrink-0 shadow-[20px_0_50px_rgba(0,0,0,0.5)] z-20'
                        : 'w-full flex-1'
                        }`}
                >
                    {/* Chat Header */}
                    <div className="h-14 border-b border-white/5 bg-[#050b14] flex items-center px-4 sm:px-6 shrink-0 justify-between">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
                            <h1 className="text-sm font-bold text-white font-mono tracking-wide">ScholarSphere <span className="text-purple-400">AI</span></h1>
                        </div>
                        {!activeArtifact && <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 border border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-500/10"><Zap className="w-3 h-3" /> ONLINE</span>}
                    </div>

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex flex-col gap-6">
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex w-full flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>

                                    {/* AI Telemetry Render */}
                                    {msg.sender === "ai" && msg.telemetry && (
                                        <div className="ml-11 mb-1 max-w-[85%]"><TelemetryStream logs={msg.telemetry} /></div>
                                    )}

                                    <div className={`flex gap-3 max-w-[95%] sm:max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className="flex-shrink-0 mt-1">
                                            {msg.sender === "user" ? (
                                                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]"><User className="w-4 h-4 text-cyan-400" /></div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]"><Sparkles className="w-4 h-4 text-purple-400" /></div>
                                            )}
                                        </div>

                                        {msg.text && (
                                            <div className={`p-4 rounded-2xl text-sm leading-relaxed relative ${msg.sender === "user" ? "bg-cyan-950/40 text-cyan-50 border border-cyan-500/30 rounded-tr-none backdrop-blur-sm" : "bg-[#0d1117]/80 border border-[#30363d] text-slate-300 rounded-tl-none shadow-xl backdrop-blur-sm"}`}>
                                                {msg.text}
                                            </div>
                                        )}
                                    </div>

                                    {/* Generative UI Render */}
                                    {msg.sender === "ai" && msg.widget === "hackathons" && (
                                        <div className="ml-0 sm:ml-11 mt-2 w-full"><HackathonWidget /></div>
                                    )}

                                    {/* Artifact Trigger Link */}
                                    {msg.sender === "ai" && msg.artifactTrigger && (
                                        <div className="ml-11 mt-3">
                                            <button
                                                onClick={() => setActiveArtifact(msg.artifactTrigger!)}
                                                className={`flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg transition-all border ${activeArtifact?.id === msg.artifactTrigger.id
                                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(147,51,234,0.2)]'
                                                    : 'bg-purple-500/5 border-purple-500/20 text-purple-400 hover:bg-purple-500/10'
                                                    }`}
                                            >
                                                <FileText className="w-4 h-4" /> {activeArtifact?.id === msg.artifactTrigger.id ? "Viewing Artifact" : `Open ${msg.artifactTrigger.title}`}
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Processing Indicator */}
                        {isProcessing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/50 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_15px_rgba(147,51,234,0.3)]"><BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse" /></div>
                                <div className="h-10 px-4 rounded-2xl bg-[#0d1117] border border-[#30363d] rounded-tl-none flex items-center backdrop-blur-sm">
                                    <span className="w-2 h-4 bg-purple-500 animate-pulse rounded-sm"></span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={chatEndRef} className="h-4" />
                    </div>

                    {/* Input Box */}
                    <div className="p-4 bg-[#050b14] border-t border-white/5 shrink-0 z-10">
                        <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto">
                            <span className="absolute left-4 text-purple-500 font-mono font-bold animate-pulse">{">"}</span>
                            <input
                                type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Query Copilot..."
                                className="w-full pl-8 pr-12 py-3 bg-[#030712] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500/50 transition-colors shadow-inner"
                            />
                            <button type="submit" disabled={!inputValue.trim() || isProcessing} className="absolute right-2 top-1.5 bottom-1.5 aspect-square flex items-center justify-center bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-30 disabled:hover:bg-purple-600 transition-colors shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* RIGHT: THE ACTION CANVAS (Slides in automatically) */}
                <AnimatePresence>
                    {activeArtifact && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            className="absolute md:relative inset-0 md:inset-auto flex-1 h-full bg-[#030712] flex flex-col z-30"
                        >
                            {/* Canvas Header */}
                            <div className="h-14 border-b border-white/5 bg-[#050b14] flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-md">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                                    <span className="text-sm font-mono text-slate-200 truncate">{activeArtifact.title}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-[#30363d] text-slate-300 text-xs font-mono rounded hover:bg-slate-700 transition-colors">
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded hover:bg-cyan-500/20 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                        <Download className="w-3 h-3" /> Export
                                    </button>
                                    <div className="w-px h-4 bg-[#30363d] mx-1 sm:mx-2"></div>
                                    <button onClick={() => setActiveArtifact(null)} className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 bg-white/5 border border-white/5">
                                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Canvas Editor Surface */}
                            <div className="flex-1 p-4 sm:p-8 overflow-y-auto custom-scrollbar bg-[#010409]">
                                <div className="max-w-4xl mx-auto bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl p-6 sm:p-12 min-h-full">
                                    <textarea
                                        value={activeArtifact.content}
                                        onChange={(e) => setActiveArtifact({ ...activeArtifact, content: e.target.value })}
                                        className="w-full min-h-[60vh] bg-transparent border-none outline-none text-slate-300 font-sans text-sm sm:text-base leading-relaxed resize-none custom-scrollbar"
                                        spellCheck="false"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Global Custom Scrollbar Styling */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #30363d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #4b5563; }
      `}</style>
        </div>
    );
}