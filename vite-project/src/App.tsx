import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, FileText, LayoutDashboard, GraduationCap, Target,
  CheckCircle2, Code, Globe, Briefcase, ChevronDown, BrainCircuit,
  User as UserIcon, ArrowRight
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

// --- CUSTOM COMPONENTS ---
import Navbar from "./Navbar";
import AuthModal from "./AuthModal";
import LiveTicker from "./LiveTicker";
import TerminalDemo from "./TerminalDemo";
import Profile from "./Profile";
import AICopilot from "./AICopilot";
import Hackathons from "./Hackathons";
import Scholarships from "./Scholarships";
import Internships from "./Internships";

// --- TYPES ---
type PageState = "home" | "profile" | "copilot" | "hackathons" | "scholarships" | "internships";

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState<PageState>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("signup");

  // --- AUTH LISTENERS ---
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) setCurrentPage("profile");
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setCurrentPage("profile");
      } else {
        setCurrentPage("home");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- AUTH HANDLERS ---
  const handleOpenAuth = (view: "login" | "signup") => {
    setAuthView(view);
    setIsModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsModalOpen(false);
    // State will be updated by the listener
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // ==========================================
  // VIEW ROUTING ENGINE
  // ==========================================
  const renderCurrentPage = () => {

    // 1. PROFILE PAGE
    if (currentPage === "profile") {
      return (
        <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
          <Profile />
          <div className="fixed bottom-6 right-6 z-50">
            <button onClick={handleSignOut} className="px-4 py-2 font-mono text-xs text-red-400 bg-red-900/10 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition-colors shadow-[0_0_15px_rgba(153,27,27,0.3)]">
              sudo kill_session (Sign Out)
            </button>
          </div>
        </div>
      );
    }

    // 2. AI COPILOT PAGE
    if (currentPage === "copilot") {
      return (
        <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
          <AICopilot />
          <div className="fixed bottom-6 right-6 z-50 lg:hidden">
            <button onClick={handleSignOut} className="px-4 py-2 font-mono text-xs text-red-400 bg-red-900/10 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition-colors shadow-[0_0_15px_rgba(153,27,27,0.3)]">
              Sign Out
            </button>
          </div>
        </div>
      );
    }

    // 3. HACKATHONS PAGE
    if (currentPage === "hackathons") {
      return (
        <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
          <Hackathons />
          {isLoggedIn && (
            <div className="fixed bottom-6 right-6 z-50 lg:hidden">
              <button onClick={handleSignOut} className="px-4 py-2 font-mono text-xs text-red-400 bg-red-900/10 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition-colors shadow-[0_0_15px_rgba(153,27,27,0.3)]">
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    // 4. SCHOLARSHIPS PAGE
    if (currentPage === "scholarships") {
      return (
        <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
          <Scholarships />
          {isLoggedIn && (
            <div className="fixed bottom-6 right-6 z-50 lg:hidden">
              <button onClick={handleSignOut} className="px-4 py-2 font-mono text-xs text-red-400 bg-red-900/10 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition-colors shadow-[0_0_15px_rgba(153,27,27,0.3)]">
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    // 5. INTERNSHIPS PAGE
    if (currentPage === "internships") {
      return (
        <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
          <Internships />
          {isLoggedIn && (
            <div className="fixed bottom-6 right-6 z-50 lg:hidden">
              <button onClick={handleSignOut} className="px-4 py-2 font-mono text-xs text-red-400 bg-red-900/10 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition-colors shadow-[0_0_15px_rgba(153,27,27,0.3)]">
                Sign Out
              </button>
            </div>
          )}
        </div>
      );
    }

    // 6. HOME PAGE (Default)
    return (
      <div className="relative w-full bg-[#030712] flex flex-col items-center overflow-x-hidden selection:bg-sky-500/30 font-sans">

        {/* Floating Animated Background Orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15], x: [0, 40, 0], y: [0, -50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-sky-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1], x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

        {/* --- FULL SCREEN HERO SECTION --- */}
        <div className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 20 }} className="w-full max-w-5xl space-y-8 text-center">

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sky-300 text-xs sm:text-sm font-medium mb-4 shadow-[0_0_30px_rgba(56,189,248,0.1)] backdrop-blur-md">
              <GraduationCap className="w-4 h-4" />
              <span>Built for Indian Undergraduates</span>
            </motion.div>

            <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} className="py-2 text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl md:text-8xl bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 drop-shadow-[0_0_40px_rgba(56,189,248,0.3)] leading-tight font-mono">
              ScholarSphere AI
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="px-4 text-xl font-semibold sm:text-2xl md:text-3xl text-slate-200">
              Your AI copilot for scholarships, hackathons and internships.
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="max-w-2xl px-4 mx-auto text-base leading-relaxed sm:text-lg text-slate-400">
              Stop endlessly scrolling through portals. We match you with the best opportunities based on your profile and even help you draft the perfect application.
            </motion.p>

            {/* DYNAMIC CALL TO ACTION BUTTONS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
              {!isLoggedIn ? (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleOpenAuth("signup")} className="group inline-flex items-center gap-2 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold text-base sm:text-lg rounded-full shadow-[0_0_40px_rgba(2,132,199,0.5)] hover:shadow-[0_0_60px_rgba(2,132,199,0.7)] border border-white/10 transition-all font-mono">
                  Initialize Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              ) : (
                <>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage("copilot")} className="group flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold text-base sm:text-lg rounded-full shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] border border-purple-500/30 transition-all font-mono">
                    <BrainCircuit className="w-5 h-5 animate-pulse" /> Launch Copilot <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentPage("profile")} className="flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#21262d] text-slate-200 font-bold text-base sm:text-lg rounded-full border border-[#30363d] hover:bg-[#30363d] hover:text-white transition-all font-mono shadow-xl">
                    <UserIcon className="w-5 h-5" /> View Profile
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>

          <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="absolute flex flex-col items-center gap-2 bottom-10 text-slate-500 opacity-70">
            <span className="text-xs font-medium tracking-widest uppercase font-mono">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>

        {/* --- LIVE TICKER --- */}
        <div className="w-full z-20 relative">
          <LiveTicker />
        </div>

        {/* --- CONTENT BELOW THE FOLD --- */}
        <div className="relative z-10 flex flex-col items-center w-full px-4 pb-32 sm:px-6 lg:px-8">

          <TerminalDemo />

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="grid w-full max-w-6xl grid-cols-1 gap-6 mt-20 md:grid-cols-3 sm:gap-8">

            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} whileHover={{ y: -8, scale: 1.02 }} className="bg-[#0d1117] p-6 sm:p-8 rounded-2xl border border-[#30363d] hover:border-sky-500/50 transition-all group shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center mb-6 transition-transform duration-300 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#21262d] border border-[#30363d] group-hover:scale-110 group-hover:rotate-3 group-hover:border-sky-500/30 group-hover:bg-sky-500/10 relative z-10">
                <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-sky-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl font-mono relative z-10">0-100 Fit Scoring</h3>
              <p className="text-sm leading-relaxed sm:text-base text-slate-400 relative z-10 group-hover:text-slate-300 transition-colors">Discover opportunities ranked by an AI fit score tailored entirely to your unique student profile.</p>
            </motion.div>

            <motion.div onClick={() => isLoggedIn ? setCurrentPage("copilot") : handleOpenAuth("signup")} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} whileHover={{ y: -8, scale: 1.02 }} className={`bg-[#0d1117] p-6 sm:p-8 rounded-2xl border border-[#30363d] hover:border-purple-500/50 transition-all group shadow-2xl relative overflow-hidden ${isLoggedIn ? 'cursor-pointer' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center mb-6 transition-transform duration-300 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#21262d] border border-[#30363d] group-hover:scale-110 group-hover:-rotate-3 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 relative z-10">
                <BrainCircuit className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl font-mono relative z-10">AI Copilot</h3>
              <p className="text-sm leading-relaxed sm:text-base text-slate-400 relative z-10 mb-4 group-hover:text-slate-300 transition-colors">Beat writer's block. Generate personalized draft answers for common application questions.</p>
              {isLoggedIn && <span className="text-xs font-mono text-purple-400 group-hover:text-purple-300 flex items-center gap-1 transition-colors">Launch Now <ChevronDown className="w-3 h-3 -rotate-90" /></span>}
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } }} whileHover={{ y: -8, scale: 1.02 }} className="bg-[#0d1117] p-6 sm:p-8 rounded-2xl border border-[#30363d] hover:border-indigo-500/50 transition-all group shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center mb-6 transition-transform duration-300 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#21262d] border border-[#30363d] group-hover:scale-110 group-hover:rotate-3 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 relative z-10">
                <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl font-mono relative z-10">Easy Tracking</h3>
              <p className="text-sm leading-relaxed sm:text-base text-slate-400 relative z-10 group-hover:text-slate-300 transition-colors">Keep your hunt organized. Save interesting opportunities and track what you've applied to.</p>
            </motion.div>

          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, type: "spring", bounce: 0.3 }} className="w-full max-w-5xl mt-32 text-center">
            <h2 className="mb-16 text-3xl font-bold text-white sm:text-4xl md:text-5xl font-mono">How ScholarSphere Works</h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3 sm:gap-8 relative">

              <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px bg-gradient-to-r from-sky-500/10 via-indigo-500/30 to-purple-500/10 -z-10"></div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex flex-col items-center group">
                <div className="flex items-center justify-center w-16 h-16 mb-6 border rounded-full sm:w-20 sm:h-20 bg-[#0d1117] border-[#30363d] group-hover:border-sky-500/50 group-hover:bg-sky-500/10 transition-all shadow-xl relative">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400 group-hover:scale-110 transition-transform" />
                  <div className="absolute -bottom-3 bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">01</div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white sm:text-xl font-mono">Build Profile</h3>
                <p className="px-4 text-sm text-slate-400 sm:text-base group-hover:text-slate-300 transition-colors">Enter your degree, CGPA, and interests.</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex flex-col items-center group">
                <div className="flex items-center justify-center w-16 h-16 mb-6 border rounded-full sm:w-20 sm:h-20 bg-[#0d1117] border-[#30363d] group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all shadow-xl relative">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div className="absolute -bottom-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">02</div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white sm:text-xl font-mono">Get Matched</h3>
                <p className="px-4 text-sm text-slate-400 sm:text-base group-hover:text-slate-300 transition-colors">AI filters the database and assigns a fit score.</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex flex-col items-center group">
                <div className="flex items-center justify-center w-16 h-16 mb-6 border rounded-full sm:w-20 sm:h-20 bg-[#0d1117] border-[#30363d] group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all shadow-xl relative">
                  <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div className="absolute -bottom-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">03</div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white sm:text-xl font-mono">Draft & Apply</h3>
                <p className="px-4 text-sm text-slate-400 sm:text-base group-hover:text-slate-300 transition-colors">Generate answers and track applications.</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, type: "spring" }} className="w-full max-w-4xl mt-32 text-center">
            <h3 className="mb-8 text-xl font-bold text-white sm:text-2xl font-mono">Curated Opportunities Across Top Domains</h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <motion.span whileHover={{ y: -4, scale: 1.05, backgroundColor: "rgba(56,189,248,0.1)", borderColor: "rgba(56,189,248,0.5)", color: "#38bdf8" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-6 sm:py-3 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono shadow-lg"><Code className="w-4 h-4" /> AI/ML</motion.span>
              <motion.span whileHover={{ y: -4, scale: 1.05, backgroundColor: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.5)", color: "#3b82f6" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-6 sm:py-3 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono shadow-lg"><Globe className="w-4 h-4" /> SDE/Web</motion.span>
              <motion.span whileHover={{ y: -4, scale: 1.05, backgroundColor: "rgba(99,102,241,0.1)", borderColor: "rgba(99,102,241,0.5)", color: "#6366f1" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-6 sm:py-3 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono shadow-lg"><LayoutDashboard className="w-4 h-4" /> Data/Analytics</motion.span>
              <motion.span whileHover={{ y: -4, scale: 1.05, backgroundColor: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.5)", color: "#a855f7" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-6 sm:py-3 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono shadow-lg"><Target className="w-4 h-4" /> Core Engineering</motion.span>
              <motion.span whileHover={{ y: -4, scale: 1.05, backgroundColor: "rgba(236,72,153,0.1)", borderColor: "rgba(236,72,153,0.5)", color: "#ec4899" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-6 sm:py-3 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono shadow-lg"><Briefcase className="w-4 h-4" /> Management</motion.span>
            </div>
          </motion.div>

        </div>
      </div>
    );
  };

  return (
    <>
      {/* GLOBAL NAVBAR */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        isLoggedIn={isLoggedIn}
        onNavigateProfile={() => setCurrentPage("profile")}
        onNavigateHome={() => setCurrentPage("home")}
        onNavigateCopilot={() => setCurrentPage("copilot")}
        onNavigateHackathons={() => setCurrentPage("hackathons")}
        onNavigateScholarships={() => setCurrentPage("scholarships")}
        onNavigateInternships={() => setCurrentPage("internships")}
      />

      {/* RENDER THE CURRENT PAGE */}
      {renderCurrentPage()}

      {/* GLOBAL AUTH MODAL */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialView={authView}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}