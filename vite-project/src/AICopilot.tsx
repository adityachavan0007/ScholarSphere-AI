import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, FileText, X, Bot, BrainCircuit } from "lucide-react";

// --- TYPES ---
interface Artifact { id: string; title: string; type: "text" | "code"; content: string; }
interface Message { id: string; sender: "user" | "ai"; text?: string; isThinking?: boolean; artifactTrigger?: Artifact; }

// --- PREMIUM FORMATTER: Parses AI text into clean UI elements ---
const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (line.trim().startsWith('- ')) {
            return <li key={i} className="ml-4 list-disc mb-1 text-slate-300">{line.replace('- ', '')}</li>;
        }
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
            <p key={i} className="mb-2">
                {parts.map((part, j) => 
                    part.startsWith('**') ? <strong key={j} className="text-white font-semibold">{part.replace(/\*\*/g, '')}</strong> : part
                )}
            </p>
        );
    });
};

export default function AICopilot({ initialPrompt }: { initialPrompt?: string }) {
    const [messages, setMessages] = useState<Message[]>([
        { id: "1", sender: "ai", text: "Hello! I'm your ScholarSphere AI. How can I assist you with your academic or career journey today?" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeArtifact]);

    useEffect(() => {
        if (initialPrompt) executePrompt(initialPrompt);
    }, [initialPrompt]);

    const executePrompt = async (text: string) => {
        if (!text.trim()) return;
        if (text.length > 1000) {
            alert("Your prompt is too long. Please limit it to 1000 characters.");
            return;
        }

        const userMsg: Message = { id: Date.now().toString(), sender: "user", text };
        setMessages(prev => [...prev, userMsg]);
        setIsProcessing(true);

        const thinkingId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: thinkingId, sender: "ai", isThinking: true }]);

        try {
            const API_URL = import.meta.env.NEXT_PUBLIC_APP_URL || "";
            const response = await fetch(`${API_URL}/api/ai-chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: userMsg.text,
                    history: messages.filter(m => m.text && !m.isThinking).map(m => ({
                        role: m.sender === "user" ? "user" : "model",
                        content: m.text || ""
                    }))
                })
            });

            if (!response.ok) throw new Error(`Status ${response.status}`);

            const data = await response.json();
            
            let aiMsg: Message = { id: (Date.now() + 2).toString(), sender: "ai", text: data.text };

            if (data.text.includes("```")) {
                const parts = data.text.split("```");
                if (parts.length >= 3) {
                    const artifactData: Artifact = {
                        id: Date.now().toString(),
                        title: "Generated Content",
                        type: "text",
                        content: parts[1].replace(/^\w+\n/, "")
                    };
                    aiMsg.artifactTrigger = artifactData;
                }
            }

            setMessages(prev => prev.map(m => m.id === thinkingId ? aiMsg : m));
        } catch (error) {
            setMessages(prev => prev.map(m => m.id === thinkingId ? {
                id: thinkingId, sender: "ai", text: "I'm having trouble connecting to the server. Please ensure your backend is running."
            } : m));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-black/95 text-slate-200 font-sans relative overflow-hidden">
            {/* Subtle glow in background */}
            <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className={`flex flex-col w-full transition-all duration-300 ${activeArtifact ? "max-w-4xl mx-auto" : "max-w-3xl mx-auto"}`}>
                
                <div className="h-14 flex items-center px-6 shrink-0 border-b border-[#30363d]/50">
                    <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
                    <h1 className="text-sm font-semibold text-slate-200">ScholarSphere AI</h1>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.sender === "ai" && <div className="w-8 h-8 mt-1 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30"><Bot size={16} className="text-indigo-400"/></div>}
                            
                            {msg.isThinking ? (
                                <div className="px-5 py-3 bg-[#0a0a0a] border border-[#1a1a1a] shadow-none rounded-2xl animate-pulse text-sm">Thinking...</div>
                            ) : (
                                <div className={`px-5 py-3 rounded-2xl max-w-[85%] text-[15px] shadow-lg border ${msg.sender === "user" ? "bg-indigo-600/80 backdrop-blur-md border-indigo-500/50 text-white rounded-tr-sm" : "bg-[#0a0a0a] border border-[#1a1a1a] shadow-none border-white/10 text-slate-200 rounded-tl-none"}`}>
                                    {msg.sender === "ai" ? renderFormattedText(msg.text || "") : msg.text}
                                    {msg.artifactTrigger && (
                                        <button onClick={() => setActiveArtifact(msg.artifactTrigger!)} className="block mt-3 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-all">
                                            <FileText size={12} className="inline mr-1" /> View Generated Document
                                        </button>
                                    )}
                                </div>
                            )}
                            
                            {msg.sender === "user" && <div className="w-8 h-8 mt-1 rounded-full bg-slate-700 flex items-center justify-center"><User size={16} /></div>}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Floating Input Bar */}
                <div className="p-6 relative z-10">
                    <form onSubmit={(e) => { e.preventDefault(); executePrompt(inputValue); setInputValue(""); }} className="relative flex items-center bg-[#0a0a0a] border border-[#1a1a1a] shadow-none rounded-2xl focus-within:border-indigo-400 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
                        <input 
                            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask ScholarSphere AI..."
                            className="w-full bg-transparent p-4 pl-6 text-sm text-white focus:outline-none placeholder:text-slate-500"
                        />
                        <button disabled={isProcessing} className="p-4 text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Artifact Viewer */}
            <AnimatePresence>
                {activeArtifact && (
                    <motion.div initial={{ width: 0 }} animate={{ width: 450 }} exit={{ width: 0 }} className="h-screen bg-black/80 backdrop-blur-2xl border-l border-white/10 flex flex-col z-30 shadow-2xl relative">
                        <div className="flex justify-between items-center p-4 border-b border-[#30363d]">
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{activeArtifact.title}</span>
                            <button onClick={() => setActiveArtifact(null)}><X size={16} className="text-slate-400" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <textarea value={activeArtifact.content} onChange={(e) => setActiveArtifact({...activeArtifact, content: e.target.value})} className="w-full h-full bg-transparent border-none outline-none font-sans text-sm leading-relaxed text-slate-300 custom-scrollbar" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; } 
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #30363d; border-radius: 10px; }
            `}</style>
        </div>
    );
}