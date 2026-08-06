import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, MessageSquare, X } from "lucide-react";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-[#FAFAFA] text-[#1A1A1A] min-h-screen flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-[#FAFAFA] antialiased transition-colors duration-500">
      <header className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl border-b bg-white/80 border-[#E5E8E6] px-6 py-4 md:px-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-[0.2em] relative flex items-center">
            <span className="text-[#C8102E]">KUNLAJ&nbsp;</span>
            <span className="relative flex items-center">
              <span className="animate-speed-off text-[#1A1A1A] font-light">AUTOS</span>
              <span className="animate-smoke flex items-center justify-center">☁️</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium tracking-[0.15em]">
            <Link to="/" className="text-[#4A5F54] hover:text-[#C8102E] transition-colors relative group">
              HOME
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8102E] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/showroom" className="text-[#4A5F54] hover:text-[#C8102E] transition-colors relative group">
              SHOWROOM
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8102E] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/parts" className="text-[#4A5F54] hover:text-[#C8102E] transition-colors relative group">
              PARTS CENTER
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8102E] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/service" className="text-[#4A5F54] hover:text-[#C8102E] transition-colors relative group">
              SERVICE DESK
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8102E] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/archive" className="text-[#4A5F54] hover:text-[#C8102E] transition-colors relative group">
              SUCCESS STORIES
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8102E] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <a 
              href="https://wa.me/2348038587752?text=Hello%20KUNLAJ%20Autos,%20I'm%20inquiring%20from%20your%20platform." 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-2 text-[11px] font-bold tracking-wider uppercase px-5 py-2.5 transition-all shadow-md hover:shadow-xl bg-[#1A1A1A] text-[#FAFAFA] hover:bg-[#C8102E] hover:text-[#1A1A1A] group"
            >
              <MessageSquare size={14} className="group-hover:scale-110 transition-transform"/>
              <span>Connect Live</span>
            </a>
            <button 
              className="md:hidden p-1 text-[#1A1A1A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full border-b pb-8 px-6 bg-white border-[#E5E8E6] shadow-2xl">
            <nav className="flex flex-col space-y-6 mt-6 text-sm font-medium tracking-[0.15em] text-[#1A1A1A]">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
              <Link to="/showroom" onClick={() => setMobileMenuOpen(false)}>SHOWROOM</Link>
              <Link to="/parts" onClick={() => setMobileMenuOpen(false)}>PARTS CENTER</Link>
              <Link to="/service" onClick={() => setMobileMenuOpen(false)}>SERVICE DESK</Link>
              <Link to="/archive" onClick={() => setMobileMenuOpen(false)}>SUCCESS STORIES</Link>
              <a 
                href="https://wa.me/2348038587752?text=Hello%20KUNLAJ%20Autos,%20I'm%20inquiring%20from%20your%20platform." 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-[#C8102E] pt-4 border-t border-[#E5E8E6]"
              >
                <MessageSquare size={16} />
                <span>CONNECT LIVE ON WHATSAPP</span>
              </a>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full pt-[76px] flex flex-col">
        {children}
      </main>

      <Footer />
    </div>
  );
}
