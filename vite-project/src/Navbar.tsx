import { User, Sparkles } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="w-full bg-[#030712]/80 backdrop-blur-md border-b border-gray-800 p-4 fixed top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo Section */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="text-blue-500 w-6 h-6" />
                    <span className="text-white font-bold text-xl tracking-tight">ScholarSphere</span>
                </div>

                {/* Center Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-gray-300 font-medium">
                    <a href="#" className="hover:text-blue-400 transition-colors">Find Internships</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">AI Resume Match</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Career Prep</a>
                </div>

                {/* Right Side Action Buttons */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-300 hover:text-white font-medium px-2">Log In</button>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        <User className="w-4 h-4" />
                        Sign Up
                    </button>
                </div>

            </div>
        </nav>
    );
}