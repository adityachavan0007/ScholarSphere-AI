import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Link as LinkIcon, Github, Briefcase, GraduationCap,
    Code, Edit3, Sparkles, Youtube, Terminal, X,
    BrainCircuit, Target, CheckCircle2, ChevronRight,
    Download, FolderGit2, Calendar, Loader2, User, Plus
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
    availability: "Seeking Internships" | "Looking for Teammates" | "Building in Stealth" | "Unavailable";
}

const EMPTY_PROFILE: ProfileData = {
    name: "", headline: "", bio: "", location: "", website: "", github: "", youtube: "",
    avatarUrl: "", bannerUrl: "", skills: [], certificates: [], lookingFor: [],
    projects: [], experiences: [], education: [], recentActivity: [],
    availability: "Seeking Internships"
};

// --- ANIMATION VARIANTS ---
const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

// --- STATUS CONFIGURATION ---
const STATUS_STYLES = {
    "Seeking Internships": { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/50", glow: "shadow-[0_0_30px_rgba(34,197,94,0.4)]", dot: "bg-green-500" },
    "Looking for Teammates": { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/50", glow: "shadow-[0_0_30px_rgba(59,130,246,0.4)]", dot: "bg-blue-500" },
    "Building in Stealth": { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/50", glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]", dot: "bg-purple-500" },
    "Unavailable": { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-[#30363d]", glow: "", dot: "bg-slate-500" },
};

export default function Profile() {
    // --- STATE ---
    const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // AI Analyzer States
    const [showAnalyzer, setShowAnalyzer] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiMatches, setAiMatches] = useState<AIMatch[]>([]);

    // Edit Form Temp States
    const [newSkill, setNewSkill] = useState("");
    const [newEdu, setNewEdu] = useState({ school: "", degree: "", duration: "", details: "" });
    const [newExp, setNewExp] = useState({ role: "", company: "", duration: "", description: "" });
    const [newProj, setNewProj] = useState({ name: "", description: "", link: "", tags: "" });

    // ==========================================
    // HYPER-OPTIMIZED BACKEND FETCH
    // ==========================================
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // FASTER AUTH: Read local session memory instead of pinging Auth server
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    const { data, error } = await supabase
                        .from('student_profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (error && error.code !== 'PGRST116') throw error;

                    if (data && data.profile_data) {
                        setProfile({ ...EMPTY_PROFILE, ...data.profile_data });
                    } else if (data && data.name) {
                        setProfile({ ...EMPTY_PROFILE, name: data.name });
                    }
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                // INSTANT CLEAR: No fake delays
                setIsLoading(false);
            }
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
    // FEATURE: ONE-CLICK PDF RESUME GENERATOR
    // ==========================================
    const handleDownloadCV = async () => {
        setIsGeneratingPDF(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.createElement('div');

            let htmlContent = `
                <div style="padding: 40px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #111; line-height: 1.5;">
                    <h1 style="font-size: 28px; margin: 0 0 5px 0; color: #000; text-transform: uppercase; letter-spacing: 1px;">${profile.name || 'Developer'}</h1>
                    <p style="font-size: 14px; margin: 0 0 20px 0; color: #555;">
                        ${profile.location ? profile.location + ' | ' : ''}
                        ${profile.website ? profile.website + ' | ' : ''}
                        ${profile.github ? 'github.com/' + profile.github : ''}
                    </p>
                    
                    <p style="font-size: 12px; margin-bottom: 25px;">${profile.bio}</p>
            `;

            if (profile.education.length > 0) {
                htmlContent += `
                    <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 5px; margin: 20px 0 10px 0; text-transform: uppercase;">Education</h2>
                    ${profile.education.map(edu => `
                        <div style="margin-bottom: 10px;">
                            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px;">
                                <span>${edu.school}</span>
                                <span>${edu.duration}</span>
                            </div>
                            <div style="font-size: 13px; font-style: italic;">${edu.degree}</div>
                            ${edu.details ? `<div style="font-size: 12px; margin-top: 3px;">${edu.details}</div>` : ''}
                        </div>
                    `).join('')}
                `;
            }

            if (profile.experiences.length > 0) {
                htmlContent += `
                    <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 5px; margin: 20px 0 10px 0; text-transform: uppercase;">Experience</h2>
                    ${profile.experiences.map(exp => `
                        <div style="margin-bottom: 12px;">
                            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px;">
                                <span>${exp.role}</span>
                                <span>${exp.duration}</span>
                            </div>
                            <div style="font-size: 13px; font-style: italic; margin-bottom: 4px;">${exp.company}</div>
                            <div style="font-size: 12px;">${exp.description}</div>
                        </div>
                    `).join('')}
                `;
            }

            if (profile.projects.length > 0) {
                htmlContent += `
                    <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 5px; margin: 20px 0 10px 0; text-transform: uppercase;">Projects</h2>
                    ${profile.projects.map(proj => `
                        <div style="margin-bottom: 10px;">
                            <div style="font-weight: bold; font-size: 14px;">
                                ${proj.name} ${proj.link ? `| <span style="font-weight: normal; font-size: 12px; color: #555;">${proj.link}</span>` : ''}
                            </div>
                            <div style="font-size: 12px; margin-top: 3px;">${proj.description}</div>
                            <div style="font-size: 11px; color: #555; margin-top: 3px;">Tech: ${proj.tags.join(', ')}</div>
                        </div>
                    `).join('')}
                `;
            }

            if (profile.skills.length > 0) {
                htmlContent += `
                    <h2 style="font-size: 16px; border-bottom: 1px solid #000; padding-bottom: 5px; margin: 20px 0 10px 0; text-transform: uppercase;">Skills</h2>
                    <div style="font-size: 13px;">
                        ${profile.skills.join(' • ')}
                    </div>
                `;
            }

            htmlContent += `
                    <div style="margin-top: 40px; padding-top: 10px; border-top: 1px solid #ccc; text-align: center; font-size: 10px; color: #888;">
                        Automatically generated via ScholarSphere AI Matrix
                    </div>
                </div>
            `;
            element.innerHTML = htmlContent;

            const opt = {
                margin: [0, 0, 0, 0],
                filename: `${profile.name ? profile.name.replace(/\s+/g, '_') : 'Developer'}_Resume.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();

        } catch (error) {
            console.error("PDF Generation failed:", error);
            alert("Failed to generate PDF. Make sure you installed html2pdf.js");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    // ==========================================
    // REAL BACKEND: FAST AI ANALYZER
    // ==========================================
    useEffect(() => {
        if (!showAnalyzer) return;

        const analyzeProfileReal = async () => {
            setIsAnalyzing(true);
            setAiMatches([]);

            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
                const response = await fetch(`${API_URL}/api/analyze-profile`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ profileData: profile })
                });

                if (!response.ok) throw new Error("AI Backend failed");
                const data = await response.json();

                setAiMatches(data.matches || [{ title: "System Error", reason: "AI response formatted incorrectly." }]);
            } catch (error) {
                console.error("Analyzer failed", error);
                setAiMatches([{ title: "Connection Failed", reason: "Could not reach the AI Mainframe. Check backend server." }]);
            } finally {
                setIsAnalyzing(false);
            }
        };

        analyzeProfileReal();
    }, [showAnalyzer]);

    // --- HANDLERS ---
    const handleGithubImport = async () => alert("GitHub import requires backend OAuth integration. Currently disabled.");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'avatar') setProfile({ ...profile, avatarUrl: reader.result as string });
                if (type === 'banner') setProfile({ ...profile, bannerUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

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

    // Status Setup
    const activeStatus = STATUS_STYLES[profile.availability || "Unavailable"];

    // --- HIGH END LOADER ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center font-mono selection:bg-sky-500/30">
                <div className="relative flex items-center justify-center w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-sky-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-sky-400 rounded-full animate-spin"></div>
                    <Terminal className="w-8 h-8 text-sky-400 animate-pulse" />
                </div>
                <p className="text-sky-400 text-sm tracking-widest uppercase">Decypting Profile Matrix...</p>
            </div>
        );
    }

    // --- INITIALIZE EMPTY PROFILE STATE ---
    if (!profile.name && !isEditing) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen pt-16 bg-[#030712] px-4">
                <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 100 }} className="w-full max-w-md p-8 text-center bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/10 border border-sky-500/30 shadow-inner">
                            <User className="w-10 h-10 text-sky-400" />
                        </div>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-white font-mono tracking-tight">Initialize Identity</h2>
                    <p className="mb-8 text-sm text-slate-400">Your developer portfolio awaits setup.</p>
                    <div className="space-y-4">
                        <button onClick={handleGithubImport} disabled={isImporting} className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-xl disabled:opacity-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Github size={18} /> Sync from GitHub</>}
                        </button>
                        <div className="flex items-center gap-4 py-2"><div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#30363d]"></div><span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">Or Build Manually</span><div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#30363d]"></div></div>
                        <button onClick={() => setIsEditing(true)} className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all bg-sky-600 hover:bg-sky-500 rounded-xl shadow-[0_0_20px_rgba(2,132,199,0.3)] hover:shadow-[0_0_30px_rgba(2,132,199,0.5)]">
                            <Edit3 size={18} /> Enter Setup Matrix
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#030712] pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/30 relative">
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="max-w-5xl mx-auto space-y-8 relative z-10"
            >
                {/* PROFILE CONTAINER HEADER */}
                <motion.div variants={fadeUp} className="relative w-full overflow-hidden bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] hover:border-sky-500/30 transition-colors duration-500 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                    <div className="h-32 sm:h-56 relative overflow-hidden bg-[#050b14]">
                        {profile.bannerUrl ? (
                            <img src={profile.bannerUrl} alt="Profile Banner" className="w-full h-full object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-900/40 via-indigo-900/40 to-purple-900/40">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 pb-8 sm:px-10">
                        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-end">
                            <div className="relative flex items-end -mt-16 sm:-mt-20">
                                <div className={`p-2 bg-[#0d1117] rounded-3xl border ${activeStatus.border} ${activeStatus.glow} relative cursor-pointer transition-all duration-500`} onClick={() => setIsEditing(true)}>
                                    <div className={`flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-[#30363d] transition-all overflow-hidden relative shadow-inner group/avatar`}>
                                        {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <Terminal className="w-12 h-12 text-sky-400 sm:w-14 sm:h-14" />}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"><Edit3 className="w-6 h-6 text-white" /></div>
                                    </div>
                                    {/* STATUS INDICATOR DOT */}
                                    <div className={`absolute bottom-4 right-4 w-5 h-5 ${activeStatus.dot} rounded-full border-4 border-[#0d1117]`}></div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-6 sm:mt-0">
                                <button onClick={handleDownloadCV} disabled={isGeneratingPDF} className="px-5 py-2.5 text-sm font-bold font-mono transition-all border rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2 disabled:opacity-50">
                                    {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    {isGeneratingPDF ? "Generating PDF..." : "Download CV"}
                                </button>
                                <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 text-sm font-bold font-mono transition-all border rounded-xl bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => setShowAnalyzer(true)} className="px-5 py-2.5 text-sm font-bold text-white transition-all rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] border border-purple-500/30 flex items-center gap-2 font-mono">
                                    <BrainCircuit className="w-4 h-4 animate-pulse" /> Analyzer
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="text-3xl font-extrabold text-transparent sm:text-4xl font-mono bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                                    {profile.name || "Anonymous Developer"}
                                </h1>
                                {/* STATUS BADGE */}
                                <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${activeStatus.bg} ${activeStatus.color} ${activeStatus.border}`}>
                                    {profile.availability || "Unavailable"}
                                </span>
                            </div>
                            <p className="mt-2 text-lg text-sky-400 font-mono tracking-wide">{profile.headline || "Add a headline to stand out"}</p>

                            <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-slate-400 font-mono">
                                {profile.location && <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CORE PROFILE GRID COLUMNS */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* MAIN TRACKS */}
                    <div className="space-y-8 lg:col-span-2">

                        {/* About/Bio */}
                        <motion.div variants={fadeUp} className="p-8 bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] hover:border-[#4b5563] transition-colors rounded-3xl shadow-xl">
                            <h2 className="flex items-center gap-2 mb-6 text-xl font-bold text-white font-mono tracking-tight"><span className="text-sky-400">{">"}</span> about_me.md</h2>
                            <p className="leading-relaxed text-slate-400 text-sm sm:text-base whitespace-pre-line">{profile.bio || "No bio added yet."}</p>
                        </motion.div>

                        {/* Education Timeline */}
                        <motion.div variants={fadeUp} className="p-8 bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] hover:border-[#4b5563] transition-colors rounded-3xl shadow-xl">
                            <h2 className="flex items-center gap-3 mb-10 text-xl font-bold text-white font-mono tracking-tight"><GraduationCap className="w-6 h-6 text-blue-400" /> Education Matrix</h2>
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-[#30363d] before:to-transparent">
                                {profile.education.length === 0 ? <p className="text-sm text-slate-500 ml-8 font-mono">No education matrix initialized.</p> : profile.education.map((edu, idx) => (
                                    <div key={edu.id} className="relative pl-8 group">
                                        <div className="absolute w-4 h-4 bg-[#0d1117] rounded-full left-[4px] top-1.5 border-2 border-blue-500 z-10 group-hover:bg-blue-500 transition-colors duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        <div className="bg-[#010409] border border-[#30363d] p-6 rounded-2xl group-hover:border-blue-500/50 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                            <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{edu.school}</h3>
                                            <p className="text-sky-400 font-medium text-sm mt-1">{edu.degree}</p>
                                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-mono"><Calendar className="w-3.5 h-3.5" /> {edu.duration}</p>
                                            {edu.details && <p className="text-sm text-slate-400 mt-4 leading-relaxed border-t border-[#30363d] pt-4">{edu.details}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Experience Timeline */}
                        <motion.div variants={fadeUp} className="p-8 bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] hover:border-[#4b5563] transition-colors rounded-3xl shadow-xl">
                            <h2 className="flex items-center gap-3 mb-10 text-xl font-bold text-white font-mono tracking-tight"><Briefcase className="w-6 h-6 text-indigo-400" /> Experience Log</h2>
                            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-[#30363d] before:to-transparent">
                                {profile.experiences.length === 0 ? <p className="text-sm text-slate-500 ml-8 font-mono">No experience logs found.</p> : profile.experiences.map((exp, idx) => (
                                    <div key={exp.id} className="relative pl-8 group">
                                        <div className="absolute w-4 h-4 bg-[#0d1117] rounded-full left-[4px] top-1.5 border-2 border-indigo-500 z-10 group-hover:bg-indigo-500 transition-colors duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                        <div className="bg-[#010409] border border-[#30363d] p-6 rounded-2xl group-hover:border-indigo-500/50 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                            <h3 className="font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">{exp.role}</h3>
                                            <p className="text-indigo-400 font-medium text-sm mt-1">{exp.company}</p>
                                            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-mono"><Calendar className="w-3.5 h-3.5" /> {exp.duration}</p>
                                            {exp.description && <p className="text-sm text-slate-400 mt-4 leading-relaxed border-t border-[#30363d] pt-4">{exp.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Projects */}
                        <motion.div variants={fadeUp} className="p-8 bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] hover:border-[#4b5563] transition-colors rounded-3xl shadow-xl">
                            <h2 className="flex items-center gap-3 mb-8 text-xl font-bold text-white font-mono tracking-tight"><FolderGit2 className="w-6 h-6 text-green-400" /> Featured Projects</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {profile.projects.length === 0 ? <p className="text-sm text-slate-500 col-span-2 font-mono">No projects added.</p> : profile.projects.map(proj => (
                                    <div key={proj.id} className="p-6 border rounded-2xl bg-[#010409] border-[#30363d] hover:border-green-500/50 transition-all group flex flex-col h-full shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent -translate-x-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></div>
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-bold text-white font-mono text-base group-hover:text-green-400 transition-colors">{proj.name}</h3>
                                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer"><LinkIcon className="w-4 h-4 text-slate-500 hover:text-green-400 transition-colors" /></a>}
                                        </div>
                                        <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {proj.tags.map(tag => <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-300">{tag}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT PANEL CHIPS - STICKY FOR HIGH END UX */}
                    <div className="space-y-8 lg:sticky lg:top-24 h-fit">
                        {/* Tech Stack */}
                        <motion.div variants={fadeUp} className="p-8 bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] hover:border-[#4b5563] transition-colors rounded-3xl shadow-xl">
                            <h2 className="flex items-center gap-3 mb-6 text-xl font-bold text-white font-mono tracking-tight"><Code className="w-6 h-6 text-purple-400" /> Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.length === 0 ? <p className="text-sm text-slate-500 font-mono">No skills added.</p> : profile.skills.map((skill) => (
                                    <span key={skill} className="px-3.5 py-1.5 text-xs font-mono font-medium text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-lg">{skill}</span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Social Anchors */}
                        <motion.div variants={fadeUp} className="p-8 bg-[#0d1117]/80 backdrop-blur-xl border border-[#30363d] hover:border-[#4b5563] transition-colors rounded-3xl shadow-xl">
                            <h2 className="mb-6 text-xl font-bold text-white font-mono tracking-tight">Access Nodes</h2>
                            <div className="space-y-3">
                                {profile.github && (
                                    <a href={`https://${profile.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border rounded-xl bg-[#010409] border-[#30363d] hover:border-slate-400 transition-all group shadow-sm">
                                        <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                        <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">{profile.github}</span>
                                    </a>
                                )}
                                {profile.youtube && (
                                    <a href={`https://youtube.com/@${profile.youtube}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border rounded-xl bg-[#010409] border-[#30363d] hover:border-red-500/50 transition-all group shadow-sm">
                                        <Youtube className="w-5 h-5 text-red-500" />
                                        <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">{profile.youtube}</span>
                                    </a>
                                )}
                                {profile.website && (
                                    <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 border rounded-xl bg-[#010409] border-[#30363d] hover:border-sky-500/50 transition-all group shadow-sm">
                                        <LinkIcon className="w-5 h-5 text-sky-400" />
                                        <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors">{profile.website}</span>
                                    </a>
                                )}
                                {!profile.github && !profile.youtube && !profile.website && <p className="text-sm text-slate-500 font-mono">No nodes linked.</p>}
                            </div>
                        </motion.div>
                    </div>
                </div>

            </motion.div>

            {/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-5 border-b border-[#30363d] bg-[#161b22]">
                                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2"><Edit3 className="w-5 h-5 text-sky-400" /> System Configuration</h2>
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors p-1"><X size={20} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar bg-[#050b14]">
                                <form id="editProfileForm" onSubmit={(e) => { e.preventDefault(); saveProfileToDatabase(); }} className="space-y-5">

                                    {/* IMAGE UPLOADS & STATUS */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-2">
                                        <div className="p-4 border border-[#30363d] bg-[#0d1117] rounded-xl">
                                            <label className="block mb-2 text-xs text-slate-400 font-mono uppercase tracking-wider">Avatar Image</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-500/10 file:text-sky-400 hover:file:bg-sky-500/20 cursor-pointer transition-colors" />
                                        </div>
                                        <div className="p-4 border border-[#30363d] bg-[#0d1117] rounded-xl">
                                            <label className="block mb-2 text-xs text-slate-400 font-mono uppercase tracking-wider">Banner Image</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 cursor-pointer transition-colors" />
                                        </div>
                                        {/* STATUS DROPDOWN */}
                                        <div className="p-4 border border-[#30363d] bg-[#0d1117] rounded-xl">
                                            <label className="block mb-2 text-xs text-slate-400 font-mono uppercase tracking-wider">Current Status</label>
                                            <select
                                                value={profile.availability}
                                                onChange={e => setProfile({ ...profile, availability: e.target.value as any })}
                                                className="w-full bg-[#010409] border border-[#30363d] text-slate-300 text-xs font-mono rounded-lg px-3 py-2 outline-none focus:border-sky-500"
                                            >
                                                <option value="Seeking Internships">Seeking Internships</option>
                                                <option value="Looking for Teammates">Looking for Teammates</option>
                                                <option value="Building in Stealth">Building in Stealth</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div><label className="block mb-1.5 text-xs text-slate-400 font-mono uppercase tracking-wider">Full Name</label><input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm outline-none focus:border-sky-500 transition-colors" required /></div>
                                    <div><label className="block mb-1.5 text-xs text-slate-400 font-mono uppercase tracking-wider">Headline</label><input type="text" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} className="w-full px-4 py-3 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm outline-none focus:border-sky-500 transition-colors" /></div>
                                    <div><label className="block mb-1.5 text-xs text-slate-400 font-mono uppercase tracking-wider">Location</label><input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-3 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm outline-none focus:border-sky-500 transition-colors" /></div>
                                    <div><label className="block mb-1.5 text-xs text-slate-400 font-mono uppercase tracking-wider">About Me (Markdown)</label><textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="w-full h-32 px-4 py-3 bg-[#010409] border border-[#30363d] rounded-xl text-white font-sans text-sm outline-none focus:border-sky-500 resize-none transition-colors"></textarea></div>
                                </form>

                                <div className="pt-8 border-t border-[#30363d]">
                                    <label className="block mb-4 text-sm font-bold text-blue-400 font-mono flex items-center gap-2"><GraduationCap className="w-4 h-4" /> EDUCATION_ARRAY</label>
                                    {profile.education.map(edu => (
                                        <div key={edu.id} className="flex justify-between items-start p-4 mb-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                                            <div><p className="text-sm font-bold text-white">{edu.school}</p><p className="text-xs text-slate-400 mt-1">{edu.degree}</p></div>
                                            <button type="button" onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded-md transition-colors"><X size={14} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 border border-dashed border-[#30363d] rounded-xl bg-[#010409]">
                                        <input type="text" value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="School/University" />
                                        <input type="text" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="Degree (e.g. B.Tech IT)" />
                                        <input type="text" value={newEdu.duration} onChange={e => setNewEdu({ ...newEdu, duration: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="Duration (e.g. 2025-2029)" />
                                        <input type="text" value={newEdu.details} onChange={e => setNewEdu({ ...newEdu, details: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-blue-500" placeholder="Details/GPA" />
                                        <button type="button" onClick={addEducation} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-lg font-mono font-bold hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Node</button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#30363d]">
                                    <label className="block mb-4 text-sm font-bold text-indigo-400 font-mono flex items-center gap-2"><Briefcase className="w-4 h-4" /> EXPERIENCE_ARRAY</label>
                                    {profile.experiences.map(exp => (
                                        <div key={exp.id} className="flex justify-between items-start p-4 mb-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                                            <div><p className="text-sm font-bold text-white">{exp.role}</p><p className="text-xs text-slate-400 mt-1">{exp.company}</p></div>
                                            <button type="button" onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded-md transition-colors"><X size={14} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 border border-dashed border-[#30363d] rounded-xl bg-[#010409]">
                                        <input type="text" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-indigo-500" placeholder="Role/Title" />
                                        <input type="text" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-indigo-500" placeholder="Company" />
                                        <input type="text" value={newExp.duration} onChange={e => setNewExp({ ...newExp, duration: e.target.value })} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-indigo-500" placeholder="Duration (e.g. Jan 2026 - Present)" />
                                        <textarea value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} className="col-span-1 sm:col-span-2 h-20 px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-sans text-sm outline-none focus:border-indigo-500 resize-none" placeholder="Description of your work..."></textarea>
                                        <button type="button" onClick={addExperience} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg font-mono font-bold hover:bg-indigo-500/20 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Node</button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#30363d]">
                                    <label className="block mb-4 text-sm font-bold text-green-400 font-mono flex items-center gap-2"><FolderGit2 className="w-4 h-4" /> PROJECT_ARRAY</label>
                                    {profile.projects.map(proj => (
                                        <div key={proj.id} className="flex justify-between items-start p-4 mb-3 bg-[#0d1117] border border-[#30363d] rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-white">{proj.name}</p>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{proj.description}</p>
                                            </div>
                                            <button type="button" onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-300 p-1 bg-red-500/10 rounded-md transition-colors"><X size={14} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 border border-dashed border-[#30363d] rounded-xl bg-[#010409]">
                                        <input type="text" value={newProj.name} onChange={e => setNewProj({ ...newProj, name: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Project Name" />
                                        <input type="text" value={newProj.link} onChange={e => setNewProj({ ...newProj, link: e.target.value })} className="px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Project Link (URL)" />
                                        <input type="text" value={newProj.tags} onChange={e => setNewProj({ ...newProj, tags: e.target.value })} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Tags (comma separated)" />
                                        <textarea value={newProj.description} onChange={e => setNewProj({ ...newProj, description: e.target.value })} className="col-span-1 sm:col-span-2 h-20 px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white font-sans text-sm outline-none focus:border-green-500 resize-none" placeholder="Short description..."></textarea>
                                        <button type="button" onClick={addProject} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-green-500/10 text-green-400 border border-green-500/30 rounded-lg font-mono font-bold hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Node</button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#30363d]">
                                    <label className="block mb-4 text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">Tech Stack</label>
                                    <div className="flex gap-3">
                                        <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} className="flex-1 px-4 py-2.5 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm outline-none focus:border-sky-500" placeholder="Type a skill & press Enter" />
                                        <button type="button" onClick={addSkill} className="px-6 py-2.5 bg-[#21262d] border border-[#30363d] rounded-xl text-white font-mono font-bold hover:bg-[#30363d] transition-colors">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {profile.skills.map(skill => (
                                            <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-sky-300 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                                                {skill} <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white transition-colors"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#30363d]">
                                    <label className="block mb-4 text-xs text-slate-400 font-mono font-bold uppercase tracking-wider">Social Links</label>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <input type="text" value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm outline-none focus:border-slate-500 transition-colors" placeholder="github.com/username" />
                                        </div>
                                        <div className="relative">
                                            <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                                            <input type="text" value={profile.youtube} onChange={e => setProfile({ ...profile, youtube: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm outline-none focus:border-red-500 transition-colors" placeholder="youtube.com/@channel" />
                                        </div>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
                                            <input type="text" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-[#010409] border border-[#30363d] rounded-xl text-white font-mono text-sm outline-none focus:border-sky-500 transition-colors" placeholder="yourportfolio.dev" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border-t border-[#30363d] bg-[#161b22] flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 font-bold text-slate-300 rounded-xl hover:bg-white/5 font-mono transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" form="editProfileForm" disabled={isSaving} className="px-8 py-2.5 font-bold text-white rounded-xl bg-sky-600 hover:bg-sky-500 shadow-[0_0_20px_rgba(2,132,199,0.3)] disabled:opacity-50 flex items-center gap-2 transition-all">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {isSaving ? "Syncing..." : "Commit Setup"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- AI CORE DIAGNOSTIC DIALOG OVERLAY --- */}
            <AnimatePresence>
                {showAnalyzer && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-lg bg-[#0d1117] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(147,51,234,0.3)] overflow-hidden">
                            <div className="flex items-center gap-3 p-5 bg-[#161b22] border-b border-[#30363d]">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
                                </div>
                                <h2 className="text-base font-bold text-white font-mono">ScholarSphere AI Engine</h2>
                                <div className="flex-1"></div>
                                <button onClick={() => setShowAnalyzer(false)} className="text-slate-400 hover:text-white transition-colors p-1"><X size={20} /></button>
                            </div>
                            <div className="p-6 font-mono text-sm">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {isAnalyzing ? <Loader2 className="w-4 h-4 text-purple-400 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                        <span className="text-slate-300">
                                            {isAnalyzing ? `Scanning profile data for ${profile.name || "User"}...` : "Matrix evaluation complete."}
                                        </span>
                                    </div>
                                </div>

                                {!isAnalyzing && aiMatches.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-6 border-t border-[#30363d]">
                                        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> High-Probability Matches Found:</h3>
                                        <div className="space-y-3">
                                            {aiMatches.map((match, idx) => (
                                                <div key={idx} className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl group cursor-pointer hover:bg-purple-500/10 transition-colors">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div>
                                                            <div className="text-white font-bold text-sm leading-tight">{match.title}</div>
                                                            <div className="text-slate-400 text-xs mt-2 leading-relaxed">{match.reason}</div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
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

            <style>{`
                @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; } 
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #30363d; border-radius: 10px; }
            `}</style>
        </div>
    );
}