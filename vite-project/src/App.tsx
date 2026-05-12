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
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="relative w-full bg-[#030712] flex flex-col items-center overflow-x-hidden selection:bg-purple-500/30">

      {/* 1. Navbar is placed here at the very top */}
      <Navbar />

      {/* Smooth Infinite Floating Animated Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -40, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      {/* --- 100% FULL SCREEN HERO SECTION --- */}
      {/* Note: I added pt-20 here so the content drops down below the fixed navbar */}
      <div className="relative z-10 w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 70, damping: 20 }}
          className="w-full max-w-4xl text-center space-y-8"
        >
          {/* Target Audience Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs sm:text-sm font-medium mb-4 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Built for Indian Undergraduates</span>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 drop-shadow-[0_0_30px_rgba(99,102,241,0.4)] py-2 leading-tight"
          >
            ScholarSphere AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-200 px-4"
          >
            Your AI copilot for scholarships, hackathons and internships.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed px-4"
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
            <a
              href="/onboarding"
              className="inline-block px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base sm:text-lg rounded-full shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_rgba(99,102,241,0.7)] border border-white/10 transition-all"
            >
              Get started
            </a>
          </motion.div>
        </motion.div>

        {/* Bouncing Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 text-slate-500 flex flex-col items-center gap-2 opacity-70"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* --- CONTENT BELOW THE FOLD --- */}
      <div className="relative z-10 w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 pb-32">

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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-12 max-w-6xl w-full"
        >
          {/* Card 1: Match */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.05] transition-all group shadow-xl"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">0-100 Fit Scoring</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">Discover opportunities ranked by an AI fit score tailored entirely to your unique student profile.</p>
          </motion.div>

          {/* Card 2: Copilot */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.05] transition-all group shadow-xl"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <FileText className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">AI Copilot</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">Beat writer's block. Generate personalized draft answers for common application questions.</p>
          </motion.div>

          {/* Card 3: Tracking */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all group shadow-xl"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Easy Tracking</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">Keep your hunt organized. Save interesting opportunities and track what you've applied to.</p>
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-12 sm:mb-16">How ScholarSphere Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">1. Build Profile</h3>
              <p className="text-slate-400 text-sm sm:text-base px-4">Enter your degree, CGPA, and interests.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">2. Get Matched</h3>
              <p className="text-slate-400 text-sm sm:text-base px-4">AI filters the database and assigns a fit score.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">3. Draft & Apply</h3>
              <p className="text-slate-400 text-sm sm:text-base px-4">Generate answers and track applications.</p>
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
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-8">Curated Opportunities Across Top Domains</h3>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <motion.span whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)", color: "white" }} className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm sm:text-base transition-colors cursor-default">
              <Code className="w-4 h-4" /> AI/ML
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)", color: "white" }} className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm sm:text-base transition-colors cursor-default">
              <Globe className="w-4 h-4" /> SDE/Web
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)", color: "white" }} className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm sm:text-base transition-colors cursor-default">
              <LayoutDashboard className="w-4 h-4" /> Data/Analytics
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)", color: "white" }} className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm sm:text-base transition-colors cursor-default">
              <Target className="w-4 h-4" /> Core Engineering
            </motion.span>
            <motion.span whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.1)", color: "white" }} className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm sm:text-base transition-colors cursor-default">
              <Briefcase className="w-4 h-4" /> Management
            </motion.span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}