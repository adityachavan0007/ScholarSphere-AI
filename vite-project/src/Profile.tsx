import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Link as LinkIcon, Github, Briefcase, GraduationCap,
    Code, Edit3, Youtube, Terminal, X, Linkedin,
    BrainCircuit, Target, CheckCircle2, ChevronRight,
    Download, FolderGit2, Calendar, Loader2
} from "lucide-react";
import { supabase } from "./lib/supabaseClient";

// --- 1. DATA SHAPES ---
interface Certificate { id: string; name: string; fileUrl: string; }
interface Project { id: string; name: string; description: string; tags: string[]; link?: string; }
interface Experience { id: string; role: string; company: string; duration: string; description: string; }
interface Education { id: string; degree: string; school: string; duration: string; details: string; }
interface ActivityLog { id: string; date: string; action: string; }
interface AIMatch { title: string; reason: string; }

interface ProfileData {
    name: string; headline: string; bio: string; location: string;
    website: string; github: string; youtube: string;
    avatarUrl: string; bannerUrl: string;
    skills: string[]; certificates: Certificate[]; lookingFor: string[];
    projects: Project[]; experiences: Experience[]; education: Education[];
    recentActivity: ActivityLog[];
}

const EMPTY_PROFILE: ProfileData = {
    name: "", headline: "", bio: "", location: "", website: "", github: "", youtube: "",
    avatarUrl: "", bannerUrl: "", skills: [], certificates: [], lookingFor: [],
    projects: [], experiences: [], education: [], recentActivity: []
};

