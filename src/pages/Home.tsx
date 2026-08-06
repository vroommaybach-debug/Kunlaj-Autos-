import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cars } from "../lib/carsData";

export default function Home() {
  return (
    <div className="w-full bg-[#FAFAFA] overflow-hidden">
      {/* Layered Hero Section */}
      <section className="relative w-full h-[85vh] lg:h-[90vh]">
        <div 
          className="absolute top-0 right-0 w-full lg:w-[85%] h-full bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url('${cars[2].images[1]}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/95 lg:via-[#FAFAFA]/60 to-[#1A1A1A]/20 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/90 lg:via-[#FAFAFA]/80 to-transparent z-10" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C8102E] rounded-full blur-3xl opacity-20 z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1A1A1A] rounded-full blur-3xl opacity-20 z-10"></div>
        
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center">
          <div className="max-w-xl md:mt-20">
            <span className="inline-block text-[10px] items-center font-bold tracking-[0.2em] text-white bg-[#C8102E] uppercase mb-6 px-4 py-1.5 shadow-lg relative overflow-hidden group">
              <span className="relative z-10">Registered Dealership • Ipaja, Lagos</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </span>
            <h1 className="text-[38px] sm:text-5xl lg:text-7xl font-light tracking-tight text-[#1A1A1A] mb-6 leading-[1.1] sm:leading-tight drop-shadow-sm max-w-2xl">
              Premium <span className="font-semibold text-[#C8102E]">Tokunbo &</span> Brand New Cars.
            </h1>
            <p className="text-sm md:text-base text-[#4A5F54] font-normal leading-relaxed mb-8 max-w-lg">
              Direct importers of accident-free, full customs-duty paid vehicles. We integrate a trusted showroom inventory with certified parts and maintenance in Lagos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link 
                to="/showroom" 
                className="inline-flex justify-center items-center space-x-3 bg-[#1A1A1A] text-[#FAFAFA] text-xs font-bold tracking-wider uppercase px-8 py-5 hover:bg-[#C8102E] hover:text-[#1A1A1A] transition-colors shadow-2xl relative overflow-hidden group"
              >
                <span className="relative z-10">Enter Showroom</span>
                <ArrowUpRight size={16} className="relative z-10 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <a 
                href="https://jiji.ng/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center space-x-3 bg-white border-2 border-[#E5E8E6] text-[#1A1A1A] text-xs font-bold tracking-wider uppercase px-8 py-5 hover:border-[#C8102E] transition-colors shadow-lg group"
              >
                <span>Visit our Jiji Store</span>
                <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-[#C8102E]" />
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-mono text-[#C8102E] font-medium">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20 text-green-600 border border-green-500/30">✓</span>
              Verified Enterprise Jiji Seller
            </div>
          </div>
        </div>

        {/* Floating Glassmorphism Spec Card - Optimized for Mobile */}
        <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-[340px] md:bottom-12 md:left-12 lg:left-24 z-30 bg-white/70 backdrop-blur-3xl border border-white p-4 shadow-[0_20px_50px_rgba(6,58,38,0.15)] overflow-hidden group cursor-pointer hover:bg-white transition-all transform hover:-translate-y-2">
          <Link to="/showroom" className="block">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#1A1A1A]"></div>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FAFAFA] overflow-hidden shrink-0 border border-[#E5E8E6]">
                <img src={cars[0].images[0]} alt={`${cars[0].make} ${cars[0].model}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div>
                <div className="text-[9px] md:text-[10px] font-mono tracking-widest text-[#C8102E] mb-1 font-bold">FEATURED SPEC</div>
                <div className="text-sm md:text-base font-semibold text-[#1A1A1A] tracking-wide truncate">{cars[0].make} {cars[0].model}</div>
                <div className="text-[10px] md:text-xs text-[#4A5F54] mt-1 font-medium truncate">{cars[0].condition}</div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Brand Trust Band */}
      <section className="border-y border-[#E5E8E6] bg-white py-12 overflow-hidden relative flex shadow-sm z-20">
        <div className="absolute inset-0 z-10 pointer-events-none before:absolute before:left-0 before:top-0 before:w-32 before:h-full before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:w-32 after:h-full after:bg-gradient-to-l after:from-white after:to-transparent" />
        
        <div className="animate-ticker opacity-50 hover:opacity-100 transition-opacity duration-700">
          {Array(4).fill([
            { name: 'Mercedes-Benz', icon: 'https://cdn.simpleicons.org/mercedes/0A110D' },
            { name: 'Toyota', icon: 'https://cdn.simpleicons.org/toyota/0A110D' },
            { name: 'Lexus', icon: 'https://cdn.simpleicons.org/lexus/0A110D' },
            { name: 'Land Rover', icon: 'https://cdn.simpleicons.org/landrover/0A110D' },
            { name: 'Honda', icon: 'https://cdn.simpleicons.org/honda/0A110D' },
            { name: 'BMW', icon: 'https://cdn.simpleicons.org/bmw/0A110D' }
          ]).flat().map((brand, idx) => (
             <div key={idx} className="flex items-center space-x-6 mx-16 grayscale hover:grayscale-0 transition-all duration-500 cursor-default shrink-0">
               <span className="text-xl font-mono tracking-[0.2em] font-medium text-[#4A5F54] hover:text-[#C8102E] transition-colors uppercase">
                 {brand.name}
               </span>
             </div>
          ))}
        </div>
      </section>

      {/* Complex Category Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
               <span className="w-8 h-px bg-[#C8102E]"></span>
               <span className="text-[10px] font-mono tracking-widest text-[#C8102E] font-bold uppercase">01 / FLEET ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-light tracking-[0.02em] text-[#1A1A1A]">EXPLORE BY CLASS</h2>
          </div>
          <Link to="/showroom" className="text-xs font-bold tracking-widest uppercase text-[#C8102E] hover:text-[#C8102E] transition-colors flex items-center gap-2 group">
            View All Stock <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:grid-rows-2 md:h-[600px]">
          {/* Main Large Tile */}
          <Link to="/showroom?category=suv" className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-white shadow-xl flex flex-col justify-end p-8 border border-[#E5E8E6] hover:border-[#C8102E] transition-colors">
            <div className="absolute inset-0 bg-[#FAFAFA] bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" style={{ backgroundImage: `url('${cars[0].images[2]}')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent" />
            <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
               <span className="inline-block px-3 py-1 bg-[#C8102E] text-[#1A1A1A] text-[9px] font-bold tracking-widest uppercase mb-3">Most Popular</span>
               <h3 className="text-3xl font-medium tracking-wide text-white mb-2">Luxury SUVs</h3>
               <p className="text-sm text-[#E5E8E6] font-light max-w-sm">Commanding presence, armored options, and absolute comfort for Nigerian terrain.</p>
            </div>
          </Link>

          {/* Secondary Tile Top */}
          <Link to="/showroom?category=sedan" className="md:col-span-2 relative group overflow-hidden bg-white shadow-md flex flex-col justify-end p-6 border border-[#E5E8E6] hover:border-[#C8102E] transition-colors">
            <div className="absolute inset-0 bg-[#FAFAFA] bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" style={{ backgroundImage: `url('${cars[2].images[2]}')` }} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/10 to-transparent" />
             <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-1">
               <h3 className="text-2xl font-medium tracking-wide text-white mb-1">Executive Sedans</h3>
               <p className="text-xs text-[#E5E8E6] font-light">Sleek, aerodynamic profiles for city transits.</p>
            </div>
          </Link>

          {/* Small Tile Bottom Left */}
          <Link to="/showroom?category=truck" className="relative group overflow-hidden bg-white shadow-md flex flex-col justify-end p-6 border border-[#E5E8E6] hover:border-[#C8102E] transition-colors">
            <div className="absolute inset-0 bg-[#FAFAFA] bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" style={{ backgroundImage: `url('${cars[4].images[0]}')` }} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 to-transparent" />
             <div className="relative z-10">
               <h3 className="text-lg font-medium tracking-wide text-white">Trucks</h3>
               <div className="w-8 h-[2px] bg-[#C8102E] mt-3 group-hover:w-16 transition-all duration-500" />
            </div>
          </Link>

          {/* Small Tile Bottom Right */}
          <Link to="/showroom?category=hybrid" className="relative group overflow-hidden bg-white shadow-md flex flex-col justify-end p-6 border border-[#E5E8E6] hover:border-[#C8102E] transition-colors">
            <div className="absolute inset-0 bg-[#FAFAFA] bg-cover bg-center opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" style={{ backgroundImage: `url('${cars[1].images[0]}')` }} />
             <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 to-transparent" />
             <div className="relative z-10">
               <h3 className="text-lg font-medium tracking-wide text-white">Hybrid / EV</h3>
               <div className="w-8 h-[2px] bg-[#C8102E] mt-3 group-hover:w-16 transition-all duration-500" />
            </div>
          </Link>
        </div>
      </section>
      
      {/* Jiji Trust Banner */}
      <section className="bg-gradient-to-br from-[#1A1A1A] to-[#0D4F36] py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8102E] rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-10 relative z-10">
           <div className="max-w-2xl">
             <div className="flex items-center justify-center md:justify-start gap-2 text-[#C8102E] mb-4">
               {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
               <span className="text-xs font-mono font-bold tracking-widest uppercase ml-2 text-white">5.0 Seller Rating</span>
             </div>
             <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-4">Verified Enterprise Seller</h3>
             <p className="text-sm md:text-base text-white/80 leading-relaxed font-light">Find KUNLAJ Autos on Jiji.ng. We maintain a perfect rating history backed by real Lagos customer reviews, transparent pricing, and 100% duty-cleared vehicles.</p>
           </div>
           <a 
             href="https://jiji.ng/"
             target="_blank"
             rel="noopener noreferrer"
             className="px-10 py-5 bg-white text-[#1A1A1A] font-bold text-xs uppercase tracking-wider hover:bg-[#C8102E] hover:text-[#1A1A1A] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 group"
           >
             Shop on Jiji <ArrowUpRight size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </a>
        </div>
      </section>
    </div>
  );
}
