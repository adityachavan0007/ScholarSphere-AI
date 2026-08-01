const fs = require('fs');
const path = require('path');

const filePath = 'd:\\ScholarSphere-AI\\vite-project\\src\\Profile.tsx';
let content = fs.readFileSync(filePath, 'utf8');

module.exports = `            {/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-3xl bento-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                            <div className="flex justify-between items-center p-5 border-b border-white/10 bg-black/40 backdrop-blur-md">
                                <h2 className="text-lg font-bold text-zinc-100 font-outfit flex items-center gap-2"><Edit3 className="w-5 h-5 text-zinc-400" /> Edit Profile</h2>
                                <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-white transition-colors p-1"><X size={20} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-8 flex-1 custom-scrollbar bg-zinc-950">
                                <form id="editProfileForm" onSubmit={(e) => { e.preventDefault(); saveProfileToDatabase(); }} className="space-y-6">

                                    {/* IMAGE UPLOADS & STATUS */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-2">
                                        <div className="p-4 border border-white/5 bg-zinc-900 rounded-xl">
                                            <label className="block mb-2 text-xs font-bold text-zinc-400 font-sans tracking-wide">Avatar Image</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer transition-colors" />
                                        </div>
                                        <div className="p-4 border border-white/5 bg-zinc-900 rounded-xl">
                                            <label className="block mb-2 text-xs font-bold text-zinc-400 font-sans tracking-wide">Banner Image</label>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer transition-colors" />
                                        </div>
                                        {/* STATUS DROPDOWN */}
                                        <div className="p-4 border border-white/5 bg-zinc-900 rounded-xl">
                                            <label className="block mb-2 text-xs font-bold text-zinc-400 font-sans tracking-wide">Current Status</label>
                                            <select
                                                value={profile.availability}
                                                onChange={e => setProfile({ ...profile, availability: e.target.value as any })}
                                                className="w-full bg-zinc-950/50 border border-white/10 text-zinc-300 text-sm font-sans rounded-lg px-3 py-2 outline-none focus:border-zinc-500"
                                            >
                                                <option value="Seeking Internships">Seeking Internships</option>
                                                <option value="Looking for Teammates">Looking for Teammates</option>
                                                <option value="Building in Stealth">Building in Stealth</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div><label className="block mb-2 text-xs font-bold text-zinc-400 font-sans tracking-wide">Full Name</label><input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 transition-colors" required /></div>
                                    <div><label className="block mb-2 text-xs font-bold text-zinc-400 font-sans tracking-wide">Headline</label><input type="text" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 transition-colors" /></div>
                                    <div><label className="block mb-2 text-xs font-bold text-zinc-400 font-sans tracking-wide">Location</label><input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 transition-colors" /></div>
                                    <div><label className="block mb-2 text-xs font-bold text-zinc-400 font-sans tracking-wide">About Me</label><textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="w-full h-32 px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 resize-none transition-colors"></textarea></div>
                                </form>

                                <div className="pt-8 border-t border-white/10">
                                    <label className="block mb-4 text-sm font-bold text-zinc-100 font-sans flex items-center gap-2"><GraduationCap className="w-4 h-4 text-zinc-400" /> Education</label>
                                    {profile.education.map(edu => (
                                        <div key={edu.id} className="flex justify-between items-start p-4 mb-3 bg-zinc-900/50 border border-white/10 rounded-xl">
                                            <div><p className="text-sm font-bold text-white">{edu.school}</p><p className="text-xs text-zinc-400 mt-1">{edu.degree}</p></div>
                                            <button type="button" onClick={() => removeEducation(edu.id)} className="text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors"><X size={16} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-5 border border-dashed border-white/20 rounded-xl bg-zinc-900/20">
                                        <input type="text" value={newEdu.school} onChange={e => setNewEdu({ ...newEdu, school: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="School/University" />
                                        <input type="text" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Degree (e.g. B.Tech IT)" />
                                        <input type="text" value={newEdu.duration} onChange={e => setNewEdu({ ...newEdu, duration: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Duration (e.g. 2025-2029)" />
                                        <input type="text" value={newEdu.details} onChange={e => setNewEdu({ ...newEdu, details: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Details/GPA" />
                                        <button type="button" onClick={addEducation} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-white/5 text-zinc-300 border border-white/10 rounded-lg font-sans font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Education</button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <label className="block mb-4 text-sm font-bold text-zinc-100 font-sans flex items-center gap-2"><Briefcase className="w-4 h-4 text-zinc-400" /> Experience</label>
                                    {profile.experiences.map(exp => (
                                        <div key={exp.id} className="flex justify-between items-start p-4 mb-3 bg-zinc-900/50 border border-white/10 rounded-xl">
                                            <div><p className="text-sm font-bold text-white">{exp.role}</p><p className="text-xs text-zinc-400 mt-1">{exp.company}</p></div>
                                            <button type="button" onClick={() => removeExperience(exp.id)} className="text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors"><X size={16} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-5 border border-dashed border-white/20 rounded-xl bg-zinc-900/20">
                                        <input type="text" value={newExp.role} onChange={e => setNewExp({ ...newExp, role: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Role/Title" />
                                        <input type="text" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Company" />
                                        <input type="text" value={newExp.duration} onChange={e => setNewExp({ ...newExp, duration: e.target.value })} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Duration (e.g. Jan 2026 - Present)" />
                                        <textarea value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} className="col-span-1 sm:col-span-2 h-20 px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500 resize-none" placeholder="Description of your work..."></textarea>
                                        <button type="button" onClick={addExperience} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-white/5 text-zinc-300 border border-white/10 rounded-lg font-sans font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Experience</button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <label className="block mb-4 text-sm font-bold text-zinc-100 font-sans flex items-center gap-2"><FolderGit2 className="w-4 h-4 text-zinc-400" /> Projects</label>
                                    {profile.projects.map(proj => (
                                        <div key={proj.id} className="flex justify-between items-start p-4 mb-3 bg-zinc-900/50 border border-white/10 rounded-xl">
                                            <div>
                                                <p className="text-sm font-bold text-white">{proj.name}</p>
                                                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{proj.description}</p>
                                            </div>
                                            <button type="button" onClick={() => removeProject(proj.id)} className="text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors"><X size={16} /></button>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-5 border border-dashed border-white/20 rounded-xl bg-zinc-900/20">
                                        <input type="text" value={newProj.name} onChange={e => setNewProj({ ...newProj, name: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Project Name" />
                                        <input type="text" value={newProj.link} onChange={e => setNewProj({ ...newProj, link: e.target.value })} className="px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Project Link (URL)" />
                                        <input type="text" value={newProj.tags} onChange={e => setNewProj({ ...newProj, tags: e.target.value })} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Tags (comma separated)" />
                                        <textarea value={newProj.description} onChange={e => setNewProj({ ...newProj, description: e.target.value })} className="col-span-1 sm:col-span-2 h-20 px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white font-sans text-sm outline-none focus:border-zinc-500 resize-none" placeholder="Short description..."></textarea>
                                        <button type="button" onClick={addProject} className="col-span-1 sm:col-span-2 px-4 py-2.5 bg-white/5 text-zinc-300 border border-white/10 rounded-lg font-sans font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Add Project</button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <label className="block mb-4 text-sm font-bold text-zinc-100 font-sans tracking-wide">Tech Stack</label>
                                    <div className="flex gap-3">
                                        <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} className="flex-1 px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500" placeholder="Type a skill & press Enter" />
                                        <button type="button" onClick={addSkill} className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-sans font-bold hover:bg-white/10 transition-colors">Add</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {profile.skills.map(skill => (
                                            <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-200 bg-white/5 border border-white/10 rounded-full">
                                                {skill} <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white text-zinc-400 transition-colors"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10">
                                    <label className="block mb-4 text-sm font-bold text-zinc-100 font-sans tracking-wide">Social Links</label>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <input type="text" value={profile.github} onChange={e => setProfile({ ...profile, github: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 transition-colors" placeholder="github.com/username" />
                                        </div>
                                        <div className="relative">
                                            <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <input type="text" value={profile.youtube} onChange={e => setProfile({ ...profile, youtube: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 transition-colors" placeholder="youtube.com/@channel" />
                                        </div>
                                        <div className="relative">
                                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <input type="text" value={profile.linkedin} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 transition-colors" placeholder="linkedin.com/in/username" />
                                        </div>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <input type="text" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white font-sans text-sm outline-none focus:border-zinc-500 transition-colors" placeholder="yourportfolio.dev" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 border-t border-white/10 bg-black/40 backdrop-blur-md flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 font-bold text-zinc-300 rounded-xl hover:bg-white/5 font-sans transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" form="editProfileForm" disabled={isSaving} className="px-8 py-2.5 font-bold text-zinc-950 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-50 flex items-center gap-2 transition-all">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : null}
                                    {isSaving ? "Saving..." : "Save Profile"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>`;

const startMarker = '{/* --- SYSTEM CONFIGURATION POPUP OVERLAY --- */}';
const endMarker = '{/* --- AI CORE DIAGNOSTIC DIALOG OVERLAY --- */}';

const sIdx = content.indexOf(startMarker);
const eIdx = content.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
    let before = content.substring(0, sIdx);
    let after = content.substring(eIdx);
    fs.writeFileSync(filePath, before + targetJSX + '\\n\\n            ' + after, 'utf8');
    console.log("Success with manual slice");
} else {
    console.log("Failed to find markers.");
