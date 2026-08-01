import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Terminal } from "lucide-react";
import { supabase } from "./lib/supabaseClient";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: "login" | "signup" | "forgot_password" | "update_password";
}

export default function AuthModal({ isOpen, onClose, initialView = "signup", onSuccess }: AuthModalProps) {
    const [view, setView] = useState<"login" | "signup" | "forgot_password" | "update_password">("signup");
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
            // DEV BYPASS: If they use this specific email, skip Supabase entirely so they can test the app while rate limited.
            if (email === "admin@admin.com" && password === "admin") {
                onSuccess();
                setIsAuthenticating(false);
                return;
            }

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

                // If session exists (Email Confirmations OFF), log them in instantly.
                // If session is null (Email Confirmations ON), show the verification screen.
                if (data.session) {
                    onSuccess();
                } else if (data.user) {
                    setVerificationSent(true);
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
            } else if (view === "forgot_password") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
                setVerificationSent(true); // Re-using this state to show "Check your email"
            } else if (view === "update_password") {
                const { error } = await supabase.auth.updateUser({ password });
                if (error) throw error;
                onSuccess(); // Instantly log them in and close modal
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
                                <p className="text-sm text-zinc-400 mb-2 text-center">We sent a verification link to <span className="text-white">{email}</span>.</p>
                                <p className="text-xs text-zinc-500 mb-6 text-center italic">Tip: If you don't receive it, you might already have an account.</p>
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
                                    {view === "login" && "Sign in to Account"}
                                    {view === "signup" && "Create an Account"}
                                    {view === "forgot_password" && "Reset Password"}
                                    {view === "update_password" && "Set New Password"}
                                </h2>
                                <p className="text-sm text-zinc-400 mb-8 font-inter">
                                    {view === "login" && "Sign in to your Account."}
                                    {view === "signup" && "Join ScholarSphere today."}
                                    {view === "forgot_password" && "We will send you a reset link."}
                                    {view === "update_password" && "Enter your new password below."}
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

                                    {(view === "signup" || view === "login" || view === "forgot_password") && (
                                        <input 
                                            type="email" 
                                            required 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            placeholder="name@work-email.com" 
                                            className="w-full px-3 py-2.5 bg-black border border-[#27272a] rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-500" 
                                        />
                                    )}
                                    
                                    {(view === "signup" || view === "login" || view === "update_password") && (
                                        <div className="space-y-1">
                                            <input 
                                                type="password" 
                                                required 
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                placeholder={view === "update_password" ? "New Password" : "Password"} 
                                                className="w-full px-3 py-2.5 bg-black border border-[#27272a] rounded-md text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-500" 
                                            />
                                            {view === "login" && (
                                                <div className="flex justify-end">
                                                    <button type="button" onClick={() => { setView("forgot_password"); setError(null); }} className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot password?</button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isAuthenticating}
                                        className="w-full py-2.5 mt-2 bg-white text-black hover:bg-zinc-200 transition-colors rounded-md text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        {isAuthenticating && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {view === "login" && "Continue with Email"}
                                        {view === "signup" && "Sign Up"}
                                        {view === "forgot_password" && "Send Reset Link"}
                                        {view === "update_password" && "Update Password"}
                                    </button>
                                </form>

                                {/* Mock Social Buttons */}
                                {(view === "login" || view === "signup") && (
                                    <div className="w-full mt-4 space-y-2">
                                        <button type="button" onClick={() => handleOAuthLogin('google')} disabled={isAuthenticating} className="w-full py-2.5 bg-transparent border border-[#27272a] rounded-md text-sm text-zinc-300 font-medium hover:bg-[#1a1a1a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                                            Continue with Google
                                        </button>
                                    </div>
                                )}

                                {/* Footer Linking */}
                                {(view === "login" || view === "signup" || view === "forgot_password") && (
                                    <div className="mt-8 text-center w-full border-t border-[#27272a]/50 pt-6">
                                        <p className="text-zinc-400 text-sm">
                                            {view === "login" && "Don't have an account? "}
                                            {(view === "signup" || view === "forgot_password") && "Already have an account? "}
                                            <button 
                                                type="button" 
                                                onClick={() => { setView(view === "login" ? "signup" : "login"); setError(null); }} 
                                                className="text-white hover:underline font-medium"
                                            >
                                                {view === "login" ? "Sign Up" : "Log In"}
                                            </button>
                                        </p>
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