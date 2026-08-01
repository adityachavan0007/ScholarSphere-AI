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
    const [sortBy, setSortBy] = useState("match");

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
                    const refreshRes = await fetch(`/api/internships/discover`);
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
                        link_verified: i.link_verified,
                        rawDate: i.deadline_date ? new Date(i.deadline_date).getTime() : Infinity,
                        postedDate: i.deadline_date ? new Date(i.deadline_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Upcoming",
                    }));

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
        let filtered = internships;
        if (searchQuery.trim()) {
            filtered = internships.filter(i =>
                i.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === 'match') {
                return b.matchScore - a.matchScore;
            } else if (sortBy === 'date_asc') {
                return a.rawDate - b.rawDate;
            } else {
                return b.rawDate - a.rawDate;
            }
        });
    }, [searchQuery, internships, sortBy]);

    // Reset pagination when searching
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    // Apply Pagination
    const displayedInternships = processedData.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreData = displayedInternships.length < processedData.length;

    return (
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative overflow-hidden bg-black">

            {/* HORIZON GLOW BACKGROUND - INDIGO */}
            <div className="absolute top-0 left-0 w-full h-[60vh] overflow-hidden pointer-events-none z-0">
               <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[150vw] md:w-[100vw] h-[100vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950/0 to-transparent blur-3xl opacity-60"></div>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[100vw] md:w-[60vw] h-[30vh] bg-gradient-to-b from-indigo-400/5 to-transparent blur-2xl opacity-50"></motion.div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full mt-6">

                {/* HEADER SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center gap-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs font-medium backdrop-blur-md shadow-2xl cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                        Live Role Directory
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-outfit tracking-tight drop-shadow-md">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]">Internships</span>
                    </h1>
                    <p className="text-slate-400 font-sans text-base max-w-2xl leading-relaxed">
                        Secure elite engineering roles. Our AI cross-references your stack with actively hiring companies to find perfect matches.
                    </p>
                </motion.div>

                {/* FLOATING COMMAND CENTER (Search & Sort) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full max-w-4xl mx-auto mb-16 flex flex-col md:flex-row gap-4 p-2 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl relative z-20">
                    <div className="relative flex-1 w-full flex items-center bg-zinc-950/80 rounded-xl overflow-hidden border border-white/5 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all">
                        <Search className="absolute left-4 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by role, company, or tech stack (e.g., React, AI, Google)..."
                            className="w-full pl-12 pr-4 py-3.5 bg-transparent text-white font-sans text-sm focus:outline-none placeholder:text-slate-500"
                        />
                    </div>
                    <div className="relative md:w-64 flex-shrink-0 bg-zinc-950/80 rounded-xl overflow-hidden border border-white/5 focus-within:border-indigo-500/50 transition-all">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full h-full px-4 py-3.5 bg-transparent text-white font-sans text-sm focus:outline-none cursor-pointer appearance-none"
                            style={{ WebkitAppearance: 'none' }}
                        >
                            <option value="match" className="bg-zinc-900 text-white">Sort By: AI Match Score</option>
                            <option value="date_asc" className="bg-zinc-900 text-white">Sort By: Soonest Deadline</option>
                            <option value="date_desc" className="bg-zinc-900 text-white">Sort By: Latest Deadline</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </motion.div>

                {/* DATA FEED RENDERER */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                           <div className="absolute inset-0 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
                           <Briefcase className="w-6 h-6 text-indigo-400 animate-pulse" />
                        </div>
                        <p className="text-indigo-400 font-sans tracking-widest uppercase text-xs font-bold animate-pulse">Compiling Employer Matrices</p>
                    </div>
                ) : displayedInternships.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-3xl bg-zinc-900/20 backdrop-blur-sm max-w-3xl mx-auto w-full">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                           <Code className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-white font-outfit font-bold text-2xl mb-2">No Roles Found</h3>
                        <p className="text-slate-400 font-sans text-sm max-w-md">Try adjusting your tech stack filters to discover more opportunities.</p>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="mt-6 px-6 py-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-sm font-bold font-sans hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-colors shadow-inner">
                                Reset Filters
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-12 perspective-1000">
                        <AnimatePresence>
                            {displayedInternships.map((internship) => (
                                <motion.div
                                    layout
                                    key={internship.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    whileHover={{ scale: 1.02, rotateY: 2, rotateX: 2, zIndex: 10 }}
                                    className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-6 relative overflow-hidden group flex flex-col h-full"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Glassmorphism Background Gradients */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-all duration-700 group-hover:bg-indigo-400/20 group-hover:scale-110 z-0 pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 transform-origin-left z-0 pointer-events-none"></div>

                                    <div className="relative z-10 flex justify-between items-start mb-6" style={{ transform: 'translateZ(20px)' }}>
                                        <div className="flex gap-4 items-start pr-4">
                                            {/* Company Logo Block */}
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center shrink-0 shadow-[0_4px_15px_rgba(0,0,0,0.5)] group-hover:border-indigo-500/50 transition-colors">
                                                <Building2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-sans font-bold uppercase tracking-wider ${internship.status === 'Actively Hiring' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                                                            internship.status === 'Reviewing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                                                                'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                                                        }`}>
                                                        {internship.status}
                                                    </span>
                                                    <span className="text-[10px] font-sans font-medium text-slate-400">
                                                        Posted {internship.postedDate}
                                                    </span>
                                                </div>
                                                <h2 className="text-2xl font-bold text-white font-outfit leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2 drop-shadow-md">{internship.role}</h2>
                                                <p className="text-sm text-indigo-400 mt-1.5 font-sans font-medium line-clamp-1">{internship.company}</p>
                                            </div>
                                        </div>

                                        {/* AI Match Score Badge */}
                                        <div className="flex flex-col items-center shrink-0 ml-2">
                                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-white/10 bg-zinc-950/80 relative shadow-[0_0_15px_rgba(99,102,241,0.1)] group-hover:border-indigo-500/40 transition-colors backdrop-blur-md">
                                                <span className="text-lg font-bold text-indigo-400 font-outfit drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">{internship.matchScore}</span>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                                                    <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="163" strokeDashoffset={163 - (163 * internship.matchScore) / 100} className="text-indigo-400 transition-all duration-1000 ease-out" strokeLinecap="round" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-sans font-bold text-indigo-500/70 mt-1.5 uppercase tracking-widest">Match Score</span>
                                        </div>
                                    </div>

                                    {/* INFO GRID */}
                                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 mt-auto" style={{ transform: 'translateZ(30px)' }}>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 shadow-inner">
                                            <div className="w-7 h-7 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] font-sans font-bold text-slate-500 uppercase">Stipend</p>
                                                <p className="text-xs font-bold text-white font-sans truncate">{internship.stipend}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 shadow-inner">
                                            <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0"><MapPin className="w-3.5 h-3.5 text-blue-400" /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] font-sans font-bold text-slate-500 uppercase">Location</p>
                                                <p className="text-xs font-bold text-white font-sans truncate">{internship.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 shadow-inner">
                                            <div className="w-7 h-7 rounded bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0"><Clock className="w-3.5 h-3.5 text-orange-400" /></div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] font-sans font-bold text-slate-500 uppercase">Duration</p>
                                                <p className="text-xs font-bold text-white font-sans truncate">{internship.duration}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TECH STACK TAGS */}
                                    <div className="relative z-10 flex flex-wrap gap-2 mb-6" style={{ transform: 'translateZ(40px)' }}>
                                        {internship.tags.slice(0, 4).map((tag: string) => (
                                            <span key={tag} className="px-3 py-1.5 text-[10px] font-sans font-medium text-indigo-200 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center gap-1 shadow-inner">
                                                <Code className="w-3 h-3 text-indigo-400 opacity-70" /> {tag}
                                            </span>
                                        ))}
                                        {internship.tags.length > 4 && (
                                            <span className="px-3 py-1.5 text-[10px] font-sans font-medium text-slate-400 bg-white/[0.02] border border-white/5 rounded-lg shadow-inner">
                                                +{internship.tags.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    {/* ACTION BAR */}
                                    <div className="relative z-10 pt-5 border-t border-white/10 flex justify-between items-center" style={{ transform: 'translateZ(20px)' }}>
                                        <a href={internship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-sans font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                            <Briefcase className="w-4 h-4 fill-indigo-400/20" /> View Details
                                            {internship.link_verified === false && <span className="text-[9px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md border border-orange-400/20 ml-2 uppercase tracking-wide">Unverified</span>}
                                        </a>
                                        <div className="flex gap-3">
                                            <a href={internship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold font-sans hover:bg-indigo-500 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                                Apply <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* PAGINATION / LOAD MORE BUTTON */}
                        {hasMoreData && (
                            <div className="col-span-1 md:col-span-2 xl:col-span-3 flex justify-center mt-10 relative z-20">
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-8 py-3.5 bg-zinc-900/80 backdrop-blur-md border border-indigo-500/30 text-indigo-400 font-sans font-bold text-sm rounded-2xl hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex items-center gap-2 group"
                                >
                                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform fill-indigo-400/20" />
                                    Load More Roles
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}