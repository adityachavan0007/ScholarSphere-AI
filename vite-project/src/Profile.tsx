import { motion } from "framer-motion";
import {
    MapPin,
    Link as LinkIcon,
    Github,
    Briefcase,
    GraduationCap,
    Code,
    Edit3,
    Sparkles,
    Youtube,
    Terminal,
    Cpu
} from "lucide-react";

export default function Profile() {
    return (
        <div className="w-full min-h-screen bg-[#030712] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* --- 1. HEADER / BANNER SECTION --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full overflow-hidden bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl"
                >
                    {/* Glowing Banner Background */}
                    <div className="h-32 sm:h-48 bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-purple-900/40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    </div>

                    {/* Avatar & Edit Button */}
                    <div className="px-6 pb-6 sm:px-10">
                        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-end">
                            <div className="relative flex items-end -mt-12 sm:-mt-16">
                                <div className="p-1.5 bg-[#0d1117] rounded-2xl border border-[#30363d] relative group">
                                    {/* Placeholder Avatar - Using a cool gradient + Terminal icon */}
                                    <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 group-hover:border-sky-400 transition-colors">
                                        <Terminal className="w-10 h-10 text-sky-400 sm:w-12 sm:h-12" />
                                    </div>
                                    <button className="absolute p-2 transition-colors border rounded-lg bg-[#21262d] border-[#30363d] -bottom-2 -right-2 hover:bg-[#30363d] text-slate-400 hover:text-white">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4 sm:mt-0">
                                <button className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg bg-[#21262d] border-[#30363d] text-slate-300 hover:bg-[#30363d] hover:text-white flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                                <button className="px-4 py-2 text-sm font-bold text-white transition-all rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 hover:shadow-[0_0_20px_rgba(2,132,199,0.4)] flex items-center gap-2 font-mono">
                                    <Sparkles className="w-4 h-4" /> AI Optimize
                                </button>
                                <button className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-blue-500/50 bg-[#0a192f] text-blue-400 hover:bg-blue-500/10 flex items-center gap-2">
                                    <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" className="w-4 h-4" />
                                    Sync LinkedIn
                                </button>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="mt-6">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl font-mono">Aditya S. Chavan</h1>
                            <p className="mt-1 text-base text-sky-400 font-mono">FY B.Tech IT Undergrad @ Dr. D. Y. Patil College of Engineering</p>

                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Maharashtra, India</span>
                                <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> mak6company.dev</span>
                                <span className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Ready for Hackathons
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- 2. TWO COLUMN LAYOUT --- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* LEFT COLUMN (Main Content) */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Bio Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl"
                        >
                            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-white font-mono">
                                <span className="text-sky-400">{">"}</span> about_me.md
                            </h2>
                            <p className="leading-relaxed text-slate-400 text-sm sm:text-base">
                                Engineering student passionate about bridging software development with hardware integration.
                                Currently exploring Indian Knowledge Systems and building Arduino-based circuit solutions.
                                When I'm not coding in Java, I'm scripting, shooting, and editing cinematic automotive content.
                                Always looking to collaborate on IoT projects or creative filmmaking endeavors.
                            </p>
                        </motion.div>

                        {/* Experience / Education */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl"
                        >
                            <h2 className="flex items-center gap-2 mb-6 text-lg font-bold text-white font-mono">
                                <GraduationCap className="w-5 h-5 text-indigo-400" /> Education & Certifications
                            </h2>

                            <div className="space-y-6">
                                {/* Item 1 */}
                                <div className="flex gap-4 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                                        <div className="w-px h-full bg-[#30363d] mt-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold text-white">B.Tech in Information Technology</h3>
                                        <p className="text-sm text-slate-400">Dr. D. Y. Patil College of Engineering • First Year</p>
                                        <p className="mt-2 text-sm text-slate-500">Focusing on core programming, circuit theory, and advanced software tools.</p>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="flex gap-4 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-[#30363d] rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">NPTEL Certification</h3>
                                        <p className="text-sm text-slate-400">Business Analytics For Management Decision</p>
                                        <p className="mt-2 text-sm text-slate-500">Completed 12-week intensive course on data-driven decision making.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <div className="space-y-6">

                        {/* Tech Stack */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl"
                        >
                            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-white font-mono">
                                <Code className="w-5 h-5 text-purple-400" /> Tech Stack
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {['Java', 'Arduino', 'Circuit Design', 'Git & GitHub', 'Video Editing', 'Scriptwriting'].map((skill) => (
                                    <span key={skill} className="px-3 py-1 text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-md">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Digital Footprint */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl"
                        >
                            <h2 className="mb-4 text-lg font-bold text-white font-mono">Links & Portfolios</h2>
                            <div className="space-y-3">
                                <a href="#" className="flex items-center justify-between p-3 transition-colors border rounded-lg bg-[#010409] border-[#30363d] hover:border-slate-500 group">
                                    <div className="flex items-center gap-3">
                                        <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">GitHub Profile</span>
                                    </div>
                                    <LinkIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                                </a>

                                <a href="#" className="flex items-center justify-between p-3 transition-colors border rounded-lg bg-[#010409] border-[#30363d] hover:border-red-500/50 group">
                                    <div className="flex items-center gap-3">
                                        <Youtube className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">MysticMotorMile</span>
                                    </div>
                                    <LinkIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                                </a>
                            </div>
                        </motion.div>

                        {/* AI Fit Score Calibration */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="p-6 bg-gradient-to-br from-[#0d1117] to-indigo-900/10 border border-indigo-500/20 rounded-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Cpu className="w-24 h-24" />
                            </div>
                            <h2 className="relative z-10 mb-2 text-lg font-bold text-white font-mono">Profile Strength</h2>
                            <div className="relative z-10 flex items-end gap-2 mb-4">
                                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">85%</span>
                                <span className="pb-1 text-sm text-slate-400">Optimized</span>
                            </div>
                            <div className="relative z-10 w-full h-2 overflow-hidden rounded-full bg-[#21262d]">
                                <div className="w-[85%] h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full relative">
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                            <p className="relative z-10 mt-4 text-xs text-slate-400">
                                Add 1 more project to unlock 90%+ match accuracy for core engineering roles.
                            </p>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}