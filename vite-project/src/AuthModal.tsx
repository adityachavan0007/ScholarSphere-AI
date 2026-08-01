import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Terminal } from "lucide-react";
import { supabase } from "./lib/supabaseClient";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "signup";
    onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, initialView = "signup", onSuccess }: AuthModalProps) {
    const [view, setView] = useState<"login" | "signup">("signup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationSent, setVerificationSent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setView(initialView);
            setEmail("");
            setPassword("");
            setFullName("");
            setError(null);
            setVerificationSent(false);
            setIsAuthenticating(false);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
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
                    options: { data: { full_name: fullName || "New User" } }
                });

                if (error) throw error;

                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('student_profiles')
                        .upsert([{ id: data.user.id, name: fullName || email.split('@')[0] }]);

                    if (profileError) console.error("Error creating profile:", profileError);
                }

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
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    if (!isOpen) return null;

    // Vercel-style dot grid background pattern
    const dotPattern = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')";

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90" style={{ backgroundImage: dotPattern }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 cursor-pointer"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="w-full max-w-[400px] bg-[#0a0a0a] rounded-xl overflow-hidden relative z-10 border border-[#27272a] shadow-2xl"
                >
                    <div className="p-8 sm:p-10 flex flex-col items-center">
                        
                        {/* Logo */}
                        <div className="flex items-center justify-center w-12 h-12 transition-all border rounded-xl bg-zinc-900 border-zinc-800 mb-6 shadow-lg">
                            <Terminal className="w-6 h-6 text-zinc-300" />
                        </div>

                        {/* Headings */}
                        {verificationSent ? (
                            <>
                                <h2 className="text-xl font-semibold text-white mb-2 font-inter tracking-tight">Check your email</h2>
                                <p className="text-sm text-zinc-400 mb-6 text-center">We sent a verification link to <span className="text-white">{email}</span>.</p>
                                <button
                                    onClick={() => { setVerificationSent(false); setView("login"); }}
                                    className="w-full py-2.5 px-4 bg-white text-black text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors"
                                >
                                    Return to Log In
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-white mb-2 font-inter tracking-tight">
                                    {view === "login" ? "Sign in to Account" : "Create an Account"}
                                </h2>
                                <p className="text-sm text-zinc-400 mb-8 font-inter">
                                    {view === "login" ? "Sign in to your Account." : "Join ScholarSphere today."}
                                </p>

                                <form onSubmit={handleSubmit} className="w-full space-y-3">
                                    {error && (
                                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                                            {error}
                                        </div>
                                    )}

                                    {view === "signup" && (
                                        <input 
                                            type="text" 
                                            required 
                                            value={fullName} 
                                            onChange={(e) => setFullName(e.target.value)} 
                                            placeholder="Full Name" 
                                            className="w-full px-3 py-2.5 bg-black border border-[#27272a] rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-500" 
                                        />
                                    )}

                                    <input 
                                        type="email" 
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="name@work-email.com" 
                                        className="w-full px-3 py-2.5 bg-black border border-[#27272a] rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-500" 
                                    />
                                    
                                    <input 
                                        type="password" 
                                        required 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Password" 
                                        className="w-full px-3 py-2.5 bg-black border border-[#27272a] rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-500" 
                                    />

                                    <button
                                        type="submit"
                                        disabled={isAuthenticating}
                                        className="w-full py-2.5 mt-2 bg-white text-black hover:bg-zinc-200 transition-colors rounded-md text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        {isAuthenticating && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {view === "login" ? "Continue with Email" : "Sign Up"}
                                    </button>
                                </form>

                                {/* Mock Social Buttons */}
                                <div className="w-full mt-4 space-y-2">
                                    <button type="button" className="w-full py-2.5 bg-transparent border border-[#27272a] rounded-md text-sm text-zinc-300 font-medium hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                                        Continue with Google
                                    </button>
                                    <button type="button" className="w-full py-2.5 bg-transparent border border-[#27272a] rounded-md text-sm text-zinc-300 font-medium hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                        Continue with GitHub
                                    </button>
                                </div>

                                {/* Footer Linking */}
                                <div className="mt-8 text-center w-full border-t border-[#27272a]/50 pt-6">
                                    <p className="text-zinc-400 text-sm">
                                        {view === "login" ? "Don't have an account? " : "Already have an account? "}
                                        <button 
                                            type="button" 
                                            onClick={() => { setView(view === "login" ? "signup" : "login"); setError(null); }} 
                                            className="text-white hover:underline font-medium"
                                        >
                                            {view === "login" ? "Sign Up" : "Log In"}
                                        </button>
                                    </p>
                                    <p className="text-[11px] text-zinc-500 mt-6 leading-relaxed max-w-[300px] mx-auto">
                                        By proceeding, you agree to creating a ScholarSphere account subject to our <a href="#" className="text-zinc-300 hover:underline">Terms of Service</a> and <a href="#" className="text-zinc-300 hover:underline">Privacy Policy</a>.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}