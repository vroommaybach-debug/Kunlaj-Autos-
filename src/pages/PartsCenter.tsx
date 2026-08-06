import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateKunaljLink } from '../lib/whatsapp';
import { Filter, MessageSquare, Cog } from 'lucide-react';

interface Part {
  id: string;
  name: string;
  category: string;
  make_compatibility?: string;
  model_compatibility?: string;
  image_url?: string;
}

export default function PartsCenter() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  // Fallback placeholder parts to show when empty
  const placeholderParts: Part[] = [
    { id: '1', name: 'Brembo Ceramic Brake Pads', category: 'Braking System', make_compatibility: 'Universal Premium' },
    { id: '2', name: 'Michelin Pilot Sport 4S (275/35ZR21)', category: 'Tire & Wheel Fitment', make_compatibility: 'SUV / Premium Sedan' },
    { id: '3', name: 'OEM Transmission Fluid (9-Speed)', category: 'Fluids & Maintenance', make_compatibility: 'Mercedes-Benz' },
    { id: '4', name: 'LED Matrix Headlamp Assembly', category: 'Lighting & Electrical', make_compatibility: 'Range Rover' },
    { id: '5', name: 'Air Suspension Compressor', category: 'Suspension', make_compatibility: 'Lexus LX' },
    { id: '6', name: 'High-Performance Alternator (150A)', category: 'Electrical', make_compatibility: 'Toyota Land Cruiser' },
  ];

  useEffect(() => {
    async function fetchParts() {
      setLoading(true);
      let query = supabase.from('parts').select('*');
      
      if (make) {
        query = query.or(`make_compatibility.ilike.%${make}%,make_compatibility.ilike.Universal,make_compatibility.is.null`);
      }
      if (model) {
        query = query.or(`model_compatibility.ilike.%${model}%,model_compatibility.ilike.Universal,model_compatibility.is.null`);
      }
      
      const { data, error } = await query;
      if (!error && data) {
        setParts(data);
      } else {
        setParts([]);
      }
      setLoading(false);
    }
    
    const timeout = setTimeout(fetchParts, 400);
    return () => clearTimeout(timeout);
  }, [make, model]);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-[#0A0A0A]">
      {/* Header Area */}
      <div className="w-full bg-white border-b border-[#E5E8E6] py-16 px-6 md:px-12 mt-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#063A26]/5 blur-3xl transform skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-6 relative z-10">
           <div>
             <div className="flex items-center gap-3 mb-3">
               <span className="w-6 h-px bg-[#D4AF37]"></span>
               <span className="text-[10px] font-mono tracking-widest text-[#063A26] uppercase font-bold">03 / PROCUREMENT SYSTEM</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-light tracking-[0.02em] text-[#0A110D]">FITMENT MATRIX</h1>
           </div>
           <div className="text-xs font-mono text-[#4A5F54] max-w-sm">
             Input exact Year, Make, and Model parameters to filter certified supply components.
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl opacity-10 pointer-events-none"></div>
        
        {/* Fitment Form */}
        <div className="bg-white border border-[#E5E8E6] p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#063A26]" />
          
          <div className="flex items-center space-x-3 text-[#0A110D] mb-8 relative z-10">
            <Filter size={18} className="text-[#063A26]" />
            <span className="text-sm font-bold tracking-widest uppercase">Target Vector</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase mb-3">Manufacturer</label>
              <select 
                value={make} 
                onChange={(e) => setMake(e.target.value)} 
                className="bg-[#FAFAFA] border border-[#E5E8E6] text-xs font-mono text-[#0A110D] p-4 outline-none appearance-none rounded-none focus:border-[#063A26] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="">SELECT MAKE</option>
                <option value="Mercedes-Benz">MERCEDES-BENZ</option>
                <option value="Toyota">TOYOTA</option>
                <option value="Lexus">LEXUS</option>
                <option value="Range Rover">RANGE ROVER</option>
                <option value="Honda">HONDA</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase mb-3">Model Code</label>
              <input 
                type="text" 
                placeholder="E.G. G63, RX350" 
                value={model} 
                onChange={(e) => setModel(e.target.value)} 
                className="bg-[#FAFAFA] border border-[#E5E8E6] text-xs font-mono text-[#0A110D] p-4 outline-none rounded-none focus:border-[#063A26] focus:bg-white placeholder-[#8E8E93] uppercase transition-colors" 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase mb-3">Production Year</label>
              <input 
                type="text" 
                placeholder="E.G. 2023" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                className="bg-[#FAFAFA] border border-[#E5E8E6] text-xs font-mono text-[#0A110D] p-4 outline-none rounded-none focus:border-[#063A26] focus:bg-white placeholder-[#8E8E93] transition-colors" 
              />
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <div className="mb-8 border-b border-[#E5E8E6] pb-4 flex justify-between items-end relative z-10">
           <h3 className="text-xl font-light tracking-wide text-[#0A110D]">VERIFIED MATCHES</h3>
           <span className="text-xs font-mono text-[#4A5F54] font-medium">YMM VECTOR ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {loading ? (
            <div className="col-span-1 md:col-span-3 py-24 text-center border border-dashed border-[#E5E8E6] bg-white shadow-sm">
              <Cog size={24} className="mx-auto text-[#063A26] animate-spin mb-4" />
              <div className="text-xs font-mono tracking-widest text-[#4A5F54] font-bold uppercase">Querying Engineering Databank...</div>
            </div>
          ) : (parts.length > 0 ? parts : placeholderParts).map((part) => (
              <div key={part.id} className="bg-white border border-[#E5E8E6] flex flex-col group hover:border-[#063A26] hover:shadow-2xl transition-all duration-500 relative transform hover:-translate-y-1">
                {/* Visual Block */}
                <div className="w-full h-56 bg-[#FAFAFA] relative overflow-hidden flex items-center justify-center p-4">
                  {part.image_url ? (
                    <img src={part.image_url} alt={part.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full bg-[#E5E8E6]/30 flex flex-col items-center justify-center">
                       <Cog size={32} className="text-[#4A5F54]/50 mb-2" />
                       <div className="text-[#4A5F54]/50 font-mono text-[9px] uppercase tracking-widest font-bold">Image Schema Void</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A110D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 text-[9px] font-mono text-[#063A26] font-bold bg-white border border-[#E5E8E6] px-3 py-1.5 shadow-md uppercase">
                    {part.category || 'Component'}
                  </div>
                </div>

                {/* Data Block */}
                <div className="p-6 flex flex-col flex-1 border-t border-[#E5E8E6] bg-white relative z-10">
                  <h4 className="text-xl font-light text-[#0A110D] tracking-wide mb-2">{part.name}</h4>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase mb-6">{part.make_compatibility}</div>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => {
                        const context = `Context YMM: ${year || 'Any Year'} ${make || 'Any Make'} ${model || 'Any Model'}`;
                        window.open(generateKunaljLink("Part", part.name, context), '_blank');
                      }}
                      className="w-full py-4 bg-[#063A26] text-center text-[10px] font-bold tracking-widest text-[#FAFAFA] hover:bg-[#D4AF37] hover:text-[#0A110D] transition-all flex items-center justify-center space-x-2 shadow-md group-hover:shadow-lg"
                    >
                      <MessageSquare size={13} className="transform group-hover:-translate-y-[1px] transition-transform" />
                      <span>REQUEST PROVISION</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
