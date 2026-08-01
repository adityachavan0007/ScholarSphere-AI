import { Facebook, Instagram, Twitter, Dribbble, Globe, Mail, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative w-full bg-black overflow-hidden z-10 font-sans mt-20">
            {/* Subtle blue gradient glows at the bottom corners */}
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

            {/* Main Footer Content */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 pt-16 pb-8">
                
                {/* Top Section - 4 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
                    
                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-blue-500 text-blue-500" />
                            <span className="text-[26px] font-bold text-white tracking-tight">ScholarSphere</span>
                        </div>
                        <p className="text-zinc-300/80 text-[15px] leading-relaxed max-w-[200px] mt-1">
                            ScholarSphere AI is a modern platform designed to automate your academic journey.
                        </p>
                    </div>

                    {/* About Us Column */}
                    <div className="flex flex-col gap-6 md:pl-4">
                        <h4 className="text-white font-semibold text-[17px]">About Us</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-zinc-300/80 hover:text-white transition-colors text-[15px]">Company History</a></li>
                            <li><a href="#" className="text-zinc-300/80 hover:text-white transition-colors text-[15px]">Meet the Team</a></li>
                            <li><a href="#" className="text-zinc-300/80 hover:text-white transition-colors text-[15px]">Employee Handbook</a></li>
                            <li><a href="#" className="text-zinc-300/80 hover:text-white transition-colors text-[15px]">Careers</a></li>
                        </ul>
                    </div>

                    {/* Helpful Links Column */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-semibold text-[17px]">Helpful Links</h4>
                        <ul className="flex flex-col gap-4">
                            <li><a href="#" className="text-zinc-300/80 hover:text-white transition-colors text-[15px]">FAQs</a></li>
                            <li><a href="#" className="text-zinc-300/80 hover:text-white transition-colors text-[15px]">Support</a></li>
                            <li className="flex items-center gap-2">
                                <a href="#" className="text-zinc-300/80 hover:text-white transition-colors text-[15px]">Live Chat</a>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-12"></div>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us Column */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-semibold text-[17px]">Contact Us</h4>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <a href="mailto:hello@scholarsphere.com" className="group flex items-center gap-3 text-zinc-300/80 hover:text-white transition-colors text-[15px]">
                                    <Mail className="w-[18px] h-[18px] text-blue-500 group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
                                    hello@scholarsphere.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+15551234567" className="group flex items-center gap-3 text-zinc-300/80 hover:text-white transition-colors text-[15px]">
                                    <Phone className="w-[18px] h-[18px] text-blue-500 group-hover:text-blue-400 transition-colors" strokeWidth={1.5} />
                                    +1 555 123 4567
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300/80 text-[15px]">
                                <MapPin className="w-[18px] h-[18px] text-blue-500" strokeWidth={1.5} />
                                San Francisco, CA
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Divider */}
                <div className="w-full h-[1px] bg-white/10 mb-8 relative z-20"></div>

                {/* Bottom Section - Socials & Copyright */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-20">
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" strokeWidth={1.5} /></a>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" strokeWidth={1.5} /></a>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" strokeWidth={1.5} /></a>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Dribbble className="w-5 h-5" strokeWidth={1.5} /></a>
                        <a href="#" className="text-zinc-400 hover:text-white transition-colors"><Globe className="w-5 h-5" strokeWidth={1.5} /></a>
                    </div>
                    <div className="text-zinc-300/80 text-[14px]">
                        © 2026 ScholarSphere AI. All rights reserved.
                    </div>
                </div>

            </div>

            {/* Giant Background Text with Animated Gradient Fill */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black tracking-widest whitespace-nowrap opacity-20 pointer-events-none select-none z-0 animate-text-shimmer"
                style={{
                    WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
                    color: 'transparent',
                    backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 20%, rgba(168, 85, 247, 0.4) 40%, rgba(59, 130, 246, 0.4) 60%, transparent 80%, transparent 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                }}
            >
                SCHOLAR
            </div>

            {/* Bottom Gradient Overlay to partially mask the text at the very bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-black to-transparent pointer-events-none z-10"></div>

        </footer>
    );
}
