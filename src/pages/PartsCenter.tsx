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
    // Engine Oils
    { id: 'o1', name: 'Fully Synthetic Engine Oil (5W-30)', category: 'Engine Oils', make_compatibility: 'Universal Premium' },
    { id: 'o2', name: 'Semi-Synthetic Engine Oil (10W-40)', category: 'Engine Oils', make_compatibility: 'Universal Premium' },
    { id: 'o3', name: 'Mineral Engine Oil', category: 'Engine Oils', make_compatibility: 'Standard Duty' },
    
    // Engine Parts
    { id: 'e1', name: 'Premium Oil Filter', category: 'Engine Parts', make_compatibility: 'Toyota', model_compatibility: 'Highlander' },
    { id: 'e2', name: 'Serpentine Drive Belt', category: 'Engine Parts', make_compatibility: 'Hyundai', model_compatibility: 'Santa Fe' },
    { id: 'e3', name: 'Valve Cover Gasket Set', category: 'Engine Parts', make_compatibility: 'Mercedes-Benz', model_compatibility: 'C300' },
    { id: 'e4', name: 'Iridium Spark Plugs', category: 'Engine Parts', make_compatibility: 'Nissan', model_compatibility: 'Cabstar' },
    
    // Lights
    { id: 'l1', name: 'LED Headlight Bulb Kit', category: 'Lights', make_compatibility: 'Universal Premium' },
    { id: 'l2', name: 'OEM Taillight Assembly', category: 'Lights', make_compatibility: 'Toyota', model_compatibility: 'Tacoma' },
    { id: 'l3', name: 'Fog Light Upgrade Kit', category: 'Lights', make_compatibility: 'Toyota', model_compatibility: 'T100' },
    
    // Car Covers
    { id: 'c1', name: 'All-Weather Car Cover', category: 'Car Covers', make_compatibility: 'Toyota', model_compatibility: 'Highlander' },
    { id: 'c2', name: 'Indoor Custom Fit Cover', category: 'Car Covers', make_compatibility: 'Mercedes-Benz', model_compatibility: 'C300' },
    
    // Model-Specific Parts
    { id: 'm1', name: 'Heavy Duty Suspension Springs', category: 'Model-Specific Parts', make_compatibility: 'Toyota', model_compatibility: 'Hiace' },
    { id: 'm2', name: 'TRD Pro Front Grille', category: 'Model-Specific Parts', make_compatibility: 'Toyota', model_compatibility: 'Tacoma' },
    { id: 'm3', name: 'AMG Line Bumper Splitter', category: 'Model-Specific Parts', make_compatibility: 'Mercedes-Benz', model_compatibility: 'C300' },
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
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1A1A1A]/5 blur-3xl transform skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-6 relative z-10">
           <div>
             <div className="flex items-center gap-3 mb-3">
               <span className="w-6 h-px bg-[#C8102E]"></span>
               <span className="text-[10px] font-mono tracking-widest text-[#C8102E] uppercase font-bold">03 / PROCUREMENT SYSTEM</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-light tracking-[0.02em] text-[#1A1A1A]">FITMENT MATRIX</h1>
           </div>
           <div className="text-xs font-mono text-[#4A5F54] max-w-sm">
             Input exact Year, Make, and Model parameters to filter certified supply components.
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-[#C8102E] rounded-full blur-3xl opacity-10 pointer-events-none"></div>
        
        {/* Fitment Form */}
        <div className="bg-white border border-[#E5E8E6] p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#1A1A1A]" />
          
          <div className="flex items-center space-x-3 text-[#1A1A1A] mb-8 relative z-10">
            <Filter size={18} className="text-[#C8102E]" />
            <span className="text-sm font-bold tracking-widest uppercase">Target Vector</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold font-mono tracking-widest text-[#C8102E] uppercase mb-3">Manufacturer</label>
              <select 
                value={make} 
                onChange={(e) => setMake(e.target.value)} 
                className="bg-[#FAFAFA] border border-[#E5E8E6] text-xs font-mono text-[#1A1A1A] p-4 outline-none appearance-none rounded-none focus:border-[#C8102E] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="">ALL MAKES</option>
                <option value="Toyota">TOYOTA</option>
                <option value="Hyundai">HYUNDAI</option>
                <option value="Mercedes-Benz">MERCEDES-BENZ</option>
                <option value="Nissan">NISSAN</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="text-[10px] font-bold font-mono tracking-widest text-[#C8102E] uppercase mb-3">Model Code</label>
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)} 
                className="bg-[#FAFAFA] border border-[#E5E8E6] text-xs font-mono text-[#1A1A1A] p-4 outline-none appearance-none rounded-none focus:border-[#C8102E] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="">ALL MODELS</option>
                <option value="Highlander">HIGHLANDER</option>
                <option value="Santa Fe">SANTA FE</option>
                <option value="C300">C300</option>
                <option value="Cabstar">CABSTAR</option>
                <option value="Tacoma">TACOMA</option>
                <option value="T100">T100</option>
                <option value="Hiace">HIACE</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold font-mono tracking-widest text-[#C8102E] uppercase mb-3">Production Year</label>
              <input 
                type="text" 
                placeholder="E.G. 2023" 
                value={year} 
                onChange={(e) => setYear(e.target.value)} 
                className="bg-[#FAFAFA] border border-[#E5E8E6] text-xs font-mono text-[#1A1A1A] p-4 outline-none rounded-none focus:border-[#C8102E] focus:bg-white placeholder-[#8E8E93] transition-colors" 
              />
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <div className="mb-8 border-b border-[#E5E8E6] pb-4 flex justify-between items-end relative z-10">
           <h3 className="text-xl font-light tracking-wide text-[#1A1A1A]">VERIFIED MATCHES</h3>
           <span className="text-xs font-mono text-[#4A5F54] font-medium">YMM VECTOR ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {loading ? (
            <div className="col-span-1 md:col-span-3 py-24 text-center border border-dashed border-[#E5E8E6] bg-white shadow-sm">
              <Cog size={24} className="mx-auto text-[#C8102E] animate-spin mb-4" />
              <div className="text-xs font-mono tracking-widest text-[#4A5F54] font-bold uppercase">Querying Engineering Databank...</div>
            </div>
          ) : (parts.length > 0 ? parts : placeholderParts)
                .filter(part => {
                  if (make && part.make_compatibility !== 'Universal Premium' && part.make_compatibility !== 'Standard Duty') {
                    if (part.make_compatibility !== make) return false;
                  }
                  if (model) {
                    if (part.model_compatibility && part.model_compatibility !== model) return false;
                  }
                  return true;
                })
                .map((part) => (
              <div key={part.id} className="bg-white border border-[#E5E8E6] flex flex-col group hover:border-[#C8102E] hover:shadow-2xl transition-all duration-500 relative transform hover:-translate-y-1">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 right-4 text-[9px] font-mono text-[#C8102E] font-bold bg-white border border-[#E5E8E6] px-3 py-1.5 shadow-md uppercase">
                    {part.category || 'Component'}
                  </div>
                </div>

                {/* Data Block */}
                <div className="p-6 flex flex-col flex-1 border-t border-[#E5E8E6] bg-white relative z-10">
                  <h4 className="text-xl font-light text-[#1A1A1A] tracking-wide mb-2">{part.name}</h4>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-[#C8102E] uppercase mb-6">{part.make_compatibility}</div>
                  
                  <div className="mt-auto">
                    <button 
                      onClick={() => {
                        const context = `Context YMM: ${year || 'Any Year'} ${make || 'Any Make'} ${model || 'Any Model'}`;
                        window.open(generateKunaljLink("Part", part.name, context), '_blank');
                      }}
                      className="w-full py-4 bg-[#1A1A1A] text-center text-[10px] font-bold tracking-widest text-[#FAFAFA] hover:bg-[#C8102E] hover:text-[#1A1A1A] transition-all flex items-center justify-center space-x-2 shadow-md group-hover:shadow-lg"
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
