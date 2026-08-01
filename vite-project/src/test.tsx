export default function Test() { return (<>            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="max-w-5xl mx-auto space-y-6 relative z-10"
            >
                {/* PROFILE CONTAINER HEADER */}
                <motion.div variants={fadeUp} className="relative w-full overflow-hidden bento-card p-0 relative group bg-zinc-950">
                    <div className="h-48 sm:h-64 relative overflow-hidden bg-zinc-900 rounded-t-2xl">
                        {profile.bannerUrl ? (
                            <img src={profile.bannerUrl} alt="Profile Banner" className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="absolute inset-0 bg-zinc-800"></div>
                        )}
                    </div>

                    <div className="px-6 pb-8 sm:px-8 relative">
                        <div className="flex justify-between items-start">
                            {/* Avatar overlapping banner on the left */}
                            <div className="relative -mt-16 sm:-mt-20 z-10 p-1 bg-zinc-950 rounded-full inline-block">
                                <div className={\`flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-zinc-900 border-4 border-zinc-950 overflow-hidden relative group/avatar cursor-pointer\`} onClick={() => setIsEditing(true)}>
                                    {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-zinc-500 sm:w-16 sm:h-16" />}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center"><Edit3 className="w-6 h-6 text-white" /></div>
                                </div>
                                {/* STATUS INDICATOR DOT */}
                                <div className={\`absolute bottom-3 right-3 w-6 h-6 \${activeStatus.dot} rounded-full border-4 border-zinc-950\`} title={profile.availability}></div>
                            </div>
                            
                            {/* Action Buttons on the right */}
                            <div className="hidden sm:flex flex-wrap gap-3 mt-4">
                                <button onClick={() => setIsEditing(true)} className="px-5 py-2 text-sm font-bold transition-all rounded-full bg-zinc-100 text-zinc-950 hover:bg-white flex items-center gap-2">
                                    <Edit3 className="w-4 h-4" /> Edit Profile
                                </button>
                                <button onClick={handleDownloadCV} disabled={isGeneratingPDF} className="px-5 py-2 text-sm font-bold transition-all rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white flex items-center gap-2 disabled:opacity-50">
                                    {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    {isGeneratingPDF ? "Generating..." : "Download CV"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-2">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl font-outfit tracking-tight">
                                {profile.name || "Anonymous Developer"}
                            </h1>
                            <p className="mt-1 text-base text-zinc-300">{profile.headline || "Add a headline to stand out"}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-zinc-400">
                                {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {profile.location}</span>}
                                {profile.website && <a href={\`https://\${profile.website}\`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sky-400 hover:underline"><LinkIcon className="w-3.5 h-3.5" /> {profile.website}</a>}
                            </div>
                            
                            {/* Mobile action buttons */}
                            <div className="flex sm:hidden flex-wrap gap-3 mt-6">
                                <button onClick={() => setIsEditing(true)} className="flex-1 px-4 py-2 text-sm font-bold transition-all rounded-full bg-zinc-100 text-zinc-950 hover:bg-white flex items-center justify-center gap-2">
                                    <Edit3 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={handleDownloadCV} disabled={isGeneratingPDF} className="flex-1 px-4 py-2 text-sm font-bold transition-all rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 flex items-center justify-center gap-2">
                                    <Download className="w-4 h-4" /> CV
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CORE PROFILE GRID COLUMNS */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">

                    {/* MAIN TRACKS */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* About/Bio */}
                        <motion.div variants={fadeUp} className="bento-card p-6 bg-zinc-950">
                            <h2 className="mb-4 text-xl font-bold text-zinc-100 font-outfit tracking-tight">About</h2>
                            <p className="leading-relaxed text-zinc-400 text-sm whitespace-pre-line">{profile.bio || "No bio added yet."}</p>
                        </motion.div>

                        {/* Experience */}
                        <motion.div variants={fadeUp} className="bento-card p-6 bg-zinc-950">
                            <h2 className="mb-6 text-xl font-bold text-zinc-100 font-outfit tracking-tight">Experience</h2>
                            <div className="space-y-6">
                                {profile.experiences.length === 0 ? <p className="text-sm text-zinc-500">No experience added.</p> : profile.experiences.map((exp, idx) => (
                                    <div key={exp.id} className="flex gap-4 group">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-md flex items-center justify-center text-zinc-400">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-100 text-base">{exp.role}</h3>
                                            <p className="text-zinc-300 text-sm">{exp.company}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{exp.duration}</p>
                                            {exp.description && <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{exp.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Education */}
                        <motion.div variants={fadeUp} className="bento-card p-6 bg-zinc-950">
                            <h2 className="mb-6 text-xl font-bold text-zinc-100 font-outfit tracking-tight">Education</h2>
                            <div className="space-y-6">
                                {profile.education.length === 0 ? <p className="text-sm text-zinc-500">No education added.</p> : profile.education.map((edu, idx) => (
                                    <div key={edu.id} className="flex gap-4 group">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-md flex items-center justify-center text-zinc-400">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-100 text-base">{edu.school}</h3>
                                            <p className="text-zinc-300 text-sm">{edu.degree}</p>
                                            <p className="text-xs text-zinc-500 mt-1">{edu.duration}</p>
                                            {edu.details && <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{edu.details}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Projects */}
                        <motion.div variants={fadeUp} className="bento-card p-6 bg-zinc-950">
                            <h2 className="mb-6 text-xl font-bold text-zinc-100 font-outfit tracking-tight">Projects</h2>
                            <div className="space-y-6">
                                {profile.projects.length === 0 ? <p className="text-sm text-zinc-500">No projects added.</p> : profile.projects.map(proj => (
                                    <div key={proj.id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-zinc-100 font-outfit text-base">{proj.name}</h3>
                                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors"><LinkIcon className="w-4 h-4" /></a>}
                                        </div>
                                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.tags.map(tag => <span key={tag} className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-zinc-300">{tag}</span>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT PANEL - SIDEBAR */}
                    <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-24 h-fit">
                        {/* Analytics Dashboard Card */}
                        <motion.div variants={fadeUp} className="bento-card p-6 bg-zinc-950">
                            <h2 className="text-base font-bold text-zinc-100 font-outfit tracking-tight mb-4">Analytics & Tools</h2>
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1"><BrainCircuit className="w-5 h-5 text-zinc-400" /></div>
                                <div>
                                    <p className="text-sm font-medium text-white mb-1">AI Profile Analyzer</p>
                                    <p className="text-xs text-zinc-500 mb-4">Get instant ATS scoring and resume feedback.</p>
                                    <button onClick={() => setShowAnalyzer(true)} className="w-full px-4 py-2 text-sm font-bold transition-all rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white flex items-center justify-center gap-2">
                                        Analyze Profile
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tech Stack */}
                        <motion.div variants={fadeUp} className="bento-card p-6 bg-zinc-950">
                            <h2 className="text-base font-bold text-zinc-100 font-outfit tracking-tight mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.length === 0 ? <p className="text-sm text-zinc-500">No skills added.</p> : profile.skills.map((skill) => (
                                    <span key={skill} className="px-3 py-1.5 text-xs font-medium text-zinc-200 bg-white/5 border border-white/10 rounded-full">{skill}</span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Social Anchors */}
                        <motion.div variants={fadeUp} className="bento-card p-6 bg-zinc-950">
                            <h2 className="text-base font-bold text-zinc-100 font-outfit tracking-tight mb-4">Contact</h2>
                            <div className="space-y-4">
                                {profile.github && (
                                    <a href={\`https://\${profile.github}\`} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                                        <Github className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors hover:underline">GitHub</span>
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={\`https://linkedin.com/in/\${profile.linkedin}\`} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                                        <Linkedin className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors hover:underline">LinkedIn</span>
                                    </a>
                                )}
                                {profile.youtube && (
                                    <a href={\`https://youtube.com/@\${profile.youtube}\`} target="_blank" rel="noreferrer" className="flex items-center gap-3 group">
                                        <Youtube className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                        <span className="text-sm text-zinc-400 group-hover:text-white transition-colors hover:underline">YouTube</span>
                                    </a>
                                )}
                                {!profile.github && !profile.linkedin && !profile.youtube && <p className="text-sm text-zinc-500">No profiles linked.</p>}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>`;

// Need to find the exact boundaries to replace in Profile.tsx
// It starts with <motion.div variants={staggerContainer}...
// and ends right before {/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}

const startMarker = '<motion.div\r\n                variants={staggerContainer}\r\n                initial="hidden"\r\n                animate="show"';
const endMarker = '{/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}';

const startIndex = content.indexOf('<motion.div\r\n                variants={staggerContainer}');
if (startIndex === -1) {
    // try different line endings
    const startIdx2 = content.indexOf('<motion.div\n                variants={staggerContainer}');
    if (startIdx2 !== -1) {
        console.log("Found with LF");
    } else {
        console.log("Could not find start marker");
    }
}

// Let's use regex to replace it
const regex = /<motion\.div[\s\S]*?variants={staggerContainer}[\s\S]*?animate="show"[\s\S]*?className="max-w-5xl mx-auto space-y-8 relative z-10"[\s\S]*?<\/motion\.div>[\s\S]*?(?={\/\* --- SYSTEM CONFIGURATION POPUP OVERLAY --- \*\/})/g;

if (regex.test(content)) {
    let replaced = content.replace(regex, targetJSX + '\n\n            ');
    fs.writeFileSync(filePath, replaced, 'utf8');
    console.log("Success");
} else {
    console.log("Regex match failed. Falling back to indexOf.");
    
    // Manual indexOf extraction
    const sIdx = content.indexOf('            <motion.div\n                variants={staggerContainer}');
    const sIdx2 = content.indexOf('            <motion.div\r\n                variants={staggerContainer}');
    const realStart = sIdx !== -1 ? sIdx : sIdx2;
    
    const eIdx = content.indexOf('            {/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}');
    
    if (realStart !== -1 && eIdx !== -1) {
        let before = content.substring(0, realStart);
        let after = content.substring(eIdx);
        fs.writeFileSync(filePath, before + targetJSX + '\n\n' + after, 'utf8');
        console.log("Success with manual slice");
    } else {
        console.log("Failed manual slice too")</>); }