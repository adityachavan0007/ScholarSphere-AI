import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, MapPin, DollarSign, Clock, Building2, Zap, ExternalLink,
    Activity, Search, Filter, SlidersHorizontal, Loader2, Code, Terminal, CheckCircle2
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

export default function Internships() {
    // --- STATE MANAGEMENT ---
    const [isBooting, setIsBooting] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [internships, setInternships] = useState<any[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Match Score");

    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 4;

    const filters = ["All", "Remote", "Hybrid", "On-site", "Startup", "FAANG", "Enterprise"];
    const sortOptions = ["Match Score", "Stipend (High-Low)", "Duration (Short-Long)"];

    // --- REAL BACKEND DATA FETCH ---
    useEffect(() => {
        async function fetchInternships() {
            try {
                let { data, error } = await supabase
                    .from('opportunities')
                    .select('*')
                    .eq('type', 'internship');

                if (error) throw error;

                // AUTOMATIC UPDATE: If no internships exist, trigger AI Discovery on port 3001
                if (!data || data.length === 0) {
                    console.log("Internships empty. Triggering AI Autonomous Discovery...");
                    const refreshRes = await fetch("http://127.0.0.1:3001/api/internships/discover");
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        data = refreshData.data; // Use the newly discovered data
                    }
                }

                if (data && data.length > 0) {
                    const transformed = data.map(i => ({
                        id: i.id,
                        role: i.title || "Untitled Role",
                        company: i.domain_tag || "Partner Company",
                        location: i.eligible_states?.[0] || "Remote",
                        stipend: i.reward_summary || "TBD",
                        duration: i.duration || "3-6 Months",
                        // Real match score from DB. Safely defaults to 0 if missing.
                        matchScore: i.match_score || 0,
                        tags: i.eligible_degrees || [],
                        status: i.status || "Actively Hiring",
                        type: i.work_mode || "Remote", // Remote, Hybrid, On-site
                        tier: i.tier || "Startup",
                        link: i.link || "#"
                    }));
                    setInternships(transformed);
                } else {
                    setInternships([]); // Empty state if DB has no internships
                }
            } catch (err) {
                console.error("Error fetching internships from Supabase:", err);
                setInternships([]); // Failsafe
            } finally {
                setIsBooting(false);
            }
        }
        fetchInternships();
    }, []);

    // --- SIMULATE SEARCH DELAY (UX Polish) ---
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
        let data = internships.filter(i =>
            i.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        // 2. Filter by Tags/Type/Tier
        if (activeFilter !== "All") {
            data = data.filter(i => i.type === activeFilter || i.tier === activeFilter);
        }

        // 3. Sort the Data safely
        data.sort((a, b) => {
            if (sortBy === "Match Score") return (b.matchScore || 0) - (a.matchScore || 0);

            if (sortBy === "Duration (Short-Long)") {
                const getDurationNum = (val: string) => parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                return getDurationNum(a.duration) - getDurationNum(b.duration);
            }

            if (sortBy === "Stipend (High-Low)") {
                const parseStipend = (val: string) => parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
                return parseStipend(b.stipend) - parseStipend(a.stipend);
            }
            return 0;
        });

        return data;
    }, [searchQuery, activeFilter, sortBy, internships]);

    const displayedInternships = processedData.slice(0, page * ITEMS_PER_PAGE);
    const hasMoreData = displayedInternships.length < processedData.length;

    return (
        <div className="w-full min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative overflow-hidden">

            {/* Background Grid - Tinted Indigo/Blue for Engineering */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.15)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full">

                {/* HEADER SECTION */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <Terminal className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 font-mono tracking-tight flex items-center gap-2">
                                Intern_Directory <span className="w-3 h-8 bg-indigo-500 animate-pulse inline-block ml-1"></span>
                            </h1>
                        </div>
                        <p className="text-slate-400 font-mono text-sm">Secure elite engineering roles. Real-time industry telemetry.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-[#0d1117] border border-[#30363d] px-4 py-2 rounded-xl shadow-lg">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-mono text-slate-300">API Sync: <span className="text-indigo-400">{isSearching ? "..." : "Live"}</span></span>
                        </div>
                        <div className="w-px h-4 bg-[#30363d]"></div>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className={`absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 ${isSearching ? 'animate-pulse' : 'animate-ping'}`}></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                            <span className="text-xs font-mono text-indigo-400">DATABASE</span>
                        </div>
                    </div>
                </motion.div>

                {/* CONTROLS (Search, Filters, Sort) */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col lg:flex-row gap-4 mb-10">

                    {/* Active Search Bar */}
                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        {isSearching ? (
                            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin z-10" />
                        ) : (
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                        )}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search roles, companies, or tech stack (e.g., Java, Node.js)..."
                            className="relative w-full pl-11 pr-4 py-3 bg-[#050b14] border border-[#30363d] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500/50 shadow-inner transition-colors z-10"
                        />
                    </div>

                    {/* Active Tag Filters */}
                    <div className="flex overflow-x-auto custom-scrollbar gap-2 pb-2 lg:pb-0 z-10">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs whitespace-nowrap transition-all border ${activeFilter === filter ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-[#0d1117] border-[#30363d] text-slate-400 hover:border-slate-500'}`}
                            >
                                {filter === "All" ? <Filter className="w-3 h-3" /> : <Building2 className="w-3 h-3" />} {filter}
                            </button>
                        ))}
                    </div>

                    {/* Active Sort Dropdown */}
                    <div className="relative shrink-0 flex items-center bg-[#0d1117] border border-[#30363d] rounded-xl px-4 overflow-hidden focus-within:border-indigo-500/50 transition-colors z-10">
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
                        <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(99,102,241,0.3)]"></div>
                        <p className="text-indigo-400 font-mono animate-pulse text-sm">Compiling Employer Matrices from Supabase...</p>
                    </div>
                ) : isSearching && displayedInternships.length === 0 ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
                ) : displayedInternships.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[#30363d] rounded-2xl bg-[#050b14]/50">
                        <Code className="w-10 h-10 text-slate-600 mb-4" />
                        <h3 className="text-white font-mono font-bold text-lg">No Roles Found in Database</h3>
                        <p className="text-slate-500 font-mono text-sm mt-2">Adjust your tech stack filters or check if the backend has data.</p>
                        <button onClick={() => { setSearchQuery(""); setActiveFilter("All"); }} className="mt-4 px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-mono hover:bg-indigo-500/20">Clear Filters</button>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
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
                                    {/* Indigo Scanning Laser Effect on Hover */}
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent -translate-x-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4 items-start">
                                            {/* Company "Logo" Block */}
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-[#050b14] border border-[#30363d] flex items-center justify-center shrink-0 shadow-inner group-hover:border-indigo-500/50 transition-colors">
                                                <Building2 className="w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${internship.status === 'Actively Hiring' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                        internship.status === 'Reviewing' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                        }`}>
                                                        {internship.status}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500 border border-[#30363d] px-1.5 py-0.5 rounded">
                                                        {internship.tier}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-slate-500">
                                                        ID: {internship.id.toString().substring(0, 6)}...
                                                    </span>
                                                </div>
                                                <h2 className="text-lg sm:text-xl font-bold text-white font-mono group-hover:text-indigo-300 transition-colors leading-tight">{internship.role}</h2>
                                                <p className="text-sm text-indigo-400 mt-1 font-mono">{internship.company}</p>
                                            </div>
                                        </div>

                                        {/* AI Match Score Badge */}
                                        <div className="flex flex-col items-end shrink-0 ml-2">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-indigo-500/30 bg-indigo-500/5 relative shadow-[0_0_15px_rgba(99,102,241,0.15)] group-hover:border-indigo-400 transition-colors">
                                                <span className="text-sm font-bold text-indigo-400">{internship.matchScore}</span>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#30363d]" />
                                                    <circle cx="22" cy="22" r="22" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="138" strokeDashoffset={138 - (138 * internship.matchScore) / 100} className="text-indigo-400 transition-all duration-1000 ease-out" />
                                                </svg>
                                            </div>
                                            <span className="text-[9px] font-mono text-indigo-500/70 mt-1 uppercase tracking-widest">AI Match</span>
                                        </div>
                                    </div>

                                    {/* INFO GRID */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800/50 rounded-lg border border-[#30363d]"><DollarSign className="w-4 h-4 text-green-400" /></div>
                                            <div>
                                                <p className="text-[10px] font-mono text-slate-500 uppercase">Stipend</p>
                                                <p className="text-sm font-bold text-white font-mono">{internship.stipend}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800/50 rounded-lg border border-[#30363d]"><MapPin className="w-4 h-4 text-blue-400" /></div>
                                            <div>
                                                <p className="text-[10px] font-mono text-slate-500 uppercase">Location</p>
                                                <p className="text-sm font-bold text-white font-mono truncate max-w-[120px]">{internship.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800/50 rounded-lg border border-[#30363d]"><Clock className="w-4 h-4 text-orange-400" /></div>
                                            <div>
                                                <p className="text-[10px] font-mono text-slate-500 uppercase">Duration</p>
                                                <p className="text-sm font-bold text-white font-mono">{internship.duration}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TECH STACK TAGS */}
                                    <div className="flex flex-wrap gap-2 mt-auto mb-6">
                                        {internship.tags.map((tag: string) => (
                                            <span key={tag} className="px-2.5 py-1 text-[11px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center gap-1">
                                                <Code className="w-3 h-3 opacity-70" /> {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* ACTION BAR */}
                                    <div className="pt-4 border-t border-[#30363d] flex justify-between items-center">
                                        <button className="flex items-center gap-2 text-sm font-mono font-bold text-slate-400 hover:text-white transition-colors">
                                            <Briefcase className="w-4 h-4" /> View JD
                                        </button>
                                        <div className="flex gap-3">
                                            <button className="flex items-center justify-center w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-colors group-hover:border-indigo-400">
                                                <Zap className="w-4 h-4" />
                                            </button>
                                            <a href={internship.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold font-mono hover:bg-indigo-500 transition-colors group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                                Fast Apply <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* PAGINATION / LOAD MORE BUTTON */}
                        {hasMoreData && (
                            <div className="col-span-1 lg:col-span-2 flex justify-center mt-6">
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-8 py-3 bg-[#0d1117] border border-indigo-500/30 text-indigo-400 font-mono text-sm rounded-xl hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex items-center gap-2"
                                >
                                    <Activity className="w-4 h-4" /> Load Next Directory Node
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(99,102,241,0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(99,102,241,0.8); }
      `}</style>
        </div>
    );
}