import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  LayoutDashboard,
  GraduationCap,
  Target,
  CheckCircle2,
  Code,
  Globe,
  Briefcase,
  ChevronDown
} from "lucide-react";

// Your Custom Components
import Navbar from "./Navbar";
import AuthModal from "./AuthModal";
import LiveTicker from "./LiveTicker";
import TerminalDemo from "./TerminalDemo";
import Profile from "./Profile";

export default function Home() {
  // --- STATE MANAGEMENT ---
  // Controls which page is currently visible
  const [currentPage, setCurrentPage] = useState<"home" | "profile">("home");

  // NEW: Tracks if the user is authenticated to update the Navbar UI
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State for the Developer Auth Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("signup");

  // --- HANDLERS ---
  // Function to handle opening the modal from anywhere
  const handleOpenAuth = (view: "login" | "signup") => {
    setAuthView(view);
    setIsModalOpen(true);
  };

  // Function called when the Modal reports a successful login/signup
  const handleAuthSuccess = () => {
    setIsLoggedIn(true); // User is now logged in
    setIsModalOpen(false); // Close the modal
    setCurrentPage("profile"); // Auto-teleport to the profile page
  };

  const handleSignOut = () => {
    setIsLoggedIn(false); // User is logged out
    setCurrentPage("home"); // Return to landing page
  };

  // ==========================================
  // VIEW 1: THE PROFILE PAGE
  // ==========================================
  if (currentPage === "profile") {
    return (
      <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
        {/* Navbar now receives isLoggedIn state and navigation logic */}
        <Navbar
          onOpenAuth={handleOpenAuth}
          isLoggedIn={isLoggedIn}
          onNavigateProfile={() => setCurrentPage("profile")}
        />

        {/* Render the high-end Developer Profile */}
        <Profile />

        {/* Sign Out Trigger (Optional/Testing) */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 font-mono text-xs text-red-400 bg-red-900/10 border border-red-900/50 rounded-lg hover:bg-red-900/30 transition-colors shadow-2xl"
          >
            sudo kill_session (Sign Out)
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE HOME PAGE
  // ==========================================
  return (
    <div className="relative w-full bg-[#030712] flex flex-col items-center overflow-x-hidden selection:bg-sky-500/30 font-sans">

      {/* 1. Navbar - Top Navigation with Login state */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        isLoggedIn={isLoggedIn}
        onNavigateProfile={() => setCurrentPage("profile")}
      />

      {/* 2. Smooth Infinite Floating Animated Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 30, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-sky-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      {/* --- 3. FULL SCREEN HERO SECTION --- */}
      <div className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 pt-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 70, damping: 20 }}
          className="w-full max-w-4xl space-y-8 text-center"
        >
          {/* Target Audience Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sky-300 text-xs sm:text-sm font-medium mb-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Built for Indian Undergraduates</span>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="py-2 text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-8xl bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 drop-shadow-[0_0_30px_rgba(56,189,248,0.4)] leading-tight font-mono"
          >
            ScholarSphere AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="px-4 text-xl font-semibold sm:text-2xl md:text-3xl text-slate-200"
          >
            Your AI copilot for scholarships, hackathons and internships.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-2xl px-4 mx-auto text-base leading-relaxed sm:text-lg text-slate-400"
          >
            Stop endlessly scrolling through portals. We match you with the best opportunities based on your profile and even help you draft the perfect application.
          </motion.p>

          {/* Call to Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-8"
          >
            <button
              onClick={() => handleOpenAuth("signup")}
              className="inline-block px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold text-base sm:text-lg rounded-full shadow-[0_0_40px_rgba(2,132,199,0.5)] hover:shadow-[0_0_60px_rgba(2,132,199,0.7)] border border-white/10 transition-all font-mono"
            >
              Initialize Account
            </button>
          </motion.div>
        </motion.div>

        {/* Bouncing Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute flex flex-col items-center gap-2 bottom-10 text-slate-500 opacity-70"
        >
          <span className="text-xs font-medium tracking-widest uppercase font-mono">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* --- 4. FOMO LIVE TICKER --- */}
      <div className="w-full z-20 relative">
        <LiveTicker />
      </div>

      {/* --- 5. CONTENT BELOW THE FOLD --- */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 pb-32 sm:px-6 lg:px-8">

        {/* The Interactive Terminal Demo */}
        <TerminalDemo />

        {/* Feature Cards Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="grid w-full max-w-6xl grid-cols-1 gap-6 mt-12 md:grid-cols-3 sm:gap-8"
        >
          {/* Card 1: Match */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-[#0d1117] p-6 sm:p-8 rounded-2xl border border-[#30363d] hover:border-sky-500/50 transition-all group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-center mb-6 transition-transform duration-300 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#21262d] border border-[#30363d] group-hover:scale-110 group-hover:rotate-3 relative z-10">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-sky-400" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl font-mono relative z-10">0-100 Fit Scoring</h3>
            <p className="text-sm leading-relaxed sm:text-base text-slate-400 relative z-10">Discover opportunities ranked by an AI fit score tailored entirely to your unique student profile.</p>
          </motion.div>

          {/* Card 2: Copilot */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-[#0d1117] p-6 sm:p-8 rounded-2xl border border-[#30363d] hover:border-blue-500/50 transition-all group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-center mb-6 transition-transform duration-300 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#21262d] border border-[#30363d] group-hover:scale-110 group-hover:-rotate-3 relative z-10">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl font-mono relative z-10">AI Copilot</h3>
            <p className="text-sm leading-relaxed sm:text-base text-slate-400 relative z-10">Beat writer's block. Generate personalized draft answers for common application questions.</p>
          </motion.div>

          {/* Card 3: Tracking */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-[#0d1117] p-6 sm:p-8 rounded-2xl border border-[#30363d] hover:border-indigo-500/50 transition-all group shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-center mb-6 transition-transform duration-300 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#21262d] border border-[#30363d] group-hover:scale-110 group-hover:rotate-3 relative z-10">
              <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white sm:text-2xl font-mono relative z-10">Easy Tracking</h3>
            <p className="text-sm leading-relaxed sm:text-base text-slate-400 relative z-10">Keep your hunt organized. Save interesting opportunities and track what you've applied to.</p>
          </motion.div>
        </motion.div>

        {/* How it Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="w-full max-w-5xl mt-32 text-center"
        >
          <h2 className="mb-12 text-3xl font-bold text-white sm:text-4xl md:text-5xl sm:mb-16 font-mono">How ScholarSphere Works</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 sm:gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 border rounded-full sm:w-20 sm:h-20 bg-sky-500/10 border-sky-500/30 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white sm:text-xl font-mono">1. Build Profile</h3>
              <p className="px-4 text-sm text-slate-400 sm:text-base">Enter your degree, CGPA, and interests.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 border rounded-full sm:w-20 sm:h-20 bg-blue-500/10 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white sm:text-xl font-mono">2. Get Matched</h3>
              <p className="px-4 text-sm text-slate-400 sm:text-base">AI filters the database and assigns a fit score.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 border rounded-full sm:w-20 sm:h-20 bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white sm:text-xl font-mono">3. Draft & Apply</h3>
              <p className="px-4 text-sm text-slate-400 sm:text-base">Generate answers and track applications.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Domains Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-4xl mt-32 text-center"
        >
          <h3 className="mb-8 text-xl font-bold text-white sm:text-2xl font-mono">Curated Opportunities Across Top Domains</h3>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <motion.span whileHover={{ y: -3, backgroundColor: "#21262d", borderColor: "#30363d", color: "white" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-5 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono">
              <Code className="w-4 h-4" /> AI/ML
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "#21262d", borderColor: "#30363d", color: "white" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-5 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono">
              <Globe className="w-4 h-4" /> SDE/Web
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "#21262d", borderColor: "#30363d", color: "white" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-5 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono">
              <LayoutDashboard className="w-4 h-4" /> Data/Analytics
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "#21262d", borderColor: "#30363d", color: "white" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-5 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono">
              <Target className="w-4 h-4" /> Core Engineering
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "#21262d", borderColor: "#30363d", color: "white" }} className="flex items-center gap-2 px-4 py-2 text-sm transition-colors border rounded-full cursor-default sm:px-5 bg-[#0d1117] border-[#30363d] text-slate-300 sm:text-base font-mono">
              <Briefcase className="w-4 h-4" /> Management
            </motion.span>
          </div>
        </motion.div>

      </div>

      {/* 6. The Developer AuthModal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialView={authView}
        onSuccess={handleAuthSuccess} // Passing the logic to trigger the profile transition
      />

    </div>
  );
} 