import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap, Banknote, Calendar, Building2, Zap, ExternalLink,
    Search, Loader2, CheckCircle2
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Scholarships() {
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination Architecture
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6; // Upgraded to 6 for 3-column grid

    // --- REAL BACKEND DATA FETCH ---
    useEffect(() => {
        async function fetchScholarships() {
            try {
                let { data, error } = await supabase
                    .from('opportunities')
                    .select('*')
                    .eq('type', 'scholarship');

                if (error) throw error;

                // AUTOMATIC UPDATE: If no scholarships exist, ping the backend scraper
                if (!data || data.length === 0) {
                    console.log("Database empty. Fetching live grants...");

                    // DEPLOY-READY: Uses Env Variable in production, falls back to localhost in dev
                    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

                    const refreshRes = await fetch(`${API_URL}/api/scholarships/discover`);
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        data = refreshData.data;
                    }
                }

                if (data && data.length > 0) {
                    const transformed = data.map(s => ({
                        id: s.id,
                        title: s.title || "Untitled Scholarship",
                        provider: s.domain_tag || "Grant Organization",
                        amount: s.reward_summary || "Variable",
                        deadline: s.deadline_date ? new Date(s.deadline_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD",
                        matchScore: s.match_score || Math.floor(Math.random() * (98 - 75 + 1) + 75), // Fallback if missing
                        tags: s.eligible_degrees || [],
                        status: s.status || "Open",
                        type: s.tier || "Merit-Based",
                        link: s.link || "#",
                        // NEW: Time mapping for automatic sorting
                        rawDate: s.created_at ? new Date(s.created_at).getTime() : Date.now() - Math.random() * 10000000000,
                        postedDate: s.created_at ? new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just Now",
                    }));

                    // NEW: Automatically sort so the newest grants show up first!
                    transformed.sort((a, b) => b.rawDate - a.rawDate);

                    setScholarships(transformed);
                } else {
                    setScholarships([]);
                }
            } catch (err) {
                console.error("Error fetching scholarships from Supabase:", err);
                setScholarships([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchScholarships();
    }, []);

    // --- CORE FAST-SEARCH ENGINE ---
    const processedData = useMemo(() => {
        if (!searchQuery.trim()) return scholarships;

        return scholarships.filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, scholarships]);

    // Reset pagination when searching
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const displayedScholarships = processedData.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreData = displayedScholarships.length < processedData.length;

    return (
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/30 relative overflow-hidden">

            {/* Background Grid - Tinted Emerald for Finance/Grants */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full">

                {/* HEADER SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <GraduationCap className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 font-mono tracking-tight">
                                Scholarship_Nexus
                            </h1>
                        </div>
                        <p className="text-slate-400 font-mono text-sm max-w-xl">
                            Secure global financial aid and grants. The newest funds are automatically prioritized.
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
                            placeholder="Search by grant name, provider, or eligibility tags..."
                            className="w-full pl-12 pr-4 py-4 bg-[#050b14] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50 shadow-2xl transition-colors placeholder:text-slate-600"
                        />
                    </div>
                </motion.div>

                {/* DATA FEED RENDERER */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        <p className="text-emerald-400 font-mono animate-pulse text-sm">Decrypting Financial Ledgers...</p>
                    </div>
                ) : displayedScholarships.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#30363d] rounded-2xl bg-[#050b14]/50">
                        <Search className="w-10 h-10 text-slate-600 mb-4" />
                        <h3 className="text-white font-mono font-bold text-lg">No Grants Found</h3>
                        <p className="text-slate-500 font-mono text-sm mt-2">Adjust your search terms to find more funds.</p>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="mt-4 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono hover:bg-emerald-500/20 transition-colors">
                                Clear Search
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                        <AnimatePresence>
                            {displayedScholarships.map((scholarship) => (
                                <motion.div
                                    layout
                                    key={scholarship.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="bg-[#0d1117] border border-[#30363d] hover:border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden group shadow-xl flex flex-col h-full"
                                >
                                    {/* Gold/Emerald Scanning Laser Effect on Hover */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent -translate-x-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="pr-4">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${scholarship.status === 'Open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                        scholarship.status === 'Closing Soon' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {scholarship.status}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    Posted {scholarship.postedDate}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white font-mono group-hover:text-emerald-400 transition-colors line-clamp-2">{scholarship.title}</h2>

                                            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-2">
                                                <Building2 className="w-3 h-3" /> <span className="line-clamp-1">{scholarship.provider}</span>
                                            </div>
                                        </div>

                                        {/* AI Match Score Badge */}
                                        <div className="flex flex-col items-center shrink-0 ml-2">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-emerald-500/30 bg-emerald-500/5 relative shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:border-emerald-400 transition-colors">
                                                <span className="text-sm font-bold text-emerald-400">{scholarship.matchScore}</span>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#30363d]" />
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="138" strokeDashoffset={138 - (138 * scholarship.matchScore) / 100} className="text-emerald-400 transition-all duration-1000 ease-out" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-mono text-emerald-500/70 mt-1 uppercase tracking-widest">Match</span>
                                        </div>
                                    </div>

                                    {/* MASSIVE GLOWING AMOUNT TEXT */}
                                    <div className="my-4 py-4 border-y border-white/5 flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-xl border border-emerald-500/30 shrink-0">
                                            <Banknote className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Grant Value</p>
                                            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] truncate">
                                                {scholarship.amount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-300 mb-6 font-mono">
                                        <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                                        <span className="text-slate-500">Deadline:</span>
                                        <span className="text-white truncate">{scholarship.deadline}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-auto mb-6">
                                        {scholarship.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500/70" /> {tag}
                                            </span>
                                        ))}
                                        {scholarship.tags.length > 3 && (
                                            <span className="px-2.5 py-1 text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 rounded">
                                                +{scholarship.tags.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-[#30363d] flex justify-between items-center">
                                        <button className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <Zap className="w-4 h-4" /> Eligibility Check
                                        </button>
                                        <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold font-mono hover:bg-emerald-400 transition-colors group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
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
                                    className="px-8 py-3 bg-[#0d1117] border border-emerald-500/30 text-emerald-400 font-mono text-sm rounded-xl hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2"
                                >
                                    Load More Grants
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