import { Terminal, User as UserIcon, Menu, X, BrainCircuit } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
    onOpenAuth: (view: "login" | "signup") => void;
    isLoggedIn: boolean;
    onNavigateProfile: () => void;
    onNavigateHome: () => void;
    onNavigateCopilot: () => void; // <--- NEW PROP
}

export default function Navbar({ onOpenAuth, isLoggedIn, onNavigateProfile, onNavigateHome, onNavigateCopilot }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: "/hackathons", href: "#" },
        { name: "/scholarships", href: "#" },
        { name: "/internships", href: "#" },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full border-b bg-[#030712]/80 backdrop-blur-md border-white/5">
            <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

                {/* LOGO SECTION */}
                <div onClick={onNavigateHome} className="flex items-center gap-2 cursor-pointer group">
                    <div className="flex items-center justify-center w-8 h-8 transition-all border rounded-lg bg-sky-500/10 border-sky-500/30 group-hover:bg-sky-500/20">
                        <Terminal className="w-4 h-4 text-sky-400" />
                    </div>
                    <span className="text-xl font-bold text-white font-mono tracking-tight">Scholar<span className="text-sky-400">Sphere</span></span>
                </div>

                {/* DESKTOP LINKS */}
                <div className="hidden gap-6 lg:gap-8 md:flex text-sm font-medium font-mono text-slate-400">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="transition-colors hover:text-sky-400">{link.name}</a>
                    ))}

                    {/* THE NEW COPILOT NAVIGATION LINK */}
                    {isLoggedIn && (
                        <button onClick={onNavigateCopilot} className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors">
                            <BrainCircuit className="w-4 h-4 animate-pulse" /> /ai_copilot
                        </button>
                    )}
                </div>

                {/* AUTH / PROFILE SECTION */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button onClick={() => onOpenAuth("login")} className="hidden sm:block text-sm font-mono font-medium text-slate-300 hover:text-white transition-colors">Log In</button>
                            <button onClick={() => onOpenAuth("signup")} className="relative px-4 py-2 sm:px-5 text-sm font-mono font-medium text-white transition-all duration-300 border border-sky-500/50 rounded-lg group bg-sky-500/10 hover:bg-sky-500/20">Sign Up</button>
                        </div>
                    ) : (
                        <button onClick={onNavigateProfile} className="flex items-center gap-2 px-3 py-2 sm:px-4 text-sm font-mono font-medium text-sky-400 transition-all border border-sky-500/30 rounded-lg bg-sky-500/5 hover:bg-sky-500/10">
                            <UserIcon size={16} /> ~/profile
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}