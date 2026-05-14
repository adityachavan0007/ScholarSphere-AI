import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap, Banknote, Calendar, Building2, Zap, ExternalLink,
    Activity, Search, Filter, SlidersHorizontal, Loader2, Award, CheckCircle2
} from "lucide-react";

// --- MOCK DATABASE ---
// BACKEND DEV: Replace this array with a real database fetch.
const MASTER_SCHOLARSHIPS = [
    { id: 1, title: "Google Generation Scholarship", provider: "Google Labs", amount: "$10,000", deadline: "Oct 15, 2026", matchScore: 96, tags: ["Women in Tech", "Computer Science"], status: "Open", type: "Diversity" },
    { id: 2, title: "Reliance Foundation Scholar", provider: "Reliance Ind.", amount: "₹2,00,000", deadline: "Aug 30, 2026", matchScore: 88, tags: ["Undergrad", "Merit-Based"], status: "Closing Soon", type: "Merit-Based" },
    { id: 3, title: "Tata Innovation Grant", provider: "Tata Trusts", amount: "₹5,00,000", deadline: "Nov 01, 2026", matchScore: 92, tags: ["Innovation", "Hardware"], status: "Upcoming", type: "Merit-Based" },
    { id: 4, title: "Avery Dennison STEM", provider: "Avery Dennison", amount: "$3,000", deadline: "Sep 15, 2026", matchScore: 75, tags: ["Engineering", "STEM"], status: "Open", type: "Merit-Based" },
    { id: 5, title: "HDFC Badhte Kadam", provider: "HDFC Bank", amount: "₹1,00,000", deadline: "Aug 25, 2026", matchScore: 82, tags: ["Need-Based", "Undergrad"], status: "Closing Soon", type: "Need-Based" },
    { id: 6, title: "Palantir Global Impact", provider: "Palantir", amount: "$15,000", deadline: "Dec 10, 2026", matchScore: 65, tags: ["Data Science", "Global"], status: "Upcoming", type: "Merit-Based" },
];

