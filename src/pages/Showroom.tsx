import { useEffect, useState } from 'react';
import { generateKunaljLink } from '../lib/whatsapp';
import { SlidersHorizontal, ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cars, Car } from '../lib/carsData';

function CarDetailModal({ car, onClose }: { car: Car; onClose: () => void }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? car.images.length - 1 : prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row border border-[#E5E8E6]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 backdrop-blur flex items-center justify-center rounded-full border border-black/10 hover:bg-white transition-colors"
        >
          <X size={20} className="text-black" />
        </button>

        {/* Gallery Section */}
        <div className="w-full md:w-3/5 bg-[#FAFAFA] flex flex-col">
          {/* Main Image */}
          <div className="relative aspect-[4/3] w-full bg-black flex items-center justify-center group overflow-hidden">
            <img 
              src={car.images[activeImageIndex]} 
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
            
            {/* Arrows */}
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 p-4 overflow-x-auto bg-[#FAFAFA] border-r border-[#E5E8E6]">
            {car.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-24 aspect-video overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-[#063A26] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/5 flex flex-col bg-white p-8">
          <div className="mb-6">
            <span className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase mb-2 block">{car.make} • {car.year}</span>
            <h2 className="text-3xl font-light tracking-wide text-[#0A110D] mb-4">{car.model}</h2>
            <div className="text-2xl font-mono text-[#D4AF37] font-bold tracking-wider mb-4">
              {car.priceLabel}
            </div>
            <div className="inline-block px-3 py-1 bg-[#063A26]/5 border border-[#063A26]/20 text-[10px] font-bold tracking-widest text-[#063A26] uppercase mb-4">
              {car.condition}
            </div>
            <p className="text-sm text-[#4A5F54] leading-relaxed border-l-2 border-[#063A26] pl-4 italic">
              {car.status}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-8">
            <h3 className="text-xs font-bold font-mono tracking-widest text-[#0A110D] uppercase mb-4 pb-2 border-b border-[#E5E8E6]">Engine Specifications</h3>
            <div className="grid grid-cols-1 gap-y-4">
              <div className="flex justify-between border-b border-[#E5E8E6]/50 pb-2">
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase">Engine Type</span>
                <span className="text-xs font-medium text-[#0A110D] text-right">{car.engine.type}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E8E6]/50 pb-2">
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase">Displacement</span>
                <span className="text-xs font-medium text-[#0A110D] text-right">{car.engine.displacement}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E8E6]/50 pb-2">
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase">Horsepower</span>
                <span className="text-xs font-medium text-[#0A110D] text-right">{car.engine.horsepower}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E8E6]/50 pb-2">
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase">Torque</span>
                <span className="text-xs font-medium text-[#0A110D] text-right">{car.engine.torque}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E8E6]/50 pb-2">
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase">Transmission</span>
                <span className="text-xs font-medium text-[#0A110D] text-right">{car.engine.transmission}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E8E6]/50 pb-2">
                <span className="text-[10px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase">Fuel Type</span>
                <span className="text-xs font-medium text-[#0A110D] text-right">{car.engine.fuelType}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[#E5E8E6] flex flex-col gap-3">
            <button 
              onClick={() => {
                  window.open(generateKunaljLink("Vehicle", `${car.year} ${car.make} ${car.model}`, `Condition: ${car.condition}, Price: ${car.priceLabel}`), '_blank');
              }}
              className="w-full flex items-center justify-center text-[10px] font-bold tracking-wider bg-[#063A26] text-white hover:bg-[#D4AF37] hover:text-[#0A110D] transition-all py-4 uppercase shadow-md group-hover:shadow-xl group"
            >
              <span className="mr-2">Send Inquiry to Agent</span>
              <ArrowUpRight size={14} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Showroom() {
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  // Filter States
  const [conditionFilter, setConditionFilter] = useState<'All' | 'Brand New' | 'Tokunbo'>('All');
  const [makeFilter, setMakeFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All');

  useEffect(() => {
    // Replaced supabase fetch with local data import
    setVehicles(cars);
    setLoading(false);
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    const vCond = v.condition ? v.condition.toLowerCase() : '';
    
    // Condition Match
    let condMatch = true;
    if (conditionFilter === 'Brand New') {
      condMatch = vCond.includes('new') || vCond === 'brand new';
    } else if (conditionFilter === 'Tokunbo') {
      condMatch = vCond.includes('tokunbo') || vCond.includes('used');
    }

    // Make match
    let makeMatch = true;
    if (makeFilter !== 'All') {
      makeMatch = v.make.toLowerCase() === makeFilter.toLowerCase();
    }

    // Rough price match (assuming standard tiers)
    let priceMatch = true;
    if (priceFilter === 'Standard Luxury') {
      priceMatch = v.price < 20000000;
    } else if (priceFilter === 'Premium Elite') {
      priceMatch = v.price >= 20000000 && v.price < 50000000;
    } else if (priceFilter === 'Ultra Luxury') {
      priceMatch = v.price >= 50000000;
    }

    return condMatch && makeMatch && priceMatch;
  });

  const uniqueMakes = Array.from(new Set(vehicles.map(v => v.make))).filter(Boolean);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-16">
      {selectedCar && <CarDetailModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
      
      {/* Header */}
      <div className="w-full bg-white border-b border-[#E5E8E6] py-16 px-6 md:px-12 mt-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#063A26]/5 blur-3xl transform skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-end gap-6 relative z-10">
           <div>
             <div className="flex items-center gap-3 mb-3">
               <span className="w-6 h-px bg-[#D4AF37]"></span>
               <span className="text-[10px] font-mono tracking-widest text-[#063A26] uppercase font-bold">02 / ACTIVE INVENTORY</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-light tracking-[0.02em] text-[#0A110D]">THE SHOWROOM</h1>
           </div>
           <div className="text-xs font-mono text-[#4A5F54] max-w-sm">
             Browse our globally verified selection of pristine condition and premium foreign-used vehicles.
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col lg:flex-row gap-12">
        {/* Left Column: Sticky Sidebar Filters */}
        <aside className="lg:w-1/4 w-full">
          <div className="sticky top-28 bg-white border border-[#E5E8E6] p-8 shadow-xl shadow-[#063A26]/5 rounded-none">
             <div className="flex items-center space-x-3 text-[#0A110D] mb-8 pb-4 border-b border-[#E5E8E6]">
                <SlidersHorizontal size={18} className="text-[#063A26]" />
                <span className="text-sm font-bold tracking-widest uppercase">Filter Matrix</span>
             </div>

             {/* Condition Filter */}
             <div className="mb-8">
               <span className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase block mb-4">Condition</span>
               <div className="flex flex-col space-y-4">
                 {['All', 'Brand New', 'Tokunbo'].map((cond) => (
                   <label key={cond} className="flex items-center space-x-3 cursor-pointer group">
                     <input 
                       type="radio" 
                       name="condition" 
                       checked={conditionFilter === cond}
                       onChange={() => setConditionFilter(cond as any)}
                       className="appearance-none w-4 h-4 border border-[#E5E8E6] rounded-sm checked:bg-[#063A26] checked:border-[#063A26] transition-all relative after:content-[''] after:absolute after:hidden checked:after:block after:top-[2px] after:left-[2px] after:w-2 after:h-2 after:bg-[#D4AF37]"
                     />
                     <span className={`text-xs tracking-wide uppercase transition-colors font-medium ${conditionFilter === cond ? 'text-[#0A110D]' : 'text-[#4A5F54] group-hover:text-[#063A26]'}`}>{cond}</span>
                   </label>
                 ))}
               </div>
             </div>

             {/* Make Filter */}
             <div className="mb-8">
               <span className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase block mb-4">Manufacturer</span>
               <select 
                 value={makeFilter}
                 onChange={(e) => setMakeFilter(e.target.value)}
                 className="w-full bg-[#FAFAFA] border border-[#E5E8E6] text-xs font-mono text-[#0A110D] p-3 outline-none rounded-none focus:border-[#063A26] transition-colors"
               >
                 <option value="All">ALL MAKES</option>
                 {uniqueMakes.map(make => (
                   <option key={make as string} value={make as string}>{(make as string).toUpperCase()}</option>
                 ))}
               </select>
             </div>
             
             {/* Price Rough Filter */}
             <div>
               <span className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase block mb-4">Price Tier</span>
               <div className="flex flex-col space-y-4">
                 {['All', 'Standard Luxury', 'Premium Elite', 'Ultra Luxury'].map((tier) => (
                   <label key={tier} className="flex items-center space-x-3 cursor-pointer group">
                     <input 
                       type="radio" 
                       name="price" 
                       checked={priceFilter === tier}
                       onChange={() => setPriceFilter(tier)}
                       className="appearance-none w-4 h-4 border border-[#E5E8E6] rounded-sm checked:bg-[#063A26] checked:border-[#063A26] transition-all relative after:content-[''] after:absolute after:hidden checked:after:block after:top-[2px] after:left-[2px] after:w-2 after:h-2 after:bg-[#D4AF37]"
                     />
                     <span className={`text-xs tracking-wide uppercase transition-colors font-medium ${priceFilter === tier ? 'text-[#0A110D]' : 'text-[#4A5F54] group-hover:text-[#063A26]'}`}>{tier}</span>
                   </label>
                 ))}
               </div>
             </div>
          </div>
        </aside>

        {/* Right Column: Inventory Grid */}
        <div className="lg:w-3/4 w-full">
          <div className="mb-6 flex justify-between items-center text-xs font-mono text-[#4A5F54] border-b border-[#E5E8E6] pb-4">
            <span>SHOWING {filteredVehicles.length} CONFIGURATIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-2 py-32 text-center text-xs font-mono tracking-widest text-[#4A5F54] uppercase">
                <div className="w-8 h-8 rounded-full border-2 border-[#063A26] border-t-transparent animate-spin mx-auto mb-4"></div>
                Synchronizing with Warehouse Node...
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="col-span-2 py-32 text-center text-xs font-mono tracking-widest text-[#4A5F54] uppercase border border-dashed border-[#E5E8E6] bg-white">
                No configurations found for active visual tier.
              </div>
            ) : (
              filteredVehicles.map((car) => (
                <div key={car.id} className="group flex flex-col bg-white border border-[#E5E8E6] hover:border-[#063A26] transition-all duration-500 shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative">
                  
                  {/* Image Block */}
                  <div className="w-full h-64 bg-[#FAFAFA] relative overflow-hidden cursor-pointer" onClick={() => setSelectedCar(car)}>
                    <div 
                      className="absolute inset-0 bg-[#FAFAFA] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ backgroundImage: `url('${car.images[0]}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A110D]/70 via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="px-6 py-2 bg-black/50 backdrop-blur text-white text-[10px] font-bold tracking-widest uppercase border border-white/20">
                        View Details
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {car.condition && (
                         <span className="text-[9px] font-bold tracking-widest text-[#0A110D] bg-white px-3 py-1.5 uppercase shadow-md">
                           {car.condition}
                         </span>
                      )}
                    </div>
                  </div>

                  {/* Metadata Block */}
                  <div className="flex flex-col flex-1 p-6 sm:p-8 z-10 relative bg-white">
                    <div className="mb-4 cursor-pointer" onClick={() => setSelectedCar(car)}>
                      <span className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase mb-2 block">{car.make} • {car.year}</span>
                      <h3 className="text-2xl font-light tracking-wide text-[#0A110D] mb-3 group-hover:text-[#063A26] transition-colors">{car.model}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6 pt-6 border-t border-[#E5E8E6]">
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Engine</div>
                        <div className="text-xs font-medium text-[#0A110D] truncate" title={car.engine.type}>{car.engine.type}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Fuel Type</div>
                        <div className="text-xs font-medium text-[#0A110D]">{car.engine.fuelType}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Transmission</div>
                        <div className="text-xs font-medium text-[#0A110D]">{car.engine.transmission}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Status</div>
                        <div className="text-xs font-medium text-[#0A110D] flex items-center gap-1 truncate" title={car.status}>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {car.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-[#E5E8E6]">
                      <div className="text-sm font-mono text-[#D4AF37] font-bold tracking-widest uppercase mb-6">
                        {car.priceLabel}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => setSelectedCar(car)}
                          className="flex-1 flex items-center justify-center text-[10px] font-bold tracking-wider bg-[#063A26] text-white hover:bg-[#D4AF37] hover:text-[#0A110D] transition-all py-3.5 uppercase shadow-md group-hover:shadow-xl group"
                        >
                          <span className="mr-2">View Gallery & Specs</span>
                          <ArrowUpRight size={14} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
