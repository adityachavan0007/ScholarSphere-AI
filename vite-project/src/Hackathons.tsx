import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy, Code, Calendar, MapPin, Zap, ExternalLink,
    Activity, Search, Filter, Cpu, Users, SlidersHorizontal, Loader2
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Hackathons() {
    // --- STATE MANAGEMENT ---
    const [isBooting, setIsBooting] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [hackathons, setHackathons] = useState<any[]>([]);

    // Search, Filter, and Sort States
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Match Score"); // "Match Score" | "Participants" | "Date"

    // Pagination Architecture
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    const filters = ["All", "Hardware", "Web3", "AI/ML", "Online", "Offline"];
    const sortOptions = ["Match Score", "Participants", "Date"];

    // --- REAL BACKEND DATA FETCH ---
    useEffect(() => {
        async function fetchHackathons() {
            try {
                let { data, error } = await supabase
                    .from('opportunities')
                    .select('*')
                    .eq('type', 'hackathon');

                if (error) throw error;

                // AUTOMATIC UPDATE: If no hackathons exist, trigger AI Discovery on port 3001
                if (!data || data.length === 0) {
                    console.log("Matrix empty. Triggering AI Autonomous Discovery...");
                    const refreshRes = await fetch("http://127.0.0.1:3001/api/hackathons/discover");
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        data = refreshData.data; // Use the newly discovered data
                    }
                }

                if (data && data.length > 0) {
                    const transformed = data.map(h => ({
                        id: h.id,
                        title: h.title || "Untitled Hackathon",
                        organizer: h.domain_tag || "Partner Org",
                        date: h.deadline_date ? new Date(h.deadline_date).toLocaleDateString() : "Upcoming",
                        mode: h.eligible_states?.[0] || "Online",
                        matchScore: h.match_score || 0,
                        tags: h.eligible_degrees || [],
                        status: h.status || "Registering",
                        participants: h.participants_count || 0,
                        link: h.link || "#"
                    }));
                    setHackathons(transformed);
                } else {
                    setHackathons([]); 
                }
            } catch (err) {
                console.error("Error fetching hackathons:", err);
                setHackathons([]); 
            } finally {
                setIsBooting(false);
            }
        }
        fetchHackathons();
    }, []);

    // --- SIMULATE SEARCH DELAY (UX Polish) ---
    useEffect(() => {
        if (isBooting) return;
        setIsSearching(true);
        const delay = setTimeout(() => {
            setIsSearching(false);
            setPage(1); // Reset pagination when search changes
        }, 400);
        return () => clearTimeout(delay);
    }, [searchQuery, activeFilter, sortBy]);

    // --- CORE FILTERING & SORTING ENGINE ---
    const processedData = useMemo(() => {
        // 1. Filter by Search Query
        let data = hackathons.filter(h =>
            h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.organizer.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // 2. Filter by Tags/Mode
        if (activeFilter !== "All") {
            data = data.filter(h => h.tags.includes(activeFilter) || h.mode === activeFilter);
        }

        // 3. Sort the Data safely
        data.sort((a, b) => {
            if (sortBy === "Match Score") return (b.matchScore || 0) - (a.matchScore || 0);
            if (sortBy === "Participants") return (b.participants || 0) - (a.participants || 0);
            if (sortBy === "Date") {
                const dateA = a.date !== "Upcoming" ? new Date(a.date).getTime() : 0;
                const dateB = b.date !== "Upcoming" ? new Date(b.date).getTime() : 0;
                return dateA - dateB;
            }
            return 0;
        });

        return data;
    }, [searchQuery, activeFilter, sortBy, hackathons]);

    // 4. Apply Pagination (Slice the array)
    const displayedHackathons = processedData.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreData = displayedHackathons.length < processedData.length;

    return (
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30 relative overflow-hidden">

            {/* Background Grid */}
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
                                Global_Hack_Matrix
                            </h1>
                        </div>
                        <p className="text-slate-400 font-mono text-sm">Real-time telemetry of global builder events.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] px-4 py-2 rounded-xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-mono text-slate-300">API Sync: <span className="text-green-400">{isSearching ? "..." : "Live"}</span></span>
                        </div>
                        <div className="w-px h-4 bg-[#30363d]"></div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={`absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${isSearching ? 'animate-pulse' : 'animate-ping'}`}></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-mono text-green-400">DATABASE</span>
                        </div>
                    </div>
                </motion.div>

                {/* FULLY WORKING CONTROLS (Search, Filters, Sort) */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col lg:flex-row gap-4 mb-10">

                    {/* Active Search Bar */}
                    <div className="relative flex-1">
                        {isSearching ? (
                            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 animate-spin" />
                        ) : (
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        )}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search databases..."
                            className="w-full pl-11 pr-4 py-3 bg-[#050b14] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 shadow-inner transition-colors"
                        />
                    </div>

                    {/* Active Tag Filters */}
                    <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 lg:pb-0">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${activeFilter === filter ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-500'}`}
                            >
                                {filter === "All" ? <Filter className="w-3 h-3" /> : <Cpu className="w-3 h-3" />} {filter}
                            </button>
                        ))}
                    </div>

                    {/* Active Sort Dropdown */}
                    <div className="relative shrink-0 flex items-center bg-[#0d1117] border border-[#30363d] rounded-xl px-4 overflow-hidden focus-within:border-cyan-500/50 transition-colors">
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
                        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_30px_rgba(6,182,212,0.3)]"></div>
                        <p className="text-cyan-400 font-mono animate-pulse text-sm">Querying Supabase Matrix...</p>
                    </div>
                ) : isSearching && displayedHackathons.length === 0 ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-cyan-500 animate-spin" /></div>
                ) : displayedHackathons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#30363d] rounded-2xl bg-[#050b14]/50">
                        <Search className="w-10 h-10 text-slate-600 mb-4" />
                        <h3 className="text-white font-mono font-bold text-lg">No Results Found in Database</h3>
                        <p className="text-slate-500 font-mono text-sm mt-2">Adjust your filters or check if the backend has data.</p>
                        <button onClick={() => { setSearchQuery(""); setActiveFilter("All"); }} className="mt-4 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-mono hover:bg-cyan-500/20">Clear Filters</button>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                        <AnimatePresence>
                            {displayedHackathons.map((hackathon) => (
                                <motion.div
                                    layout
                                    key={hackathon.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                    className="bg-[#0d1117] border border-[#30363d] hover:border-cyan-500/40 rounded-2xl p-6 relative overflow-hidden group shadow-xl"
                                >
                                    {/* Scanning Laser Effect on Hover */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-x-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${hackathon.status === 'Live' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    hackathon.status === 'Registering' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {hackathon.status}
                                                </span>
                                                <span className="text-[10px] font-mono text-slate-500">ID: {hackathon.id.toString().substring(0, 8)}...</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">{hackathon.title}</h2>
                                            <p className="text-sm text-slate-400 mt-1">{hackathon.organizer}</p>
                                        </div>

                                        {/* AI Match Score Badge */}
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-cyan-500/30 bg-cyan-500/5 relative shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 transition-colors">
                                                <span className="text-sm font-bold text-cyan-400">{hackathon.matchScore}</span>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#30363d]" />
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="138" strokeDashoffset={138 - (138 * hackathon.matchScore) / 100} className="text-cyan-400 transition-all duration-1000 ease-out" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-mono text-cyan-500/70 mt-1 uppercase tracking-widest">AI Match</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Calendar className="w-4 h-4 text-purple-400" /> {hackathon.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <MapPin className="w-4 h-4 text-red-400" /> {hackathon.mode}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-300 col-span-2">
                                            <Users className="w-4 h-4 text-green-400" /> {hackathon.participants.toLocaleString()} Developers Enrolled
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {hackathon.tags.map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-[#30363d] flex justify-between items-center">
                                        <button className="flex items-center gap-2 text-sm font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                                            <Zap className="w-4 h-4" /> View Details
                                        </button>
                                        <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg text-sm font-bold font-mono hover:bg-white transition-colors group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                            Apply Now <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* PAGINATION / LOAD MORE BUTTON */}
                        {hasMoreData && (
                            <div className="col-span-1 lg:col-span-2 flex justify-center mt-6">
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-8 py-3 bg-[#0d1117] border border-cyan-500/30 text-cyan-400 font-mono text-sm rounded-xl hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all flex items-center gap-2"
                                >
                                    <Activity className="w-4 h-4" /> Load Next Matrix Block
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(6,182,212,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(6,182,212,0.8); }
      `}</style>
        </div>
    );
}