export default function Scholarships() {
    // --- STATE MANAGEMENT ---
    const [isBooting, setIsBooting] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Match Score");

    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    const filters = ["All", "Merit-Based", "Need-Based", "Diversity", "Women in Tech"];
    const sortOptions = ["Match Score", "Amount (High-Low)", "Deadline (Soonest)"];

    // --- INITIAL BOOT SEQUENCE ---
    useEffect(() => {
        const timer = setTimeout(() => setIsBooting(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // --- SIMULATE BACKEND SEARCH DELAY ---
    useEffect(() => {
        if (isBooting) return;
        setIsSearching(true);
        const delay = setTimeout(() => {
            setIsSearching(false);
            setPage(1);
        }, 400);
        return () => clearTimeout(delay);
    }, [searchQuery, activeFilter, sortBy]);

    // --- CORE FILTERING & SORTING ENGINE ---
    const processedData = useMemo(() => {
        // 1. Filter by Search Query
        let data = MASTER_SCHOLARSHIPS.filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.provider.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // 2. Filter by Tags/Type
        if (activeFilter !== "All") {
            data = data.filter(s => s.tags.includes(activeFilter) || s.type === activeFilter);
        }

        // 3. Sort the Data (Including complex currency parsing)
        data.sort((a, b) => {
            if (sortBy === "Match Score") return b.matchScore - a.matchScore;
            if (sortBy === "Deadline (Soonest)") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            if (sortBy === "Amount (High-Low)") {
                // Parse strings like "$10,000" or "₹2,00,000" into raw numbers for sorting
                const parseAmount = (val: string) => parseInt(val.replace(/[^0-9]/g, ''), 10);
                return parseAmount(b.amount) - parseAmount(a.amount);
            }
            return 0;
        });

        return data;
    }, [searchQuery, activeFilter, sortBy]);

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
                        <p className="text-slate-400 font-mono text-sm">Secure global financial aid and grant routing.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] px-4 py-2 rounded-xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-mono text-slate-300">Ledger Sync: <span className="text-emerald-400">{isSearching ? "..." : "8ms"}</span></span>
                        </div>
                        <div className="w-px h-4 bg-[#30363d]"></div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isSearching ? 'animate-pulse' : 'animate-ping'}`}></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs font-mono text-emerald-400">SECURE</span>
                        </div>
                    </div>
                </motion.div>

                {/* CONTROLS (Search, Filters, Sort) */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col lg:flex-row gap-4 mb-10">

                    {/* Active Search Bar */}
                    <div className="relative flex-1">
                        {isSearching ? (
                            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
                        ) : (
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        )}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search grants or providers (e.g., Google)..."
                            className="w-full pl-11 pr-4 py-3 bg-[#050b14] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50 shadow-inner transition-colors"
                        />
                    </div>

                    {/* Active Tag Filters */}
                    <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 lg:pb-0">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${activeFilter === filter ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-500'}`}
                            >
                                {filter === "All" ? <Filter className="w-3 h-3" /> : <Award className="w-3 h-3" />} {filter}
                            </button>
                        ))}
                    </div>

                    {/* Active Sort Dropdown */}
                    <div className="relative shrink-0 flex items-center bg-[#0d1117] border border-[#30363d] rounded-xl px-4 overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                        <SlidersHorizontal className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-xs text-slate-500 font-mono whitespace-nowrap">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-white font-mono text-xs outline-none py-3 pl-2 cursor-pointer appearance-none"
                        >
                            {sortOptions.map(option => <option key={option} value={option} className="bg-[#0d1117]">{option}</option>)}
                        </select>
                    </div>
                </motion.div>

                {/* DATA FEED RENDERER */}
                {isBooting ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.3)]"></div>
                        <p className="text-emerald-400 font-mono animate-pulse text-sm">Decrypting Financial Ledgers...</p>
                    </div>
                ) : isSearching && displayedScholarships.length === 0 ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
                ) : displayedScholarships.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#30363d] rounded-2xl bg-[#050b14]/50">
                        <Search className="w-10 h-10 text-slate-600 mb-4" />
                        <h3 className="text-white font-mono font-bold text-lg">No Grants Found</h3>
                        <p className="text-slate-500 font-mono text-sm mt-2">Adjust your filters or search query.</p>
                        <button onClick={() => { setSearchQuery(""); setActiveFilter("All"); }} className="mt-4 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono hover:bg-emerald-500/20">Clear Filters</button>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
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
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${scholarship.status === 'Open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                        scholarship.status === 'Closing Soon' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {scholarship.status}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" /> {scholarship.provider}
                                                </span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">{scholarship.title}</h2>
                                        </div>

                                        {/* AI Match Score Badge */}
                                        <div className="flex flex-col items-end shrink-0 ml-4">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-emerald-500/30 bg-emerald-500/5 relative shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:border-emerald-400 transition-colors">
                                                <span className="text-sm font-bold text-emerald-400">{scholarship.matchScore}</span>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#30363d]" />
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="138" strokeDashoffset={138 - (138 * scholarship.matchScore) / 100} className="text-emerald-400 transition-all duration-1000 ease-out" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-mono text-emerald-500/70 mt-1 uppercase tracking-widest">AI Match</span>
                                        </div>
                                    </div>

                                    {/* MASSIVE GLOWING AMOUNT TEXT */}
                                    <div className="my-4 py-4 border-y border-white/5 flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-xl border border-emerald-500/30">
                                            <Banknote className="w-8 h-8 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Grant Value</p>
                                            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                                {scholarship.amount}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-300 mb-6 font-mono">
                                        <Calendar className="w-4 h-4 text-red-400" />
                                        <span className="text-slate-500">Deadline:</span>
                                        <span className="text-white">{scholarship.deadline}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-auto mb-6">
                                        {scholarship.tags.map(tag => (
                                            <span key={tag} className="px-2.5 py-1 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500/70" /> {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-[#30363d] flex justify-between items-center">
                                        <button className="flex items-center gap-2 text-sm font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                                            <Zap className="w-4 h-4" /> Eligibility Check
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold font-mono hover:bg-emerald-400 transition-colors group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                            Apply <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* PAGINATION / LOAD MORE BUTTON */}
                        {hasMoreData && (
                            <div className="col-span-1 lg:col-span-2 flex justify-center mt-6">
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-8 py-3 bg-[#0d1117] border border-emerald-500/30 text-emerald-400 font-mono text-sm rounded-xl hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2"
                                >
                                    <Activity className="w-4 h-4" /> Load Next Financial Block
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <style>{`
        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; } 
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(16,185,129,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(16,185,129,0.8); }
      `}</style>
        </div>
    );
}