import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Link as LinkIcon, Github, Briefcase, GraduationCap,
    Code, Edit3, Sparkles, Youtube, Terminal, Plus, X, Linkedin,
    Upload, BrainCircuit, Target, CheckCircle2, ChevronRight, Award,
    Download, FolderGit2, Activity, Calendar
} from "lucide-react";

// --- 1. DATA SHAPES ---
interface Certificate { id: string; name: string; fileUrl: string; }
interface Project { id: string; name: string; description: string; tags: string[]; link?: string; }
interface Experience { id: string; role: string; company: string; duration: string; description: string; }
interface Education { id: string; degree: string; school: string; duration: string; details: string; }
interface ActivityLog { id: string; date: string; action: string; }

interface ProfileData {
    name: string; headline: string; bio: string; location: string;
    website: string; github: string; youtube: string;
    avatarUrl: string; bannerUrl: string;
    skills: string[]; certificates: Certificate[]; lookingFor: string[];
    projects: Project[]; experiences: Experience[]; education: Education[];
    recentActivity: ActivityLog[];
}

export default function Profile() {
    // --- STATE ---
    // FIX: Pre-populated the default state so it bypasses the "Initialize Profile" popup instantly!
    const [profile, setProfile] = useState<ProfileData>({
        name: "Aditya Sharad Chavan",
        headline: "FY B.Tech IT Undergrad @ Dr. D. Y. Patil College of Engineering",
        bio: "Engineering student passionate about bridging software development with hardware integration. Currently exploring Indian Knowledge Systems and building Arduino-based circuit solutions. When I'm not coding in Java, I'm scripting, shooting, and editing cinematic automotive content.",
        location: "Maharashtra, India", website: "mak6company.dev", github: "github.com/aditya", youtube: "MysticMotorMile",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya&backgroundColor=0284c7",
        bannerUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
        skills: ["Java", "Arduino", "Circuit Design", "Node.js", "Video Editing", "Scriptwriting"],
        certificates: [
            { id: "1", name: "Business Analytics For Management", fileUrl: "#" },
            { id: "2", name: "EF SET C1 Advanced", fileUrl: "#" }
        ],
        lookingFor: ["Internships", "Hackathons"],
        education: [
            { id: "1", degree: "B.Tech in Information Technology", school: "Dr. D. Y. Patil College of Engineering", duration: "2025 - 2029", details: "First Year Student. Core focus on programming foundations and logic building." }
        ],
        experiences: [
            { id: "1", role: "Digital Content Creator", company: "MysticMotorMile", duration: "2023 - Present", description: "Directing cinematic automotive content and managing channel growth strategies." },
            { id: "2", role: "Founder", company: "mak6company", duration: "April 2026 - Present", description: "Initiated planning and execution flowcharts for a new startup venture." }
        ],
        projects: [
            { id: "1", name: "Force & Smoke Detection System", description: "Hardware project utilizing Arduino sensors for real-time environmental monitoring.", tags: ["IoT", "Arduino", "Hardware"] },
            { id: "2", name: "FRAGMENTS OF FIRE", description: "Cinematic thriller scene-by-step animation script and storyboard.", tags: ["Scriptwriting", "Creative"] }
        ],
        recentActivity: [
            { id: "1", date: "May 2026", action: "Implemented a 6-month hostel-friendly fitness plan." },
            { id: "2", date: "April 2026", action: "Completed AMCAT employability assessment." }
        ]
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [showAnalyzer, setShowAnalyzer] = useState(false);
    const [analyzerStep, setAnalyzerStep] = useState(0);

    // Edit Form Temp States
    const [newSkill, setNewSkill] = useState("");

    // Complex Array Temp States
    const [newEdu, setNewEdu] = useState({ school: "", degree: "", duration: "", details: "" });
    const [newExp, setNewExp] = useState({ role: "", company: "", duration: "", description: "" });
    const [newProj, setNewProj] = useState({ name: "", description: "", link: "", tags: "" });

    const lookingForOptions = ["Internships", "Hackathons", "Full-time Jobs", "Freelance", "Open Source"];

    // --- HANDLERS ---
    const handleLinkedInImport = () => {
        setIsImporting(true);
        setTimeout(() => {
            // Data is now in initial state, so this is just here for the simulated effect if needed.
            setIsImporting(false);
        }, 2000);
    };

    // Upload Handlers
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

    const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newCert = { id: Date.now().toString(), name: file.name, fileUrl: reader.result as string };
                setProfile({ ...profile, certificates: [...profile.certificates, newCert] });
            };
            reader.readAsDataURL(file);
        }
    };

    // Array Manipulation Handlers
    const toggleLookingFor = (option: string) => {
        if (profile.lookingFor.includes(option)) setProfile({ ...profile, lookingFor: profile.lookingFor.filter(item => item !== option) });
        else setProfile({ ...profile, lookingFor: [...profile.lookingFor, option] });
    };

    const addSkill = () => { if (newSkill.trim() && !profile.skills.includes(newSkill)) { setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] }); setNewSkill(""); } };
    const removeSkill = (skillToRemove: string) => setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
    const removeCertificate = (idToRemove: string) => setProfile({ ...profile, certificates: profile.certificates.filter(c => c.id !== idToRemove) });

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

    // AI Analyzer logic
    useEffect(() => {
        if (showAnalyzer) {
            setAnalyzerStep(0);
            const timers = [setTimeout(() => setAnalyzerStep(1), 1500), setTimeout(() => setAnalyzerStep(2), 3000), setTimeout(() => setAnalyzerStep(3), 4500)];
            return () => timers.forEach(clearTimeout);
        }
    }, [showAnalyzer]);

    // --- VIEW 1: ONBOARDING ---
    if (!profile.name && !isEditing) {
        return (
            <div className="flex flex-col items-center justify-center w-full min-h-screen pt-16 bg-[#030712] px-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md p-8 text-center bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl">
                    <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-sky-500/10 border border-sky-500/30"><Terminal className="w-10 h-10 text-sky-400" /></div></div>
                    <h2 className="mb-2 text-2xl font-bold text-white font-mono">Initialize Profile</h2>
                    <p className="mb-8 text-sm text-slate-400">Let's set up your developer portfolio.</p>
                    <div className="space-y-4">
                        <button onClick={handleLinkedInImport} disabled={isImporting} className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all bg-[#0a66c2] hover:bg-[#004182] rounded-lg disabled:opacity-50">
                            {isImporting ? <span className="animate-pulse">Syncing Database...</span> : <><Linkedin size={18} /> Import from LinkedIn</>}
                        </button>
                        <div className="flex items-center gap-4"><div className="flex-1 h-px bg-[#30363d]"></div><span className="text-xs font-mono text-slate-500">OR</span><div className="flex-1 h-px bg-[#30363d]"></div></div>
                        <button onClick={() => setIsEditing(true)} className="flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-bold text-white transition-all bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-lg"><Edit3 size={18} /> Setup Manually</button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- VIEW 2: MAIN DASHBOARD ---
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

                            {/* ACTION BUTTONS */}
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
                                {profile.lookingFor.map(goal => (
                                    <span key={goal} className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2 py-1 rounded-md border border-green-400/20">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Looking for {goal}
                                    </span>
                                ))}
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

                        {/* Education */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-6 text-lg font-bold text-white font-mono"><GraduationCap className="w-5 h-5 text-blue-400" /> Education</h2>
                            <div className="space-y-6">
                                {profile.education.length === 0 ? <p className="text-sm text-slate-500">No education added.</p> : profile.education.map(edu => (
                                    <div key={edu.id} className="relative pl-6 border-l-2 border-[#30363d]">
                                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                        <h3 className="font-bold text-white text-lg">{edu.school}</h3>
                                        <p className="text-sky-400 font-medium text-sm">{edu.degree}</p>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> {edu.duration}</p>
                                        <p className="text-sm text-slate-400 mt-2">{edu.details}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Experience & Hackathons */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-6 text-lg font-bold text-white font-mono"><Briefcase className="w-5 h-5 text-indigo-400" /> Experience & Hackathons</h2>
                            <div className="space-y-6">
                                {profile.experiences.length === 0 ? <p className="text-sm text-slate-500">No experience added.</p> : profile.experiences.map(exp => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-[#30363d]">
                                        <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                                        <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                                        <p className="text-indigo-400 font-medium text-sm">{exp.company}</p>
                                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.duration}</p>
                                        <p className="text-sm text-slate-400 mt-2">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Featured Projects Matrix */}
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

                        {/* Uploaded Certificates */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-6 text-lg font-bold text-white font-mono"><Award className="w-5 h-5 text-yellow-400" /> Uploaded Certificates</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {profile.certificates.length === 0 ? <p className="text-sm text-slate-500 col-span-2">No certificates uploaded yet.</p> : profile.certificates.map(cert => (
                                    <div key={cert.id} className="flex items-center gap-3 p-3 bg-[#010409] border border-[#30363d] rounded-xl hover:border-yellow-500/50 transition-colors cursor-pointer group">
                                        <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors">
                                            <Award className="w-5 h-5 text-yellow-400" />
                                        </div>
                                        <span className="text-sm font-bold text-white truncate">{cert.name}</span>
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

                        {/* Live Activity Log */}
                        <div className="p-6 bg-[#0d1117] border border-[#30363d] rounded-2xl">
                            <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-white font-mono"><Activity className="w-5 h-5 text-rose-400" /> Terminal Log</h2>
                            <div className="space-y-4 font-mono text-xs">
                                {profile.recentActivity.length === 0 ? <p className="text-slate-500">No recent activity.</p> : profile.recentActivity.map(act => (
                                    <div key={act.id} className="border-b border-[#30363d] pb-3 last:border-0">
                                        <span className="text-rose-400 block mb-1">[{act.date}]</span>
                                        <span className="text-slate-300 leading-relaxed">{act.action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* --- THE EDIT MODAL OVERLAY --- */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                            <div className="flex justify-between items-center p-4 border-b border-[#30363d] bg-[#161b22]">
                                <h2 className="text-lg font-bold text-white font-mono">sudo nano profile.config</h2>
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar">

                                {/* LOCAL IMAGE UPLOADS */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-[#30363d]">
                                    <div>
                                        <label className="block mb-2 text-xs text-slate-400 font-mono">AVATAR (Local Upload)</label>
                                        <label className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-white transition-all border border-dashed rounded-lg cursor-pointer bg-sky-500/5 border-sky-500/30 hover:bg-sky-500/10 hover:border-sky-500">
                                            <Upload size={16} /> {profile.avatarUrl ? "Replace Avatar" : "Select Image"}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'avatar')} />
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-xs text-slate-400 font-mono">BANNER (Local Upload)</label>
                                        <label className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-white transition-all border border-dashed rounded-lg cursor-pointer bg-purple-500/5 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500">
                                            <Upload size={16} /> {profile.bannerUrl ? "Replace Banner" : "Select Image"}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'banner')} />
                                        </label>
                                    </div>
                                </div>

                                {/* BASIC INFO */}
                                <form id="editProfileForm" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }} className="space-y-4">
                                    <div><label className="block mb-1 text-xs text-slate-400 font-mono">FULL_NAME</label><input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono focus:border-sky-500 outline-none" required /></div>
                                    <div><label className="block mb-1 text-xs text-slate-400 font-mono">HEADLINE</label><input type="text" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} className="w-full px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono focus:border-sky-500 outline-none" /></div>
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

                                {/* PROJECTS BUILDER */}
                                <div className="pt-6 border-t border-[#30363d]">
                                    <label className="block mb-4 text-sm font-bold text-green-400 font-mono">PROJECTS_ARRAY</label>

                                    {profile.projects.map(proj => (
                                        <div key={proj.id} className="flex justify-between items-start p-3 mb-2 bg-[#010409] border border-[#30363d] rounded-lg">
                                            <div><p className="text-sm font-bold text-white">{proj.name}</p></div>
                                            <button type="button" onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
                                        </div>
                                    ))}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                        <input type="text" value={newProj.name} onChange={e => setNewProj({ ...newProj, name: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Project Name" />
                                        <input type="text" value={newProj.link} onChange={e => setNewProj({ ...newProj, link: e.target.value })} className="px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Project Link (Optional)" />
                                        <input type="text" value={newProj.tags} onChange={e => setNewProj({ ...newProj, tags: e.target.value })} className="col-span-1 sm:col-span-2 px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500" placeholder="Tags (comma separated, e.g. React, Node.js)" />
                                        <textarea value={newProj.description} onChange={e => setNewProj({ ...newProj, description: e.target.value })} className="col-span-1 sm:col-span-2 h-16 px-3 py-2 bg-[#010409] border border-[#30363d] rounded-lg text-white font-mono text-sm outline-none focus:border-green-500 resize-none" placeholder="Short description..."></textarea>
                                        <button type="button" onClick={addProject} className="col-span-1 sm:col-span-2 px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-white hover:bg-[#30363d]">Add Project</button>
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

                                {/* CERTIFICATE UPLOADER ZONE */}
                                <div className="pt-6 border-t border-[#30363d]">
                                    <label className="block mb-2 text-xs text-slate-400 font-mono">CERTIFICATES (Upload files)</label>
                                    <label className="flex items-center justify-center w-full gap-2 px-4 py-4 mb-4 text-sm font-medium text-yellow-400 transition-all border border-dashed rounded-lg cursor-pointer bg-yellow-500/5 border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500">
                                        <Upload size={18} /> Upload New Certificate File
                                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleCertificateUpload} />
                                    </label>
                                    <div className="space-y-2">
                                        {profile.certificates.map(cert => (
                                            <div key={cert.id} className="flex justify-between items-center p-3 bg-[#010409] border border-[#30363d] rounded-lg group">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                                    <p className="text-sm font-bold text-white truncate">{cert.name}</p>
                                                </div>
                                                <button type="button" onClick={() => removeCertificate(cert.id)} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* SAVE BUTTON */}
                            <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex justify-end">
                                <button type="submit" form="editProfileForm" className="px-8 py-3 font-bold text-white rounded-lg bg-sky-600 hover:bg-sky-500 font-mono shadow-[0_0_20px_rgba(2,132,199,0.3)]">Save Setup</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- AI PROFILE ANALYZER MODAL --- */}
            <AnimatePresence>
                {showAnalyzer && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
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
                                        <span className={analyzerStep >= 0 ? "text-slate-300" : "text-slate-500"}>Parsing matrix for {profile.name || "User"}...</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {analyzerStep >= 1 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : (analyzerStep === 0 ? <div className="w-4 h-4 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div> : <div className="w-4 h-4"></div>)}
                                        <span className={analyzerStep >= 1 ? "text-slate-300" : "text-slate-500"}>Evaluating stack: [{profile.skills.slice(0, 3).join(", ")}{profile.skills.length > 3 ? "..." : ""}]</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {analyzerStep >= 2 ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : (analyzerStep === 1 ? <div className="w-4 h-4 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin"></div> : <div className="w-4 h-4"></div>)}
                                        <span className={analyzerStep >= 2 ? "text-slate-300" : "text-slate-500"}>Cross-referencing global opportunities...</span>
                                    </div>
                                </div>

                                {analyzerStep >= 3 && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-6 border-t border-[#30363d]">
                                        <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> High-Probability Matches Found:</h3>
                                        <div className="space-y-3">
                                            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg group cursor-pointer hover:bg-purple-500/20 transition-colors">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-white font-bold text-sm">Smart India Hackathon 2026</div>
                                                        <div className="text-slate-400 text-xs mt-1">Match: Hardware & Arduino background.</div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
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