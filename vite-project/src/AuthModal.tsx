import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Mail, Lock, User, Command, Eye, EyeOff,
    Loader2, ArrowRight, ShieldCheck, KeyRound
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "signup";
    onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, initialView = "signup", onSuccess }: AuthModalProps) {
    const [view, setView] = useState<"login" | "signup" | "forgot">("signup");

    // Controlled Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    // UI States
    const [showPassword, setShowPassword] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Post-Action States
    const [verificationSent, setVerificationSent] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    // --- SYNC STATE WHEN OPENED ---
    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setEmail("");
            setPassword("");
            setFullName("");
            setError(null);
            setVerificationSent(false);
            setResetSent(false);
            setShowPassword(false);
            setIsAuthenticating(false);
        }
    }, [isOpen, initialView]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setError(null);

        try {
            if (view === "signup") {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } }
                });

                if (error) throw error;

                if (data.user) {
                    // Create student profile entry
                    const { error: profileError } = await supabase
                        .from('student_profiles')
                        .upsert([{ id: data.user.id, name: fullName || email.split('@')[0] }]);

                    if (profileError) console.error("Error creating profile:", profileError);
                }

                // If session is null, Supabase requires email verification
                if (data.user && !data.session) {
                    setVerificationSent(true);
                } else if (data.session) {
                    onSuccess();
                }

            } else if (view === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });

                if (error) {
                    if (error.message.includes("Email not confirmed")) {
                        throw new Error("Please verify your email address before logging in.");
                    }
                    throw error;
                }
                onSuccess();

            } else if (view === "forgot") {
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
                setResetSent(true);
            }

        } catch (err: any) {
            setError(err.message || "Authentication failed.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-md bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden relative z-10"
                >
                    {/* Dynamic Glowing Edge based on context */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${view === "login" ? "bg-gradient-to-r from-sky-500 to-blue-600 shadow-[0_0_15px_rgba(14,165,233,0.5)]" :
                        view === "signup" ? "bg-gradient-to-r from-purple-500 to-indigo-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]" :
                            "bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        }`}></div>

                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-5 py-4 bg-[#161b22] border-b border-[#30363d]">
                        <div className="flex gap-2.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 font-medium tracking-wide">
                            <Command size={12} /> auth_protocol.sh
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors hover:bg-white/10 p-1 rounded-md">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-8">
                        {/* --- VERIFICATION SENT SCREEN --- */}
                        {verificationSent ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-2">
                                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                    <Mail className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white font-mono mb-2">Verify Your Email</h3>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    A secure activation link has been sent to <span className="text-sky-400 font-medium">{email}</span>.
                                </p>
                                <button
                                    onClick={() => { setVerificationSent(false); setView("login"); }}
                                    className="w-full py-3.5 bg-[#21262d] text-white font-bold font-mono rounded-xl border border-[#30363d] hover:bg-[#30363d] transition-all"
                                >
                                    Return to Login
                                </button>
                            </motion.div>

                            /* --- PASSWORD RESET SENT SCREEN --- */
                        ) : resetSent ? (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-2">
                                <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                    <KeyRound className="w-10 h-10 text-amber-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white font-mono mb-2">Recovery Sent</h3>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    If an account exists for <span className="text-amber-400 font-medium">{email}</span>, a password reset link has been deployed.
                                </p>
                                <button
                                    onClick={() => { setResetSent(false); setView("login"); }}
                                    className="w-full py-3.5 bg-[#21262d] text-white font-bold font-mono rounded-xl border border-[#30363d] hover:bg-[#30363d] transition-all"
                                >
                                    Back to Login
                                </button>
                            </motion.div>

                            /* --- CORE FORMS --- */
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-8 text-sm font-mono text-slate-300 border-b border-[#30363d] pb-4">
                                    <ShieldCheck className={`w-5 h-5 ${view === 'login' ? 'text-sky-400' : view === 'signup' ? 'text-purple-400' : 'text-amber-400'}`} />
                                    <span>
                                        {view === "login" ? "Execute User Login" : view === "signup" ? "Initialize New Developer" : "Recover Credentials"}
                                    </span>
                                </div>

                                {/* Form Toggle Tabs (Hide on Forgot Password) */}
                                {view !== "forgot" && (
                                    <div className="flex p-1 mb-8 bg-[#010409] border border-[#30363d] rounded-xl shadow-inner">
                                        <button type="button" onClick={() => { setView("login"); setError(null); }} className={`flex-1 py-2.5 text-sm font-bold font-mono transition-all rounded-lg ${view === "login" ? "bg-[#21262d] text-white shadow-md border border-[#30363d]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}>Log In</button>
                                        <button type="button" onClick={() => { setView("signup"); setError(null); }} className={`flex-1 py-2.5 text-sm font-bold font-mono transition-all rounded-lg ${view === "signup" ? "bg-[#21262d] text-white shadow-md border border-[#30363d]" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}>Sign Up</button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Error Banner */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                                <div className="p-3 mb-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-mono flex items-start gap-2">
                                                    <X className="w-4 h-4 shrink-0 mt-0.5" /> <span className="leading-relaxed">{error}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Name Input (Signup Only) */}
                                    {view === "signup" && (
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-purple-400" size={18} />
                                                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Alan Turing" className="w-full py-3.5 pl-12 pr-4 text-sm text-white font-mono transition-all bg-[#010409] border rounded-xl border-[#30363d] focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 placeholder:text-slate-600 shadow-inner" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Email Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors ${view === 'login' ? 'group-focus-within:text-sky-400' : view === 'signup' ? 'group-focus-within:text-purple-400' : 'group-focus-within:text-amber-400'}`} size={18} />
                                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dev@matrix.com" className={`w-full py-3.5 pl-12 pr-4 text-sm text-white font-mono transition-all bg-[#010409] border rounded-xl border-[#30363d] focus:outline-none focus:ring-1 placeholder:text-slate-600 shadow-inner ${view === 'login' ? 'focus:border-sky-500 focus:ring-sky-500/50' : view === 'signup' ? 'focus:border-purple-500 focus:ring-purple-500/50' : 'focus:border-amber-500 focus:ring-amber-500/50'}`} />
                                        </div>
                                    </div>

                                    {/* Password Input (Hidden on Forgot Password) */}
                                    {view !== "forgot" && (
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center pr-1">
                                                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Password</label>
                                                {view === "login" && (
                                                    <button type="button" onClick={() => { setView("forgot"); setError(null); }} className="text-[10px] font-mono text-sky-400 hover:text-sky-300 transition-colors">
                                                        Forgot Protocol?
                                                    </button>
                                                )}
                                            </div>
                                            <div className="relative group">
                                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors ${view === 'login' ? 'group-focus-within:text-sky-400' : 'group-focus-within:text-purple-400'}`} size={18} />

                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className={`w-full py-3.5 pl-12 pr-12 text-sm text-white font-mono transition-all bg-[#010409] border rounded-xl border-[#30363d] focus:outline-none focus:ring-1 placeholder:text-slate-600 shadow-inner tracking-widest placeholder:tracking-normal ${view === 'login' ? 'focus:border-sky-500 focus:ring-sky-500/50' : 'focus:border-purple-500 focus:ring-purple-500/50'}`}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <button
                                        type="submit"
                                        disabled={isAuthenticating}
                                        className={`w-full py-4 mt-6 text-sm font-bold text-white transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-mono flex items-center justify-center gap-2 ${view === "login" ? "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-[0_0_20px_rgba(14,165,233,0.3)]" :
                                            view === "signup" ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]" :
                                                "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                                            }`}
                                    >
                                        {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                        {isAuthenticating ? "Processing..." : view === "login" ? "Execute Login" : view === "signup" ? "Create Root Access" : "Deploy Reset Link"}
                                        {!isAuthenticating && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </form>

                                {/* Back to Login (Forgot Password View) */}
                                {view === "forgot" && (
                                    <div className="mt-6 text-center">
                                        <button type="button" onClick={() => { setView("login"); setError(null); }} className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
                                            Cancel Sequence (Return to Login)
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}