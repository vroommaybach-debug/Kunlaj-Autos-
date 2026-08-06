import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] border-t border-[#C8102E] py-16 px-6 md:px-12 text-[#FAFAFA] text-sm relative z-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8102E] rounded-full blur-3xl opacity-10 transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-1">
           <div className="mb-6 block relative h-10 w-16 md:w-20 overflow-hidden shrink-0">
             <img 
               src="https://rir1tw7zermluiyr.public.blob.vercel-storage.com/file_00000000781081f4af412add16ff6512-removebg-preview.png" 
               alt="Kunlaj Autos Logo"
               className="absolute left-0 top-0 h-10 w-auto max-w-none object-cover object-left" 
             />
           </div>
           <p className="text-xs text-white/70 leading-relaxed mb-6 font-mono pr-4">
             The premier automotive sourcing platform integrating elite showroom inventory with an immediate certified supply line for parts and professional maintenance at 285 Ipaja Road, Lagos.
           </p>
        </div>
        
        <div>
          <h4 className="text-xs font-bold tracking-[0.1em] text-[#C8102E] uppercase mb-6">Inventory</h4>
          <ul className="space-y-3 text-xs tracking-wide text-white/70">
            <li><Link to="/showroom?condition=Brand+New" className="hover:text-[#FAFAFA] transition-colors">Brand New Models</Link></li>
            <li><Link to="/showroom?condition=Tokunbo" className="hover:text-[#FAFAFA] transition-colors">Premium Tokunbo</Link></li>
            <li><Link to="/showroom?category=suv" className="hover:text-[#FAFAFA] transition-colors">Luxury SUVs</Link></li>
            <li><Link to="/showroom" className="hover:text-[#FAFAFA] transition-colors">Special Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.1em] text-[#C8102E] uppercase mb-6">Operations</h4>
          <ul className="space-y-3 text-xs tracking-wide text-white/70">
            <li><Link to="/parts" className="hover:text-[#FAFAFA] transition-colors">Parts & Components</Link></li>
            <li><Link to="/parts" className="hover:text-[#FAFAFA] transition-colors">Tire & Wheel Fitment</Link></li>
            <li><Link to="/service" className="hover:text-[#FAFAFA] transition-colors">Routine Service</Link></li>
            <li><Link to="/service" className="hover:text-[#FAFAFA] transition-colors">Diagnostic Engine Scan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-[0.1em] text-[#C8102E] uppercase mb-6">Legal & Connect</h4>
          <ul className="space-y-3 text-xs tracking-wide text-white/70">
            <li><Link to="/legal" className="hover:text-[#FAFAFA] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/legal" className="hover:text-[#FAFAFA] transition-colors">Terms of Service</Link></li>
            <li><a href="https://jiji.ng/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FAFAFA] flex items-center gap-2 transition-colors"><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> Verified Jiji Seller</a></li>
            <li className="pt-2 text-white/90">285 Ipaja Road, Lagos, Nigeria</li>
            <li className="text-[#C8102E] font-mono font-bold">+234 803 858 7752</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-[10px] font-mono tracking-widest text-white/50 uppercase relative z-10">
        &copy; 2026 KUNLAJ AUTOS LTD. ALL RIGHTS RESERVED. IMAGINED BY JUNESTUDIO.
      </div>
    </footer>
  );
}
