import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Command, ArrowRight, Code } from "lucide-react";

export default function TerminalDemo() {
    const [input, setInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSimulate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input) return;

        setIsProcessing(true);
        setShowResults(false);

        // Simulate AI loading delay
        setTimeout(() => {
            setIsProcessing(false);
            setShowResults(true);
        }, 1500);
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-24 mb-16">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white sm:text-4xl font-mono mb-4">Test the Copilot</h2>
                <p className="text-slate-400">Enter your core skills and see what the AI finds in milliseconds.</p>
            </div>

            <div className="w-full overflow-hidden bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Fake Mac/VS Code Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 text-xs font-mono text-slate-400">
                        <Command size={12} /> run_matchmaker.sh
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSimulate} className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sky-400 font-mono font-bold">{">"}</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="e.g., Java, Arduino, IoT, Video Editing..."
                                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-slate-600 focus:ring-0"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 text-xs font-bold text-white transition-colors rounded-lg bg-sky-600 hover:bg-sky-500 font-mono"
                            >
                                EXECUTE
                            </button>
                        </div>
                    </form>

                    {/* Processing Animation */}
                    {isProcessing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 font-mono text-sm text-yellow-400 flex items-center gap-2">
                            <span className="animate-pulse">_</span> Analyzing matrix for '{input}'...
                        </motion.div>
                    )}

                    {/* AI Results Output */}
                    {showResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 space-y-3 font-mono text-sm"
                        >
                            <div className="text-green-400">✔ 3 High-Probability Matches Found:</div>

                            <div className="p-3 border rounded-lg border-sky-500/30 bg-sky-500/5 flex items-start gap-3">
                                <Code className="w-5 h-5 text-sky-400 mt-0.5" />
                                <div>
                                    <div className="font-bold text-sky-300">Global Tech Hackathon 2026</div>
                                    <div className="text-slate-400 text-xs mt-1">Requires: {input || "Your Skills"} | Match Score: 98%</div>
                                </div>
                            </div>

                            <div className="p-3 border rounded-lg border-purple-500/30 bg-purple-500/5 flex items-start gap-3">
                                <ArrowRight className="w-5 h-5 text-purple-400 mt-0.5" />
                                <div>
                                    <div className="font-bold text-purple-300">Open Source Contributor Grant</div>
                                    <div className="text-slate-400 text-xs mt-1">Stipend: ₹25,000 | Match Score: 92%</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}