import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap, Banknote, Calendar, Building2, Zap, ExternalLink,
    Search
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Scholarships() {
    // --- STATE MANAGEMENT ---
    const [isLoading, setIsLoading] = useState(true);
    const [scholarships, setScholarships] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("date_asc");

    // Pagination Architecture
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 6; 

    // --- REAL BACKEND DATA FETCH ---
    useEffect(() => {
        async function fetchScholarships() {
            try {
                let { data, error } = await supabase
                    .from('opportunities')
                    .select('*')
                    .eq('type', 'scholarship');

                if (error) throw error;

                if (!data || data.length === 0) {
                    console.log("Database empty. Fetching live grants...");
                    const refreshRes = await fetch(`/api/scholarships/discover`);
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        data = refreshData.data;
                    }
                }

                if (data && data.length > 0) {
                    const transformed = data.map(s => {
                        const rawDate = s.deadline_date ? new Date(s.deadline_date).getTime() : Infinity;
                        const isClosed = rawDate < Date.now();
                        
                        return {
                            id: s.id,
                            title: s.title || "Untitled Scholarship",
                            provider: s.domain_tag || "Grant Organization",
                            amount: s.reward_summary || "Variable",
                            deadline: s.deadline_date ? new Date(s.deadline_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "TBD",
                            tags: s.eligible_degrees || [],
                            status: isClosed ? "CLOSED" : "OPEN",
                            type: s.tier || "Merit-Based",
                            link: s.link || "#",
                            link_verified: s.link_verified,
                            rawDate: rawDate,
                        };
                    });

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

    // --- TRACK APPLICATION ---
    const handleApply = async (scholarship: any) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await supabase.from('user_applications').insert({
                    user_id: session.user.id,
                    opportunity_id: scholarship.id,
                    opportunity_title: scholarship.title,
                    opportunity_type: 'scholarship'
                });
            }
        } catch (err) {
            console.error("Error logging application:", err);
        }
        // Always open the link
        window.open(scholarship.link, '_blank');
    };

    // --- CORE FAST-SEARCH ENGINE ---
    const processedData = useMemo(() => {
        let filtered = scholarships;
        if (searchQuery.trim()) {
            filtered = scholarships.filter(s =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === 'date_asc') {
                return a.rawDate - b.rawDate;
            } else {
                return b.rawDate - a.rawDate;
            }
        });
    }, [searchQuery, scholarships, sortBy]);

    // Reset pagination when searching
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    // Apply Pagination
    const displayedScholarships = processedData.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreData = displayedScholarships.length < processedData.length;

    return (
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/30 relative overflow-hidden bg-black">
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full mt-6">

                {/* HEADER SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center gap-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs font-medium backdrop-blur-md cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live Grant Directory
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-outfit tracking-tight">
                        Global <span className="text-emerald-400">Scholarships</span>
                    </h1>
                    <p className="text-slate-400 font-sans text-base max-w-2xl leading-relaxed">
                        Secure funding for your education. Track massive financial aid grants specifically for CS students.
                    </p>
                </motion.div>

                {/* COMMAND CENTER (Search & Sort) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full max-w-4xl mx-auto mb-16 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 w-full flex items-center bg-zinc-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 focus-within:border-emerald-500/50 transition-all">
                        <Search className="absolute left-4 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search scholarships, organizations, or degrees..."
                            className="w-full pl-12 pr-4 py-3.5 bg-transparent text-white font-sans text-sm focus:outline-none placeholder:text-slate-500"
                        />
                    </div>
                    <div className="relative md:w-56 flex-shrink-0 bg-zinc-900/50 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 focus-within:border-emerald-500/50 transition-all">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full h-full px-4 py-3.5 bg-transparent text-white font-sans text-sm focus:outline-none cursor-pointer appearance-none"
                            style={{ WebkitAppearance: 'none' }}
                        >
                            <option value="date_asc" className="bg-zinc-900 text-white">Soonest Deadline</option>
                            <option value="date_desc" className="bg-zinc-900 text-white">Latest Deadline</option>
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
                           <div className="absolute inset-0 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
                           <GraduationCap className="w-6 h-6 text-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-emerald-400 font-sans tracking-widest uppercase text-xs font-bold animate-pulse">Scanning Global Funds</p>
                    </div>
                ) : displayedScholarships.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center max-w-3xl mx-auto w-full">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                           <Search className="w-8 h-8 text-slate-500" />
                        </div>
                        <h3 className="text-white font-outfit font-bold text-2xl mb-2">No Grants Found</h3>
                        <p className="text-slate-400 font-sans text-sm max-w-md">Our scanners couldn't find any scholarships matching your exact criteria right now.</p>
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="mt-6 px-6 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold font-sans hover:bg-emerald-500/20 transition-colors">
                                Reset Filters
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                        <AnimatePresence>
                            {displayedScholarships.map((scholarship) => (
                                <motion.div
                                    layout
                                    key={scholarship.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-zinc-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col hover:border-emerald-500/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="pr-4">
                                                {scholarship.amount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-center gap-2.5 text-sm text-slate-300 mb-6 bg-white/[0.03] p-2.5 rounded-xl border border-white/5 shadow-inner" style={{ transform: 'translateZ(40px)' }}>
                                        <div className="w-7 h-7 rounded bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0"><Calendar className="w-3.5 h-3.5 text-red-400" /></div>
                                        <span className="text-slate-400 font-sans text-xs">Deadline:</span>
                                        <span className="text-white font-sans font-medium truncate text-xs">{scholarship.deadline}</span>
                                    </div>

                                    <div className="relative z-10 flex flex-wrap gap-2 mt-auto mb-6" style={{ transform: 'translateZ(40px)' }}>
                                        {scholarship.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="px-3 py-1.5 text-[10px] font-sans font-medium text-slate-300 bg-white/[0.05] border border-white/10 rounded-lg flex items-center gap-1 shadow-inner">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500/70" /> {tag}
                                            </span>
                                        ))}
                                        {scholarship.tags.length > 3 && (
                                            <span className="px-3 py-1.5 text-[10px] font-sans font-medium text-slate-500 bg-white/[0.02] border border-white/5 rounded-lg shadow-inner">
                                                +{scholarship.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative z-10 pt-5 border-t border-white/10 flex justify-between items-center" style={{ transform: 'translateZ(20px)' }}>
                                        <button className="flex items-center gap-1.5 text-sm font-sans font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <Zap className="w-4 h-4 fill-emerald-400/20" /> Eligibility Check
                                            {scholarship.link_verified === false && <span className="text-[9px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md border border-orange-400/20 ml-2 uppercase tracking-wide">Unverified</span>}
                                        </button>
                                        <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-bold font-sans hover:bg-white hover:text-black transition-all shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                            Apply <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* PAGINATION / LOAD MORE BUTTON */}
                        {hasMoreData && (
                            <div className="col-span-1 md:col-span-2 xl:col-span-3 flex justify-center mt-10 relative z-20">
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-8 py-3.5 bg-zinc-900/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-sans font-bold text-sm rounded-2xl hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2 group"
                                >
                                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform fill-emerald-400/20" />
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