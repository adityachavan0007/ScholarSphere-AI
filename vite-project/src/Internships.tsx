import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, MapPin, DollarSign, Clock, Building2, Zap, ExternalLink,
    Search, Loader2, Code
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Internships() {
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [internships, setInternships] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination Architecture
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6; // Upgraded to 6 for the 3-column grid

    // --- REAL BACKEND DATA FETCH ---
    useEffect(() => {
        async function fetchInternships() {
            try {
                let { data, error } = await supabase
                    .from('opportunities')
                    .select('*')
                    .eq('type', 'internship');

                if (error) throw error;

                // AUTOMATIC UPDATE: If no internships exist, ping the backend scraper
                if (!data || data.length === 0) {
                    console.log("Database empty. Fetching live roles...");

                    // DEPLOY-READY: Uses Env Variable in production, falls back to localhost in dev
                    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

                    const refreshRes = await fetch(`${API_URL}/api/internships/discover`);
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        data = refreshData.data;
                    }
                }

                if (data && data.length > 0) {
                    const transformed = data.map(i => ({
                        id: i.id,
                        role: i.title || "Software Engineering Intern",
                        company: i.domain_tag || "Tech Corp",
                        location: i.eligible_states?.[0] || "Remote",
                        stipend: i.reward_summary || "Competitive",
                        duration: i.duration || "3-6 Months",
                        matchScore: i.match_score || Math.floor(Math.random() * (98 - 75 + 1) + 75), // Fallback if missing
                        tags: i.eligible_degrees || [],
                        status: i.status || "Actively Hiring",
                        tier: i.tier || "Startup",
                        link: i.link || "#",
                        // NEW: Time mapping for automatic sorting
                        rawDate: i.created_at ? new Date(i.created_at).getTime() : Date.now() - Math.random() * 10000000000,
                        postedDate: i.created_at ? new Date(i.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just Now",
                    }));

                    // NEW: Automatically sort so the newest dates show up first!
                    transformed.sort((a, b) => b.rawDate - a.rawDate);

                    setInternships(transformed);
                } else {
                    setInternships([]);
                }
            } catch (err) {
                console.error("Error fetching internships:", err);
                setInternships([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInternships();
    }, []);

    // --- CORE FAST-SEARCH ENGINE ---
    const processedData = useMemo(() => {
        if (!searchQuery.trim()) return internships;

        return internships.filter(i =>
            i.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, internships]);

    // Reset pagination when searching
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    // Apply Pagination
    const displayedInternships = processedData.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreData = displayedInternships.length < processedData.length;

    return (
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative overflow-hidden">

            {/* Subtle Background Grid */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full">

                {/* HEADER SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <Briefcase className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 font-mono tracking-tight">
                                Intern_Directory
                            </h1>
                        </div>
                        <p className="text-slate-400 font-mono text-sm max-w-xl">
                            Secure elite engineering roles. The newest opportunities are automatically prioritized.
                        </p>
                    </div>
                </motion.div>

                {/* CLEAN SEARCH BAR */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="w-full mb-10">
                    <div className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by role, company, or tech stack (e.g., React, AI, Google)..."
                            className="w-full pl-12 pr-4 py-4 bg-[#050b14] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 shadow-2xl transition-colors placeholder:text-slate-600"
                        />
                    </div>
                </motion.div>

                {/* DATA FEED RENDERER */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-indigo-400 font-mono animate-pulse text-sm">Compiling Employer Matrices...</p>
                    </div>
                ) : displayedInternships.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#30363d] rounded-2xl bg-[#050b14]/50">
                        <Code className="w-10 h-10 text-slate-600 mb-4" />
                        <h3 className="text-white font-mono font-bold text-lg">No Roles Found</h3>
                        <p className="text-slate-500 font-mono text-sm mt-2">Try adjusting your tech stack filters.</p>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="mt-4 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono hover:bg-indigo-500/20 transition-colors">
                                Clear Search
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                        <AnimatePresence>
                            {displayedInternships.map((internship) => (
                                <motion.div
                                    layout
                                    key={internship.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="bg-[#0d1117] border border-[#30363d] hover:border-indigo-500/40 rounded-2xl p-6 relative overflow-hidden group shadow-xl flex flex-col h-full"
                                >
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent -translate-x-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4 items-start">
                                            {/* Company "Logo" Block */}
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-[#050b14] border border-[#30363d] flex items-center justify-center shrink-0 shadow-inner group-hover:border-indigo-500/50 transition-colors">
                                                <Building2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${internship.status === 'Actively Hiring' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                            internship.status === 'Reviewing' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        }`}>
                                                        {internship.status}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-400">
                                                        Posted {internship.postedDate}
                                                    </span>
                                                </div>
                                                <h2 className="text-lg sm:text-xl font-bold text-white font-mono group-hover:text-indigo-300 transition-colors leading-tight line-clamp-2">{internship.role}</h2>
                                                <p className="text-sm text-indigo-400 mt-1 font-mono line-clamp-1">{internship.company}</p>
                                            </div>
                                        </div>

                                        {/* AI Match Score Badge */}
                                        <div className="flex flex-col items-center shrink-0 ml-2">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-indigo-500/30 bg-indigo-500/5 relative shadow-[0_0_15px_rgba(99,102,241,0.15)] group-hover:border-indigo-400 transition-colors">
                                                <span className="text-sm font-bold text-indigo-400">{internship.matchScore}</span>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#30363d]" />
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="138" strokeDashoffset={138 - (138 * internship.matchScore) / 100} className="text-indigo-400 transition-all duration-1000 ease-out" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-mono text-indigo-500/70 mt-1 uppercase tracking-widest">Match</span>
                                        </div>
                                    </div>

                                    {/* INFO GRID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800/50 rounded-lg border border-[#30363d]"><DollarSign className="w-4 h-4 text-green-400" /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-mono text-slate-500 uppercase">Stipend</p>
                                                <p className="text-sm font-bold text-white font-mono truncate">{internship.stipend}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800/50 rounded-lg border border-[#30363d]"><MapPin className="w-4 h-4 text-blue-400" /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-mono text-slate-500 uppercase">Location</p>
                                                <p className="text-sm font-bold text-white font-mono truncate">{internship.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800/50 rounded-lg border border-[#30363d]"><Clock className="w-4 h-4 text-orange-400" /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-mono text-slate-500 uppercase">Duration</p>
                                                <p className="text-sm font-bold text-white font-mono truncate">{internship.duration}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TECH STACK TAGS */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {internship.tags.slice(0, 4).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center gap-1">
                                                <Code className="w-3 h-3 opacity-70" /> {tag}
                                            </span>
                                        ))}
                                        {internship.tags.length > 4 && (
                                            <span className="px-2.5 py-1 text-[11px] font-mono text-slate-500 bg-white/5 border border-white/10 rounded-md">
                                                +{internship.tags.length - 4}
                                            </span>
                                        )}
                                    </div>

                                    {/* ACTION BAR */}
                                    <div className="pt-4 border-t border-[#30363d] flex justify-between items-center">
                                        <a href={internship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono font-bold text-slate-400 hover:text-white transition-colors">
                                            <Briefcase className="w-4 h-4" /> View Details
                                        </a>
                                        <div className="flex gap-3">
                                            <a href={internship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold font-mono hover:bg-indigo-500 transition-colors group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                                Apply <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* PAGINATION / LOAD MORE BUTTON */}
                        {hasMoreData && (
                            <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex justify-center mt-6">
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-8 py-3 bg-[#0d1117] border border-indigo-500/30 text-indigo-400 font-mono text-sm rounded-xl hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex items-center gap-2"
                                >
                                    Load More Roles
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <style>{`
        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
        </div>
    );
}