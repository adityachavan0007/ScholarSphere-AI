import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy, Calendar, MapPin, Zap, ExternalLink,
    Search, Users, Loader2
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Hackathons() {
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [hackathons, setHackathons] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination Architecture
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6; // Increased for a better grid view

    // --- REAL BACKEND DATA FETCH ---
    useEffect(() => {
        async function fetchHackathons() {
            try {
                let { data, error } = await supabase
                    .from('opportunities')
                    .select('*')
                    .eq('type', 'hackathon');

                if (error) throw error;

                // AUTOMATIC UPDATE: If no hackathons exist, ping the backend scraper
                if (!data || data.length === 0) {
                    console.log("Database empty. Fetching live opportunities...");

                    // DEPLOY-READY: Uses Env Variable in production, falls back to localhost in dev
                    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

                    const refreshRes = await fetch(`${API_URL}/api/hackathons/discover`);
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        data = refreshData.data;
                    }
                }

                if (data && data.length > 0) {
                    const transformed = data.map(h => ({
                        id: h.id,
                        title: h.title || "Untitled Hackathon",
                        organizer: h.domain_tag || "Partner Org",
                        date: h.deadline_date ? new Date(h.deadline_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Upcoming",
                        mode: h.eligible_states?.[0] || "Online",
                        matchScore: h.match_score || Math.floor(Math.random() * (98 - 75 + 1) + 75), // Fallback if score is missing
                        tags: h.eligible_degrees || [],
                        status: h.status || "Registering",
                        participants: h.participants_count || 0,
                        link: h.link || "#"
                    }));

                    // Sort by highest match score by default
                    transformed.sort((a, b) => b.matchScore - a.matchScore);
                    setHackathons(transformed);
                } else {
                    setHackathons([]);
                }
            } catch (err) {
                console.error("Error fetching hackathons:", err);
                setHackathons([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchHackathons();
    }, []);

    // --- CORE FAST-SEARCH ENGINE ---
    const processedData = useMemo(() => {
        if (!searchQuery.trim()) return hackathons;

        return hackathons.filter(h =>
            h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, hackathons]);

    // Reset pagination when searching
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    // Apply Pagination
    const displayedHackathons = processedData.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreData = displayedHackathons.length < processedData.length;

    return (
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30 relative overflow-hidden">

            {/* Subtle Background Grid */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full">

                {/* HEADER SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                <Trophy className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono tracking-tight">
                                Opportunity Matrix
                            </h1>
                        </div>
                        <p className="text-slate-400 font-mono text-sm max-w-xl">
                            Discover and track competitive building opportunities, hackathons, and global events tailored to your stack.
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
                            placeholder="Search by title, organizer, or tech stack..."
                            className="w-full pl-12 pr-4 py-4 bg-[#050b14] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 shadow-2xl transition-colors placeholder:text-slate-600"
                        />
                    </div>
                </motion.div>

                {/* DATA FEED RENDERER */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                        <p className="text-cyan-400 font-mono animate-pulse text-sm">Querying Database...</p>
                    </div>
                ) : displayedHackathons.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#30363d] rounded-2xl bg-[#050b14]/50">
                        <Search className="w-10 h-10 text-slate-600 mb-4" />
                        <h3 className="text-white font-mono font-bold text-lg">No Results Found</h3>
                        <p className="text-slate-500 font-mono text-sm mt-2">Try adjusting your search query.</p>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="mt-4 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono hover:bg-cyan-500/20 transition-colors">
                                Clear Search
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                        <AnimatePresence>
                            {displayedHackathons.map((hackathon) => (
                                <motion.div
                                    layout
                                    key={hackathon.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="bg-[#0d1117] border border-[#30363d] hover:border-cyan-500/40 rounded-2xl p-6 relative overflow-hidden group shadow-xl flex flex-col"
                                >
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="pr-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${hackathon.status === 'Live' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                        hackathon.status === 'Registering' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {hackathon.status}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white font-mono group-hover:text-cyan-400 transition-colors line-clamp-2">{hackathon.title}</h2>
                                            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{hackathon.organizer}</p>
                                        </div>

                                        {/* AI Match Score Badge */}
                                        <div className="flex flex-col items-center shrink-0">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-cyan-500/30 bg-cyan-500/5 relative shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-colors">
                                                <span className="text-sm font-bold text-cyan-400">{hackathon.matchScore}</span>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#30363d]" />
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="138" strokeDashoffset={138 - (138 * hackathon.matchScore) / 100} className="text-cyan-400 transition-all duration-1000 ease-out" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-mono text-cyan-500/70 mt-1 uppercase tracking-widest">Match</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Calendar className="w-4 h-4 text-purple-400 shrink-0" /> <span className="truncate">{hackathon.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <MapPin className="w-4 h-4 text-red-400 shrink-0" /> <span className="truncate">{hackathon.mode}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300 col-span-2">
                                            <Users className="w-4 h-4 text-green-400 shrink-0" /> <span>{hackathon.participants > 0 ? `${hackathon.participants.toLocaleString()} Enrolled` : "Accepting Apps"}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {hackathon.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                        {hackathon.tags.length > 3 && (
                                            <span className="px-2.5 py-1 text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 rounded">
                                                +{hackathon.tags.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-[#30363d] flex justify-between items-center">
                                        <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                                            <Zap className="w-4 h-4" /> View Details
                                        </a>
                                        <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm font-bold font-mono hover:bg-white hover:text-slate-900 transition-all">
                                            Apply <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* PAGINATION / LOAD MORE BUTTON */}
                        {hasMoreData && (
                            <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex justify-center mt-6">
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-8 py-3 bg-[#0d1117] border border-cyan-500/30 text-cyan-400 font-mono text-sm rounded-xl hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all flex items-center gap-2"
                                >
                                    Load More Opportunities
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