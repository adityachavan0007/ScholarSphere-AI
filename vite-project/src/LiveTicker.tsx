import { motion } from "framer-motion";
import { Trophy, Briefcase, Zap } from "lucide-react";

const notifications = [
    { id: 1, icon: Trophy, text: "A student from Dr. D. Y. Patil College of Engineering just unlocked a ₹50,000 scholarship", color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { id: 2, icon: Briefcase, text: "Sneha just matched with a Microsoft SDE Internship", color: "text-blue-400", bg: "bg-blue-400/10" },
    { id: 3, icon: Zap, text: "Team 'CodeCrafters' formed for Smart India Hackathon", color: "text-purple-400", bg: "bg-purple-400/10" },
    { id: 4, icon: Trophy, text: "Rahul secured 1st place at the National AI Hackathon", color: "text-green-400", bg: "bg-green-400/10" },
];

export default function LiveTicker() {
    return (
        <div className="w-full py-4 overflow-hidden border-y border-white/5 bg-white/[0.02] backdrop-blur-md relative flex items-center">
            {/* Left/Right Fade Edges so the text doesn't just cut off sharply */}
            <div className="absolute left-0 z-10 w-24 h-full bg-gradient-to-r from-[#030712] to-transparent"></div>
            <div className="absolute right-0 z-10 w-24 h-full bg-gradient-to-l from-[#030712] to-transparent"></div>

            <motion.div
                animate={{ x: [0, -1035] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
                className="flex gap-8 whitespace-nowrap"
            >
                {/* We map the notifications twice to create a seamless infinite loop */}
                {[...notifications, ...notifications].map((note, index) => (
                    <div key={index} className="flex items-center gap-3 px-4 py-2 border rounded-full bg-[#0d1117] border-[#30363d]">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${note.bg}`}>
                            <note.icon className={`w-3 h-3 ${note.color}`} />
                        </div>
                        <span className="text-sm font-medium font-mono text-slate-300">{note.text}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}