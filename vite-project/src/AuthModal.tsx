import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Github, Command } from "lucide-react";
import { useState } from "react";
import { supabase } from "./lib/supabaseClient";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "signup";
    // NEW: We add an onSuccess prop to trigger the page change!
    onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, initialView = "signup", onSuccess }: AuthModalProps) {
    const [view, setView] = useState<"login" | "signup">(initialView);

    // Simulated authentication loader
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);

        // Simulate network delay for a realistic feel, then trigger success!
        setTimeout(() => {
            setIsAuthenticating(false);
            onSuccess();
        }, 800);
    };

    const handleOAuthSignIn = async (provider: 'google' | 'github') => {
        setIsAuthenticating(true);
        // Simulate OAuth flow success for local development without APIs
        setTimeout(() => {
            console.log(`Simulated ${provider} login success`);
            setIsAuthenticating(false);
            onSuccess();
        }, 1200);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-md pointer-events-auto bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            {/* Terminal Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                                    <Command size={12} /> auth_session.tsx
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-2 mb-6 text-sm font-mono text-sky-400">
                                    <span className="text-slate-500">{">_"}</span> ./init_{view}.sh
                                </div>

                                <div className="flex p-1 mb-8 bg-[#010409] border border-[#30363d] rounded-lg">
                                    <button onClick={() => setView("login")} className={`flex-1 py-2 text-sm font-medium transition-all rounded-md ${view === "login" ? "bg-[#21262d] text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}>Log In</button>
                                    <button onClick={() => setView("signup")} className={`flex-1 py-2 text-sm font-medium transition-all rounded-md ${view === "signup" ? "bg-[#21262d] text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}>Sign Up</button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {view === "signup" && (
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 text-slate-500 transition-colors group-focus-within:text-sky-400" size={18} />
                                            <input type="text" required placeholder="Developer Name" className="w-full py-3 pl-12 pr-4 text-sm text-white font-mono transition-all bg-[#010409] border rounded-lg border-[#30363d] focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-600" />
                                        </div>
                                    )}

                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-3.5 text-slate-500 transition-colors group-focus-within:text-sky-400" size={18} />
                                        <input type="email" required placeholder="college_email@edu.in" className="w-full py-3 pl-12 pr-4 text-sm text-white font-mono transition-all bg-[#010409] border rounded-lg border-[#30363d] focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-600" />
                                    </div>

                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 text-slate-500 transition-colors group-focus-within:text-sky-400" size={18} />
                                        <input type="password" required placeholder="••••••••" className="w-full py-3 pl-12 pr-4 text-sm text-white font-mono transition-all bg-[#010409] border rounded-lg border-[#30363d] focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder:text-slate-600" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAuthenticating}
                                        className="w-full py-3 mt-6 text-sm font-semibold text-white transition-all duration-300 rounded-lg bg-sky-600 hover:bg-sky-500 hover:shadow-[0_0_20px_rgba(2,132,199,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAuthenticating ? "Processing..." : (view === "login" ? "Execute Login" : "Initialize Account")}
                                    </button>
                                </form>

                                <div className="flex items-center gap-4 my-6">
                                    <div className="flex-1 h-px bg-[#30363d]"></div>
                                    <span className="text-xs font-mono text-slate-500">OR</span>
                                    <div className="flex-1 h-px bg-[#30363d]"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleOAuthSignIn('github')}
                                        disabled={isAuthenticating}
                                        className="flex items-center justify-center gap-3 py-3 text-sm font-medium text-white transition-all bg-[#21262d] border border-[#30363d] rounded-lg hover:bg-[#30363d] disabled:opacity-50"
                                    >
                                        <Github size={18} /> GitHub
                                    </button>
                                    <button
                                        onClick={() => handleOAuthSignIn('google')}
                                        disabled={isAuthenticating}
                                        className="flex items-center justify-center gap-3 py-3 text-sm font-medium text-white transition-all bg-[#21262d] border border-[#30363d] rounded-lg hover:bg-[#30363d] disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg> Google
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}