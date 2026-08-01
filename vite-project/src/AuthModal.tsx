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

    const handleOAuthLogin = async (provider: 'google' | 'github') => {
        setIsAuthenticating(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || `Failed to log in with ${provider}`);
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