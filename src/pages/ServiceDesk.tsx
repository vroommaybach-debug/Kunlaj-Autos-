import { generateKunaljLink } from '../lib/whatsapp';
import { ArrowUpRight } from 'lucide-react';

export default function ServiceDesk() {
  const packages = [
    {
      title: "Diagnostic Scan",
      desc: "Complete digital telemetry review and fault code extraction via certified OBD-II scanners. Identifies engine, transmission, and electrical discrepancies.",
      price: "System Inspection",
      image: "https://images.unsplash.com/photo-1590226487106-95ff8c2b7dfb?q=80&w=2074&auto=format&fit=crop"
    },
    {
      title: "Logistics Camp Routine Service",
      desc: "High-tier routine execution, premium synthetic oil change, fluid standardization, and full filter replacement. Perfect for 5K/10K mileage intervals.",
      price: "Routine Maintenance",
      image: "https://images.unsplash.com/photo-1632823469850-9d5de41b9de1?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Full Overhaul",
      desc: "Comprehensive mechanical strip-down, structural integrity checks, and precision reassembly. Reserved for complex transmission jobs and major engine rebuilds.",
      price: "Advanced Operations",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-[#0A110D]">
      {/* Hero Header */}
      <div className="w-full bg-white border-b border-[#E5E8E6] py-16 px-6 md:px-12 mt-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#063A26]/5 blur-3xl transform skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-6 relative z-10">
           <div>
             <div className="flex items-center gap-3 mb-3">
               <span className="w-6 h-px bg-[#D4AF37]"></span>
               <span className="text-[10px] font-mono tracking-widest text-[#063A26] uppercase font-bold">04 / OPERATIONS</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-light tracking-[0.02em] text-[#0A110D]">SERVICE DESK</h1>
           </div>
           <div className="text-xs font-mono text-[#4A5F54] max-w-sm">
             Schedule direct diagnostics and high-level execution at our dedicated service center at Ipaja Road.
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        {/* Floating Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {packages.map((pkg, idx) => (
            <div key={idx} className="relative group perspective-1000">
              {/* Offset Background Graphic for depth */}
              <div className="absolute top-4 left-4 w-full h-full border border-[#E5E8E6] bg-white transform translate-x-2 translate-y-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500 z-0 shadow-sm" />
              
              {/* Primary Card */}
              <div className="bg-white border text-left border-[#E5E8E6] flex flex-col justify-between h-full relative z-10 hover:shadow-2xl hover:border-[#063A26] transition-all duration-500 overflow-hidden transform group-hover:-translate-y-2">
                <div className="w-full h-48 bg-[#FAFAFA] relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-[#E5E8E6] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
                    style={{ backgroundImage: `url('${pkg.image}')`}} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A110D]/60 to-transparent"></div>
                </div>
                
                <div className="p-8 flex flex-col flex-1 bg-white">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase">LEVEL // 0{idx + 1}</span>
                      <span className="text-[9px] font-mono tracking-widest font-bold text-[#D4AF37] border-b border-[#D4AF37] pb-0.5 uppercase">{pkg.price}</span>
                    </div>
                    <h3 className="text-2xl font-light tracking-wide text-[#0A110D] mb-4">{pkg.title}</h3>
                    <p className="text-sm leading-relaxed text-[#4A5F54] mb-8">{pkg.desc}</p>
                  </div>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => {
                        window.open(generateKunaljLink("Service", pkg.title, "Initiated from Service Desk portal"), '_blank');
                      }}
                      className="w-full flex items-center justify-between text-xs font-bold tracking-wider text-[#0A110D] group-hover:text-[#D4AF37] transition-colors py-4 uppercase border-t border-[#E5E8E6] group-hover:border-[#063A26]"
                    >
                      <span className="group-hover:text-[#063A26] transition-colors">Initiate Booking</span>
                      <ArrowUpRight size={18} className="transform text-[#063A26] group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* HQ Detail Band */}
      <div className="border-t border-[#E5E8E6] bg-white py-12 shadow-sm">
         <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <h4 className="text-lg font-light tracking-widest text-[#0A110D] uppercase">KUNLAJ OPERATIONS HQ</h4>
            <div className="flex items-center gap-8 text-xs font-mono text-[#4A5F54] font-medium">
               <div>285 IPAJA ROAD<br/>LAGOS, NIGERIA</div>
               <div className="w-px h-8 bg-[#E5E8E6]" />
               <div>MON-SAT<br/>08:00 - 18:00</div>
            </div>
         </div>
      </div>
    </div>
  );
}
