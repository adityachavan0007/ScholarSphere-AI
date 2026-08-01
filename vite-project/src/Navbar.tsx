import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, User as UserIcon, Menu, X, BrainCircuit, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "./lib/supabaseClient";

// --- STRICT INTERFACES FOR PARENT ROUTING ---
interface NavbarProps {
  onOpenAuth: (view: "login" | "signup") => void;
  isLoggedIn: boolean;
  onNavigateProfile: () => void;
  onNavigateHome: () => void;
  onNavigateCopilot: () => void;
  onNavigateHackathons: () => void;
  onNavigateScholarships: () => void;
  onNavigateInternships: () => void;
}

export default function Navbar({
  onOpenAuth,
  isLoggedIn,
  onNavigateProfile,
  onNavigateHome,
  onNavigateCopilot,
  onNavigateHackathons,
  onNavigateScholarships,
  onNavigateInternships
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Unified routing array - keeps links clean and organized
  const navLinks = [
    { name: "/hackathons", action: onNavigateHackathons },
    { name: "/scholarships", action: onNavigateScholarships },
    { name: "/internships", action: onNavigateInternships },
  ];

  // REAL BACKEND SIGN OUT
  const handleSignOut = async () => {
    try {
      // App.tsx onAuthStateChange will catch this and route to home automatically
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl border rounded-full bg-[#09090b]/80 backdrop-blur-md border-zinc-800 transition-all shadow-lg">
      <div className="flex items-center justify-between h-14 px-4 mx-auto sm:px-6">

        {/* LOGO SECTION (Teleports to Home) */}
        <div onClick={onNavigateHome} className="flex items-center gap-2.5 cursor-pointer group">
          <div className="flex items-center justify-center w-8 h-8 transition-all border rounded-lg bg-zinc-900 border-zinc-800 group-hover:bg-zinc-800">
            <Terminal className="w-4 h-4 text-zinc-300" />
          </div>
          <span className="text-xl font-bold text-white font-outfit tracking-tight">
            Scholar<span className="text-zinc-500 font-light">Sphere</span>
          </span>
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        <div className="hidden gap-3 lg:gap-4 md:flex items-center text-sm font-medium text-zinc-400">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={link.action}
              className="transition-all px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
            >
              {link.name}
            </button>
          ))}

          {/* Spacer to separate primary links from tools */}
          <div className="w-px h-5 bg-white/10 mx-2"></div>

          {/* AI COPILOT LINK (Only visible if logged in) */}
          {isLoggedIn && (
            <button
              onClick={onNavigateCopilot}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-md border border-white/5 hover:border-white/10 hover:bg-white/10"
            >
              <BrainCircuit className="w-4 h-4" /> AI Copilot
            </button>
          )}
        </div>

        {/* AUTH / PROFILE SECTION */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => onOpenAuth("login")}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-zinc-800/50"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth("signup")}
                className="relative px-5 py-2 text-sm font-medium text-zinc-950 transition-all duration-300 bg-zinc-100 rounded-full hover:bg-white hover:scale-105"
              >
                <span className="relative z-10 font-bold">Sign Up</span>
              </button>
            </div>
          ) : (
            // --- NEW DESKTOP PROFILE DROPDOWN ---
            <div className="hidden sm:block relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white"
              >
                <UserIcon size={16} />
                <span>Profile</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-48 bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="flex flex-col p-1.5">
                      <button
                        onClick={() => {
                          onNavigateProfile();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-mono text-slate-300 hover:bg-white/5 hover:text-sky-400 rounded-lg transition-colors w-full text-left"
                      >
                        <UserIcon className="w-4 h-4" /> Visit Profile
                      </button>
                      <div className="w-full h-px bg-white/5 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-mono text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            className="p-2 text-slate-400 md:hidden hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0f18] border-b border-white/10 overflow-hidden font-mono text-sm shadow-2xl"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => { link.action(); setIsMenuOpen(false); }}
                  className="py-3 px-4 rounded-lg text-left transition-colors text-slate-300 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10"
                >
                  {link.name}
                </button>
              ))}

              <div className="h-px w-full bg-white/5 my-2"></div>

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => { onNavigateCopilot(); setIsMenuOpen(false); }}
                    className="text-left text-zinc-300 py-3 px-4 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 mb-2 hover:bg-white/10 hover:text-white"
                  >
                    <BrainCircuit className="w-4 h-4" /> AI Copilot
                  </button>
                  <button
                    onClick={() => { onNavigateProfile(); setIsMenuOpen(false); }}
                    className="text-left text-sky-400 py-3 px-4 rounded-lg hover:bg-white/5 flex items-center gap-2 transition-colors"
                  >
                    <UserIcon size={16} /> Visit Profile
                  </button>
                  <button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="text-left text-red-400 py-3 px-4 rounded-lg hover:bg-red-500/10 flex items-center gap-2 transition-colors mt-1"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => { onOpenAuth("login"); setIsMenuOpen(false); }}
                    className="text-center text-slate-300 py-3 rounded-lg hover:bg-white/5 border border-transparent transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { onOpenAuth("signup"); setIsMenuOpen(false); }}
                    className="text-center font-bold bg-sky-500/10 text-sky-400 py-3 rounded-lg border border-sky-500/30 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}