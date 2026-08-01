import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, FileText, LayoutDashboard, GraduationCap, Target,
  CheckCircle2, Code, Globe, Briefcase, ChevronDown, BrainCircuit,
  User as UserIcon, ArrowRight, Loader2, ChevronRight, Terminal, Search
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
import Footer from "./Footer";

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
        
        {/* Sleek Noise Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay"></div>
        
        {/* HORIZON GLOW BACKGROUND */}
        <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden pointer-events-none z-0">
           {/* GENERATED ARTIFACT BACKGROUND */}
           <div className="absolute inset-0 w-full h-full bg-[url('/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-[0.15]" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)', maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)' }}></div>
           <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[150vw] md:w-[100vw] h-[100vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700/30 via-zinc-950/0 to-transparent blur-3xl opacity-60"></div>
           {/* Animated Horizon Line */}
           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[200vw] md:w-[120vw] h-px bg-gradient-to-r from-transparent via-zinc-400 to-transparent blur-[1px] opacity-40"></motion.div>
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }} className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[100vw] md:w-[60vw] h-[30vh] bg-gradient-to-b from-zinc-400/10 to-transparent blur-2xl opacity-50"></motion.div>
        </div>

        <div className="relative z-10 w-full flex flex-col items-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          
          {/* HERO SECTION - HORIZON STYLE */}
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} className="w-full flex flex-col items-center text-center mb-32 relative mt-10">
            
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-xs font-medium mb-8 backdrop-blur-md shadow-2xl transition-all hover:border-zinc-700 hover:bg-zinc-800/80 cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-zinc-300 animate-pulse"></span>
                ScholarSphere AI 2.0 is Live
              </div>
            </motion.div>
            
            <motion.h1 variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } }} className="text-5xl sm:text-7xl md:text-[5.5rem] font-medium tracking-tighter text-white leading-[1.05] mb-6 max-w-5xl">
              Automate your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500 drop-shadow-sm">academic journey.</span>
            </motion.h1>
            
            <motion.p variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 font-light mb-12 leading-relaxed">
              Stop endlessly scrolling through portals. We match you with the best opportunities based on your profile and help you draft the perfect application. No code required.
            </motion.p>
            
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 20 } } }} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              {!isLoggedIn ? (
                <button onClick={() => handleOpenAuth("signup")} className="group relative pill-button bg-zinc-100 text-zinc-950 hover:bg-white flex items-center gap-2 px-8 py-3.5 overflow-hidden transition-all duration-300">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <span className="relative z-10 font-bold">Start Building</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute -inset-2 bg-zinc-100/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              ) : (
                <>
                  <button onClick={() => { setInitialAiPrompt(""); setCurrentPage("copilot"); }} className="group relative pill-button bg-zinc-100 text-zinc-950 hover:bg-white flex items-center gap-2 px-8 py-3.5 transition-all duration-300">
                    <span className="relative z-10 font-bold">Launch Copilot</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute -inset-2 bg-zinc-100/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                  <button onClick={() => setCurrentPage("profile")} className="pill-button bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 flex items-center gap-2 px-8 py-3.5 transition-colors">
                    View Profile
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* BENTO GRID SECTION */}
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} 
            className="w-full grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-[340px] relative z-10 perspective-1000"
          >
            
            {/* Bento Item 1 - Large Search (Spans 2 cols) */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } }} 
              whileHover={{ scale: 1.02, rotateY: 2, rotateX: 2, zIndex: 10 }}
              className="bento-card md:col-span-2 relative p-8 flex flex-col justify-between group overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20 z-0"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 transition-all duration-700 group-hover:bg-emerald-400/20 group-hover:scale-110 z-0"></div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 transform-origin-left"></div>

              <div className="relative z-10 flex gap-6 items-start" style={{ transform: 'translateZ(20px)' }}>
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 transition-colors">
                  <Sparkles className="w-6 h-6 text-emerald-400 group-hover:animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2 font-outfit tracking-tight drop-shadow-md">0-100 Fit Scoring</h3>
                  <p className="text-slate-300 font-sans max-w-lg leading-relaxed text-sm">AI deeply analyzes your resume and automatically ranks the best hackathons and scholarships based on your exact tech stack and experience.</p>
                </div>
              </div>
              
            </motion.div>

            {/* Bento Item 2 - AI Copilot */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } }} 
              whileHover={{ scale: 1.03, rotateY: -3, rotateX: 2, zIndex: 10 }}
              className="bento-card relative p-8 flex flex-col justify-between group overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20 z-0"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[90px] translate-y-1/3 -translate-x-1/4 transition-all duration-700 group-hover:bg-violet-500/20 group-hover:scale-125 z-0"></div>
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-violet-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 transform-origin-right"></div>

              <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center mb-5 shadow-lg group-hover:border-violet-500/40 group-hover:bg-violet-500/10 transition-colors">
                  <BrainCircuit className="w-6 h-6 text-violet-400 group-hover:animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-outfit tracking-tight drop-shadow-md">AI Copilot Engine</h3>
                <p className="text-slate-300 font-sans text-sm leading-relaxed">Command your personal AI to instantly draft highly personalized cover letters and applications.</p>
              </div>
              <form onSubmit={handleQuickPrompt} className="relative z-10 mt-auto" style={{ transform: 'translateZ(30px)' }}>
                <div className="relative flex items-center bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-xl p-2 focus-within:border-violet-500/50 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all overflow-hidden group-hover:border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-violet-400 pl-3 font-mono text-sm font-bold animate-pulse relative z-10">~</span>
                  <input type="text" value={quickPromptText} onChange={(e) => setQuickPromptText(e.target.value)} placeholder="Draft an intro..." className="w-full bg-transparent pl-3 pr-2 py-2 text-sm text-white font-mono focus:outline-none placeholder:text-zinc-500 relative z-10" onClick={(e) => { if (!isLoggedIn) { e.preventDefault(); handleOpenAuth("login"); } }} />
                  <button type="submit" className="p-2 bg-white/5 rounded-lg border border-white/5 text-zinc-400 hover:text-white hover:bg-violet-500/20 hover:border-violet-500/30 transition-all relative z-10 flex-shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Bento Item 3 - Tracking */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } }} 
              whileHover={{ scale: 1.03, rotateY: 3, rotateX: -2, zIndex: 10 }}
              className="bento-card relative p-8 flex flex-col justify-between group overflow-hidden bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20 z-0"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-[90px] -translate-y-1/2 -translate-x-1/2 transition-all duration-700 group-hover:bg-cyan-500/20 group-hover:scale-125 z-0"></div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 transform-origin-center"></div>

              <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center mb-5 shadow-lg group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 transition-colors">
                  <LayoutDashboard className="w-6 h-6 text-cyan-400 group-hover:animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-outfit tracking-tight drop-shadow-md">Central Dashboard</h3>
                <p className="text-slate-300 font-sans text-sm leading-relaxed">Save interesting opportunities and effortlessly track what you've applied to in one unified dashboard.</p>
              </div>
            </motion.div>

            {/* Bento Item 4 - Terminal Demo (Spans 2 cols) */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } }} 
              whileHover={{ scale: 1.01, rotateY: -1, rotateX: -1, zIndex: 10 }}
              className="bento-card md:col-span-2 relative p-0 overflow-hidden flex flex-col group border border-white/10 bg-zinc-900/30 backdrop-blur-xl shadow-2xl rounded-3xl"
              style={{ transformStyle: 'preserve-3d' }}
            >
               <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20 z-0"></div>
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
               <div className="p-6 pb-4 relative z-20 bg-zinc-950/90 border-b border-white/5 flex items-center justify-between" style={{ transform: 'translateZ(10px)' }}>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-outfit">
                       <Terminal className="w-5 h-5 text-blue-400" />
                       Developer API
                    </h3>
                    <p className="text-slate-400 font-sans text-xs mt-1 font-light">Execute commands directly through the terminal interface.</p>
                  </div>
                  <div className="flex gap-1.5 opacity-60">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500"></div>
                  </div>
               </div>
               <div className="flex-1 relative z-10 bg-black/30 backdrop-blur-md" style={{ transform: 'translateZ(20px)' }}>
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