export default function Profile() {
    // --- STATE ---
    const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // AI Analyzer States
    const [showAnalyzer, setShowAnalyzer] = useState(false);
    const [analyzerStep, setAnalyzerStep] = useState(0);
    const [aiMatches, setAiMatches] = useState<AIMatch[]>([]);

    // Edit Form Temp States
    const [newSkill, setNewSkill] = useState("");
    const [newEdu, setNewEdu] = useState({ school: "", degree: "", duration: "", details: "" });
    const [newExp, setNewExp] = useState({ role: "", company: "", duration: "", description: "" });
    const [newProj, setNewProj] = useState({ name: "", description: "", link: "", tags: "" });

    // ==========================================
    // REAL BACKEND: FETCH PROFILE ON LOAD
    // ==========================================
    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('student_profiles').select('*').eq('id', user.id).single();

                if (data && data.profile_data) {
                    setProfile(data.profile_data);
                } else if (data && data.name) {
                    setProfile({ ...EMPTY_PROFILE, name: data.name });
                }
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, []);

    // ==========================================
    // REAL BACKEND: SAVE PROFILE DATA
    // ==========================================
    const saveProfileToDatabase = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase.from('student_profiles').upsert({
                    id: user.id,
                    name: profile.name,
                    profile_data: profile
                });
                if (error) throw error;
            }
            setIsEditing(false);
        } catch (error: any) {
            console.error("Error saving profile:", error.message);
            alert("Failed to save profile. Check console.");
        } finally {
            setIsSaving(false);
        }
    };

    // ==========================================
    // REAL BACKEND: AI ANALYZER
    // ==========================================
    useEffect(() => {
        if (!showAnalyzer) return;

        const analyzeProfileReal = async () => {
            setAnalyzerStep(0);
            setAiMatches([]);

            try {
                const response = await fetch("http://localhost:3001/api/analyze-profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileData: profile })
                });

                setAnalyzerStep(1);

                if (!response.ok) throw new Error("AI Backend failed");
                const data = await response.json();

                setAnalyzerStep(2);

                setTimeout(() => {
                    setAiMatches(data.matches || [{ title: "System Error", reason: "AI response formatted incorrectly." }]);
                    setAnalyzerStep(3);
                }, 800);

            } catch (error) {
                console.error("Analyzer failed", error);
                setAiMatches([{ title: "Connection Failed", reason: "Could not reach the AI Mainframe. Check backend server." }]);
                setAnalyzerStep(3);
            }
        };

        analyzeProfileReal();
    }, [showAnalyzer]);

    // --- HANDLERS ---


    const addSkill = () => { if (newSkill.trim() && !profile.skills.includes(newSkill)) { setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] }); setNewSkill(""); } };
    const removeSkill = (skillToRemove: string) => setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });

    const addEducation = () => {
        if (newEdu.school && newEdu.degree) {
            setProfile({ ...profile, education: [...profile.education, { id: Date.now().toString(), ...newEdu }] });
            setNewEdu({ school: "", degree: "", duration: "", details: "" });
        }
    };
    const removeEducation = (id: string) => setProfile({ ...profile, education: profile.education.filter(e => e.id !== id) });

    const addExperience = () => {
        if (newExp.company && newExp.role) {
            setProfile({ ...profile, experiences: [...profile.experiences, { id: Date.now().toString(), ...newExp }] });
            setNewExp({ role: "", company: "", duration: "", description: "" });
        }
    };
    const removeExperience = (id: string) => setProfile({ ...profile, experiences: profile.experiences.filter(e => e.id !== id) });

    const addProject = () => {
        if (newProj.name && newProj.description) {
            const tagsArray = newProj.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
            setProfile({ ...profile, projects: [...profile.projects, { id: Date.now().toString(), name: newProj.name, description: newProj.description, link: newProj.link, tags: tagsArray }] });
            setNewProj({ name: "", description: "", link: "", tags: "" });
        }
    };
    const removeProject = (id: string) => setProfile({ ...profile, projects: profile.projects.filter(p => p.id !== id) });

    if (isLoading) {
        return <div className="min-h-screen bg-[#030712] flex items-center justify-center text-sky-500 font-mono"><Loader2 className="w-8 h-8 animate-spin mr-3" /> Querying Database...</div>;
    }

    if (!profile.name && !isEditing) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen pt-16 bg-[#030712] px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 text-center bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl">
                    <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-sky-500/10 border border-sky-500/30"><Terminal className="w-10 h-10 text-sky-400" /></div></div>
                    <h2 className="mb-2 text-2xl font-bold text-white font-mono">Initialize Profile</h2>
                    <p className="mb-8 text-sm text-slate-400">Let's set up your developer portfolio.</p>
                    <div className="space-y-4">
                        <button onClick={() => setIsEditing(true)} className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all bg-sky-600 hover:bg-sky-500 rounded-lg"><Edit3 size={18} /> Setup Manually</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#030712] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* HEADER */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full overflow-hidden bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl">
                    <div className="h-32 sm:h-48 relative overflow-hidden bg-[#050b14]">
                        {profile.bannerUrl ? <img src={profile.bannerUrl} alt="Profile Banner" className="w-full h-full object-cover opacity-60 mix-blend-screen" /> : <div className="absolute inset-0 bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-purple-900/40"><div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div></div>}
                    </div>

                    <div className="px-6 pb-6 sm:px-10">
                        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-end">
                            <div className="relative flex items-end -mt-12 sm:-mt-16">
                                <div className="p-1.5 bg-[#0d1117] rounded-2xl border border-[#30363d] relative group cursor-pointer" onClick={() => setIsEditing(true)}>
                                    <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-[#30363d] group-hover:border-sky-500/50 transition-all overflow-hidden relative">
                                        {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <Terminal className="w-10 h-10 text-sky-400 sm:w-12 sm:h-12" />}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Edit3 className="w-6 h-6 text-white" /></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                                <button className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg bg-[#21262d] border-[#30363d] text-slate-300 hover:bg-[#30363d] hover:text-white flex items-center gap-2">
                                    <Download className="w-4 h-4" /> export_cv.pdf
                                </button>
                                <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg bg-[#21262d] border-[#30363d] text-slate-300 hover:bg-[#30363d] hover:text-white flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                                <button onClick={() => setShowAnalyzer(true)} className="px-4 py-2 text-sm font-bold text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-500/30 flex items-center gap-2 font-mono">
                                    <BrainCircuit className="w-4 h-4 animate-pulse" /> AI Analyzer
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl font-mono">{profile.name || "Anonymous Developer"}</h1>
                            <p className="mt-1 text-base text-sky-400 font-mono">{profile.headline || "Add a headline to stand out"}</p>

                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                                {profile.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</span>}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* COLUMNS */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* LEFT COLUMN (MAIN CONTENT) */}
                    <div className="space-y-6 lg:col-span-2">

                        {/* Bio */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-white font-mono"><span className="text-sky-400">{">"}</span> about_me.md</h2>
                            <p className="leading-relaxed text-slate-400 text-sm sm:text-base whitespace-pre-line">{profile.bio || "No bio added yet."}</p>
                        </div>

                        {/* ===================================== */}
                        {/* ANIMATED TIMELINE: EDUCATION          */}
                        {/* ===================================== */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-8 text-lg font-bold text-white font-mono"><GraduationCap className="w-5 h-5 text-blue-400" /> Education Matrix</h2>

                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-[#30363d] before:to-transparent">
                                {profile.education.length === 0 ? <p className="text-sm text-slate-500 ml-8">No education matrix initialized.</p> : profile.education.map((edu, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                                        key={edu.id}
                                        className="relative pl-8 group"
                                    >
                                        {/* Glowing Timeline Dot */}
                                        <div className="absolute w-4 h-4 bg-[#0d1117] rounded-full left-[4px] top-1.5 border-2 border-blue-500 z-10 group-hover:bg-blue-500 transition-colors duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                                        {/* Content Card */}
                                        <div className="bg-[#010409] border border-[#30363d] p-5 rounded-xl group-hover:border-blue-500/50 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] relative">
                                            {/* Subtle internal gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>

                                            <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{edu.school}</h3>
                                            <p className="text-sky-400 font-medium text-sm mt-1">{edu.degree}</p>
                                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> {edu.duration}</p>
                                            {edu.details && <p className="text-sm text-slate-400 mt-3 leading-relaxed border-t border-[#30363d] pt-3">{edu.details}</p>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* ===================================== */}
                        {/* ANIMATED TIMELINE: EXPERIENCE         */}
                        {/* ===================================== */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-8 text-lg font-bold text-white font-mono"><Briefcase className="w-5 h-5 text-indigo-400" /> Experience Log</h2>

                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-[#30363d] before:to-transparent">
                                {profile.experiences.length === 0 ? <p className="text-sm text-slate-500 ml-8">No experience logs found.</p> : profile.experiences.map((exp, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                                        key={exp.id}
                                        className="relative pl-8 group"
                                    >
                                        {/* Glowing Timeline Dot */}
                                        <div className="absolute w-4 h-4 bg-[#0d1117] rounded-full left-[4px] top-1.5 border-2 border-indigo-500 z-10 group-hover:bg-indigo-500 transition-colors duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>

                                        {/* Content Card */}
                                        <div className="bg-[#010409] border border-[#30363d] p-5 rounded-xl group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] relative">
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>

                                            <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">{exp.role}</h3>
                                            <p className="text-indigo-400 font-medium text-sm mt-1">{exp.company}</p>
                                            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.duration}</p>
                                            {exp.description && <p className="text-sm text-slate-400 mt-3 leading-relaxed border-t border-[#30363d] pt-3">{exp.description}</p>}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Featured Projects */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-6 text-lg font-bold text-white font-mono"><FolderGit2 className="w-5 h-5 text-green-400" /> Featured Projects</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profile.projects.length === 0 ? <p className="text-sm text-slate-500 col-span-2">No projects added.</p> : profile.projects.map(proj => (
                                    <div key={proj.id} className="p-5 border rounded-xl bg-[#010409] border-[#30363d] hover:border-green-500/50 transition-all group flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-white font-mono text-sm group-hover:text-green-400 transition-colors">{proj.name}</h3>
                                            {proj.link && <LinkIcon className="w-4 h-4 text-slate-500 group-hover:text-green-400" />}
                                        </div>
                                        <p className="text-sm text-slate-400 mb-4 flex-grow">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {proj.tags.map(tag => <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-300">{tag}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN (SIDEBAR) */}
                    <div className="space-y-6">

                        {/* Tech Stack */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-white font-mono"><Code className="w-5 h-5 text-purple-400" /> Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.length === 0 ? <p className="text-sm text-slate-500">No skills added.</p> : profile.skills.map((skill) => (
                                    <span key={skill} className="px-3 py-1 text-xs font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-md">{skill}</span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="mb-4 text-lg font-bold text-white font-mono">Links</h2>
                            <div className="space-y-3">
                                {profile.github && (
                                    <a href={`https://${profile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border rounded-lg bg-[#010409] border-[#30363d] hover:border-slate-500 transition-colors">
                                        <Github className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-300">{profile.github}</span>
                                    </a>
                                )}
                                {profile.youtube && (
                                    <a href={`https://youtube.com/@${profile.youtube}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border rounded-lg bg-[#010409] border-[#30363d] hover:border-red-500/50 transition-colors">
                                        <Youtube className="w-5 h-5 text-red-500" />
                                        <span className="text-sm text-slate-300">{profile.youtube}</span>
                                    </a>
                                )}
                                {profile.website && (
                                    <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border rounded-lg bg-[#010409] border-[#30363d] hover:border-sky-500/50 transition-colors">
                                        <LinkIcon className="w-5 h-5 text-sky-400" />
                                        <span className="text-sm text-slate-300">{profile.website}</span>
                                    </a>
                                )}
                                {!profile.github && !profile.youtube && !profile.website && <p className="text-sm text-slate-500">No links added.</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- THE EDIT MODAL OVERLAY --- */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                            <div className="flex justify-between items-center p-4 border-b border-[#30363d] bg-[#161b22]">
                                <h2 className="text-lg font-bold text-white font-mono">sudo nano profile.config</h2>
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">

                                {/* BASIC INFO */}
                                <form id="editProfileForm" onSubmit={(e) => { e.preventDefault(); saveProfileToDatabase(); }} className="space-y-4">
                                    <div><label className="block mb-1 text-xs text-slate-400 font-mono">FULL_NAME</label><input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono focus:border-sky-500 outline-none" required /></div>
                                    <div><label className="block mb-1 text-xs text-slate-400 font-mono">HEADLINE</label><input type="text" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono focus:border-sky-500 outline-none" /></div>
                                    <div><label className="block mb-1 text-xs text-slate-400 font-mono">LOCATION</label><input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono focus:border-sky-500 outline-none" /></div>
                                    <div><label className="block mb-1 text-xs text-slate-400 font-mono">BIO_MARKDOWN</label><textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="w-full h-24 px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono focus:border-sky-500 outline-none resize-none"></textarea></div>
                                </form>

                                {/* EDUCATION BUILDER */}
                                <div className="pt-6 border-t border-[#30363d]">
                                    <label className="block mb-4 text-sm font-bold text-blue-400 font-mono">EDUCATION_ARRAY</label>
                                    {profile.education.map(edu => (
                                        <div key={edu.id} className="flex justify-between items-start p-3 mb-2 bg-[#010409] border border-[#30363d] rounded-lg">
                                            <div><p className="text-sm font-bold text-white">{edu.school}</p><p className="text-xs text-slate-400">{edu.degree}</p></div>
                                            <button type="button" onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                        <input type="text" value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="School/University" />
                                        <input type="text" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="Degree (e.g. B.Tech IT)" />
                                        <input type="text" value={newEdu.duration} onChange={e => setNewEdu({ ...newEdu, duration: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="Duration (e.g. 2025-2029)" />
                                        <input type="text" value={newEdu.details} onChange={e => setNewEdu({ ...newEdu, details: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="Details/GPA" />
                                        <button type="button" onClick={addEducation} className="col-span-1 sm:col-span-2 px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white hover:bg-[#30363d]">Add Education</button>
                                    </div>
                                </div>

                                {/* EXPERIENCE BUILDER */}
                                <div className="pt-6 border-t border-[#30363d]">
                                    <label className="block mb-4 text-sm font-bold text-indigo-400 font-mono">EXPERIENCE_ARRAY</label>
                                    {profile.experiences.map(exp => (
                                        <div key={exp.id} className="flex justify-between items-start p-3 mb-2 bg-[#010409] border border-[#30363d] rounded-lg">
                                            <div><p className="text-sm font-bold text-white">{exp.role}</p><p className="text-xs text-slate-400">{exp.company}</p></div>
                                            <button type="button" onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                        <input type="text" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-indigo-500" placeholder="Role/Title" />
                                        <input type="text" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-indigo-500" placeholder="Company/Hackathon" />
                                        <input type="text" value={newExp.duration} onChange={e => setNewExp({ ...newExp, duration: e.target.value })} className="col-span-1 sm:col-span-2 px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-indigo-500" placeholder="Duration (e.g. Jan 2026 - Present)" />
                                        <textarea value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} className="col-span-1 sm:col-span-2 h-16 px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-indigo-500 resize-none" placeholder="Description of your work..."></textarea>
                                        <button type="button" onClick={addExperience} className="col-span-1 sm:col-span-2 px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white hover:bg-[#30363d]">Add Experience</button>
                                    </div>
                                </div>

                                {/* SKILLS */}
                                <div className="pt-6 border-t border-[#30363d]">
                                    <label className="block mb-2 text-xs text-slate-400 font-mono">TECH_STACK_ARRAY</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} className="flex-1 px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-sky-500" placeholder="Type a skill & press Enter" />
                                        <button type="button" onClick={addSkill} className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white hover:bg-[#30363d]">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {profile.skills.map(skill => (
                                            <span key={skill} className="flex items-center gap-1 px-3 py-1 text-xs text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-md">
                                                {skill} <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                 {/* PROJECTS BUILDER */}
                                 <div className="pt-6 border-t border-[#30363d]">
                                     <label className="block mb-4 text-sm font-bold text-green-400 font-mono">PROJECTS_ARRAY</label>
                                     {profile.projects.map(proj => (
                                         <div key={proj.id} className="flex justify-between items-start p-3 mb-2 bg-[#010409] border border-[#30363d] rounded-lg">
                                             <div><p className="text-sm font-bold text-white">{proj.name}</p><p className="text-xs text-slate-400">{proj.description.substring(0, 50)}...</p></div>
                                             <button type="button" onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
                                         </div>
                                     ))}
                                     <div className="grid grid-cols-1 gap-3 mt-3">
                                         <input type="text" value={newProj.name} onChange={e => setNewProj({ ...newProj, name: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Project Name" />
                                         <textarea value={newProj.description} onChange={e => setNewProj({ ...newProj, description: e.target.value })} className="h-16 px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500 resize-none" placeholder="Description"></textarea>
                                         <input type="text" value={newProj.link} onChange={e => setNewProj({ ...newProj, link: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Link (Optional)" />
                                         <input type="text" value={newProj.tags} onChange={e => setNewProj({ ...newProj, tags: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Tags (comma separated)" />
                                         <button type="button" onClick={addProject} className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white hover:bg-[#30363d]">Add Project</button>
                                     </div>
                                 </div>

                                 {/* LINKS */}
                                 <div className="pt-6 border-t border-[#30363d]">
                                     <label className="block mb-4 text-sm font-bold text-slate-300 font-mono">SOCIAL LINKS</label>
                                     <div className="space-y-3">
                                         <input type="text" value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-slate-500" placeholder="github.com/username" />
                                         <input type="text" value={profile.youtube} onChange={e => setProfile({ ...profile, youtube: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-red-500" placeholder="youtube.com/@channel" />
                                         <input type="text" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-sky-500" placeholder="yourportfolio.dev" />
                                     </div>
                                 </div>
                            </div>

                            {/* SAVE BUTTON */}
                            <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex justify-end">
                                <button type="submit" form="editProfileForm" disabled={isSaving} className="px-8 py-3 font-bold text-white rounded-lg bg-sky-600 hover:bg-sky-500 font-mono shadow-[0_0_20px_rgba(2,132,199,0.3)] disabled:opacity-50 flex items-center gap-2">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? "Syncing..." : "Save Setup"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- REAL AI PROFILE ANALYZER MODAL --- */}
            <AnimatePresence>
                {showAnalyzer && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-lg bg-[#0d1117] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(147,51,234,0.3)] overflow-hidden">
                            <div className="flex items-center gap-2 p-4 bg-[#161b22] border-b border-[#30363d]">
                                <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
                                <h2 className="text-sm font-bold text-white font-mono">ScholarSphere AI Engine</h2>
                                <div className="flex-1"></div>
                                <button onClick={() => setShowAnalyzer(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                            </div>
                            <div className="p-6 font-mono text-sm">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {analyzerStep >= 0 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <div className="w-4 h-4 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div>}
                                        <span className={analyzerStep >= 0 ? "text-slate-300" : "text-slate-500"}>Uploading matrix for {profile.name || "User"}...</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {analyzerStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : (analyzerStep === 0 ? <div className="w-4 h-4 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div> : <div className="w-4 h-4"></div>)}
                                        <span className={analyzerStep >= 1 ? "text-slate-300" : "text-slate-500"}>Evaluating stack: [{profile.skills.slice(0, 3).join(", ")}{profile.skills.length > 3 ? "..." : ""}]</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {analyzerStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : (analyzerStep === 1 ? <div className="w-4 h-4 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div> : <div className="w-4 h-4"></div>)}
                                        <span className={analyzerStep >= 2 ? "text-slate-300" : "text-slate-500"}>Cross-referencing real-time opportunities...</span>
                                    </div>
                                </div>

                                {analyzerStep >= 3 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-6 border-t border-[#30363d]">
                                        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> High-Probability Matches Found:</h3>
                                        <div className="space-y-3">
                                            {aiMatches.map((match, idx) => (
                                                <div key={idx} className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg group cursor-pointer hover:bg-purple-500/20 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="text-white font-bold text-sm">{match.title}</div>
                                                            <div className="text-slate-400 text-xs mt-1">{match.reason}</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform mt-1" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #30363d; border-radius: 10px; }`}</style>
        </div>
    );
}