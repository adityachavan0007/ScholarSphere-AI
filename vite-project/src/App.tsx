import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, FileText, LayoutDashboard, GraduationCap, Target,
  CheckCircle2, Code, Globe, Briefcase, ChevronDown, BrainCircuit,
  User as UserIcon, ArrowRight, Loader2, ChevronRight, Terminal
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

// --- CUSTOM COMPONENTS ---
import Navbar from "./Navbar";
import AuthModal from "./AuthModal";
import TerminalDemo from "./TerminalDemo";
import Profile from "./Profile";
import AICopilot from "./AICopilot";
import Hackathons from "./Hackathons";
import Scholarships from "./Scholarships";
import Internships from "./Internships";

// --- TYPES ---
type PageState = "home" | "profile" | "copilot" | "hackathons" | "scholarships" | "internships";

export default function App() {
  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState<PageState>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("signup");

  // --- QUICK PROMPT STATE ---
  const [initialAiPrompt, setInitialAiPrompt] = useState("");
  const [quickPromptText, setQuickPromptText] = useState("");

  // --- CRASH-PROOF AUTH LISTENERS ---
  useEffect(() => {
    let authSubscription: any = null;

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) setIsLoggedIn(true);

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setIsLoggedIn(!!session);
        });
        authSubscription = data.subscription;
      } catch (error) {
        console.error("Supabase Connection Error:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    initAuth();

    return () => {
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  // Kick back to home if user logs out while on a private page
  useEffect(() => {
    if (!isLoggedIn && (currentPage === "profile" || currentPage === "copilot")) {
      setCurrentPage("home");
    }
  }, [isLoggedIn, currentPage]);

  // --- HANDLERS ---
  const handleOpenAuth = (view: "login" | "signup") => {
    setAuthView(view);
    setIsModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false);
    setCurrentPage("profile"); // Takes them to profile after they log in
  };

  // ==========================================
  // THE SECURITY CHECKPOINT
  // ==========================================
  const handleSecureNavigation = (targetPage: PageState) => {
    if (isLoggedIn) {
      setCurrentPage(targetPage); // Let them through
    } else {
      handleOpenAuth("login"); // Block them and force the Login popup
    }
  };

  const handleQuickPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      handleOpenAuth("login"); // Block the quick prompt if not logged in
      return;
    }
    if (quickPromptText.trim()) {
      setInitialAiPrompt(quickPromptText);
      setCurrentPage("copilot");
      setQuickPromptText("");
    }
  };

  const handleTerminalExecute = (prompt: string) => {
    if (!isLoggedIn) {
      handleOpenAuth("login");
      return;
    }
    setInitialAiPrompt(`Analyze these skills and find matches: ${prompt}`);
    setCurrentPage("copilot");
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center font-mono text-sky-500">
        <Loader2 className="w-6 h-6 animate-spin mr-3" /> Establishing Secure Connection...
      </div>
    );
  }

  // --- SLEEK GLOBAL FOOTER ---
  const Footer = () => (
    <footer className="w-full py-8 mt-auto border-t bg-[#030712] border-white/5 z-10 relative">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white tracking-wide">Scholar<span className="text-sky-400">Sphere</span></span>
        </div>
        <p className="text-xs text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} ScholarSphere AI. All rights reserved.
        </p>
      </div>
    </footer>
  );

  // ==========================================
  // VIEW ROUTING ENGINE
  // ==========================================
  const renderCurrentPage = () => {
    // App Interfaces (No Footer needed here as they are full-screen apps)
    if (currentPage === "profile") {
      return (
        <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
          <Profile />
        </div>
      );
    }

    if (currentPage === "copilot") {
      return (
        <div className="relative w-full min-h-screen bg-[#030712] flex flex-col font-sans">
          <AICopilot initialPrompt={initialAiPrompt} />
        </div>
      );
    }

    // Directory Pages (With Footer)
    if (currentPage === "hackathons") return <div className="relative flex flex-col min-h-screen"><Hackathons /><Footer /></div>;
    if (currentPage === "scholarships") return <div className="relative flex flex-col min-h-screen"><Scholarships /><Footer /></div>;
    if (currentPage === "internships") return <div className="relative flex flex-col min-h-screen"><Internships /><Footer /></div>;

    // HOME PAGE
    return (
      <div className="relative flex flex-col min-h-screen w-full bg-[#000000] items-center overflow-x-hidden selection:bg-purple-500/30 font-sans">
        
        {/* Sleek Noise / Mesh Overlay (No Lag) */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen z-0"></div>

        <div className="relative z-10 w-full flex flex-col items-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* HERO SECTION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              ScholarSphere AI 2.0 is Live
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tighter text-white leading-[1.1] mb-6">
              Automate your <br className="hidden sm:block" />
              <span className="glow-text">academic journey.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 font-light mb-10 leading-relaxed">
              Stop endlessly scrolling through portals. We match you with the best opportunities based on your profile and help you draft the perfect application. No code required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!isLoggedIn ? (
                <button onClick={() => handleOpenAuth("signup")} className="pill-button bg-white text-black hover:bg-slate-200 flex items-center gap-2 px-8 py-3.5 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                  Start Building <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button onClick={() => { setInitialAiPrompt(""); setCurrentPage("copilot"); }} className="pill-button bg-white text-black hover:bg-slate-200 flex items-center gap-2 px-8 py-3.5 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                    Launch Copilot <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentPage("profile")} className="pill-button bg-white/5 text-white hover:bg-white/10 border border-white/10 flex items-center gap-2 px-8 py-3.5">
                    View Profile
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* BENTO GRID SECTION */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="w-full grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 auto-rows-[300px]">
            
            {/* Bento Item 1 - Large Search (Spans 2 cols) */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-card md:col-span-2 relative p-8 flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-50"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">0-100 Fit Scoring</h3>
                <p className="text-slate-400 font-light">AI analyzes your profile and automatically ranks the best hackathons and scholarships for your exact tech stack.</p>
              </div>
              <div className="relative z-10 w-full h-24 mt-6 bg-[#111] rounded-xl border border-white/5 overflow-hidden flex flex-col justify-end px-4 pb-4">
                 <div className="w-full h-8 bg-white/5 rounded flex items-center px-3 gap-2">
                    <Search className="w-4 h-4 text-slate-500" />
                    <div className="w-32 h-2 bg-slate-600/50 rounded-full"></div>
                 </div>
              </div>
            </motion.div>

            {/* Bento Item 2 - AI Copilot */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-card relative p-8 flex flex-col justify-between group">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 transition-opacity group-hover:opacity-100 opacity-50"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <BrainCircuit className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2 tracking-tight">AI Copilot Engine</h3>
                <p className="text-slate-400 font-light text-sm mb-6">Command your personal AI to draft cover letters instantly.</p>
              </div>
              <form onSubmit={handleQuickPrompt} className="relative z-10 mt-auto">
                <div className="relative flex items-center bg-black border border-white/10 rounded-lg p-1 focus-within:border-purple-500/50 transition-colors">
                  <input type="text" value={quickPromptText} onChange={(e) => setQuickPromptText(e.target.value)} placeholder="Type command..." className="w-full bg-transparent pl-3 pr-2 py-1.5 text-xs text-white focus:outline-none" onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); handleOpenAuth("login"); } }} />
                  <button type="submit" className="p-1.5 bg-white/10 rounded text-white hover:bg-white/20 transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Bento Item 3 - Tracking */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-card relative p-8 flex flex-col justify-between group">
              <div className="absolute top-0 left-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] -translate-y-1/2 -translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-50"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <LayoutDashboard className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2 tracking-tight">Easy Tracking</h3>
                <p className="text-slate-400 font-light text-sm">Save interesting opportunities and track what you've applied to in one unified dashboard.</p>
              </div>
            </motion.div>

            {/* Bento Item 4 - Terminal Demo (Spans 2 cols) */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bento-card md:col-span-2 relative p-0 overflow-hidden flex flex-col">
               <div className="p-6 pb-2 relative z-20 bg-[#0a0a0a]">
                  <h3 className="text-lg font-medium text-white tracking-tight">Developer API</h3>
                  <p className="text-slate-500 text-xs">Execute commands directly through the terminal interface.</p>
               </div>
               <div className="flex-1 relative z-10 -mt-2">
                 <TerminalDemo onExecute={handleTerminalExecute} />
               </div>
            </motion.div>
          </motion.div>

        </div>

        <Footer />
      </div>
    );
  };

  return (
    <>
      <Navbar
        onOpenAuth={handleOpenAuth}
        isLoggedIn={isLoggedIn}
        onNavigateProfile={() => handleSecureNavigation("profile")}
        onNavigateHome={() => setCurrentPage("home")}
        onNavigateCopilot={() => { setInitialAiPrompt(""); handleSecureNavigation("copilot"); }}
        onNavigateHackathons={() => setCurrentPage("hackathons")}
        onNavigateScholarships={() => setCurrentPage("scholarships")}
        onNavigateInternships={() => setCurrentPage("internships")}
      />

      {renderCurrentPage()}

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialView={authView}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}