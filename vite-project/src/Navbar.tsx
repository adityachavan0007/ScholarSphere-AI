import { Terminal, User as UserIcon } from "lucide-react";

interface NavbarProps {
    onOpenAuth: (view: "login" | "signup") => void;
    isLoggedIn: boolean; // New prop
    onNavigateProfile: () => void; // New prop to go to profile
}

export default function Navbar({ onOpenAuth, isLoggedIn, onNavigateProfile }: NavbarProps) {
    return (
        <nav className="fixed top-0 z-40 w-full border-b bg-[#030712]/80 backdrop-blur-md border-white/5">
            <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

                {/* Logo */}
                <div
                    onClick={() => window.location.href = '/'}
                    className="flex items-center gap-2 cursor-pointer group"
                >
                    <div className="flex items-center justify-center w-8 h-8 transition-all border rounded-lg bg-sky-500/10 border-sky-500/30 group-hover:bg-sky-500/20">
                        <Terminal className="w-4 h-4 text-sky-400" />
                    </div>
                    <span className="text-xl font-bold text-white font-mono tracking-tight">
                        Scholar<span className="text-sky-400">Sphere</span>
                    </span>
                </div>

                {/* Desktop Links */}
                <div className="hidden gap-8 md:flex text-sm font-medium font-mono text-slate-400">
                    <a href="#" className="hover:text-sky-400 transition-colors">/hackathons</a>
                    <a href="#" className="hover:text-sky-400 transition-colors">/scholarships</a>
                </div>

                {/* Dynamic Auth Section */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <>
                            <button
                                onClick={() => onOpenAuth("login")}
                                className="text-sm font-mono font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Log In
                            </button>

                            <button
                                onClick={() => onOpenAuth("signup")}
                                className="relative px-5 py-2 text-sm font-mono font-medium text-white transition-all duration-300 border border-sky-500/50 rounded-lg group hover:border-sky-400 bg-sky-500/10"
                            >
                                <span className="relative z-10">Sign Up</span>
                                <div className="absolute inset-0 w-full h-full transition-all duration-300 rounded-lg opacity-0 bg-sky-400/20 group-hover:opacity-100 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"></div>
                            </button>
                        </>
                    ) : (
                        /* Show this when logged in */
                        <button
                            onClick={onNavigateProfile}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-mono font-medium text-sky-400 transition-all border border-sky-500/30 rounded-lg bg-sky-500/5 hover:bg-sky-500/10"
                        >
                            <UserIcon size={16} />
                            <span>~/profile</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}