import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateKunaljLink } from '../lib/whatsapp';
import { SlidersHorizontal, ArrowUpRight } from 'lucide-react';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  price: string;
  condition?: string;
  img_url?: string;
  image_url?: string; 
  engine?: string;
  mileage?: string;
  transmission?: string;
  location?: string;
}

const fallbackVehicles: Vehicle[] = [
  {
    id: "fb-1",
    brand: "Mercedes-Benz",
    model: "G-Class AMG 63",
    price: "₦ 185,000,000",
    condition: "Brand New",
    image_url: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2069&auto=format&fit=crop",
    engine: "4.0L V8 Biturbo",
    mileage: "Delivery Mileage",
    transmission: "Automatic",
    location: "Lagos, Nigeria"
  },
  {
    id: "fb-2",
    brand: "Lexus",
    model: "LX 600 VIP",
    price: "₦ 160,000,000",
    condition: "Brand New",
    image_url: "https://images.unsplash.com/photo-1563720225384-9c0f12f928e3?q=80&w=2000&auto=format&fit=crop",
    engine: "3.5L V6 Twin-Turbo",
    mileage: "Delivery Mileage",
    transmission: "Automatic",
    location: "Lagos, Nigeria"
  },
  {
    id: "fb-3",
    brand: "Range Rover",
    model: "Autobiography",
    price: "₦ 190,000,000",
    condition: "Brand New",
    image_url: "https://images.unsplash.com/photo-1566367576585-051277d52997?q=80&w=2000&auto=format&fit=crop",
    engine: "4.4L V8",
    mileage: "Delivery Mileage",
    transmission: "Automatic",
    location: "Lagos, Nigeria"
  },
  {
    id: "fb-4",
    brand: "Toyota",
    model: "Land Cruiser 300 Series",
    price: "₦ 135,000,000",
    condition: "Brand New",
    image_url: "https://images.unsplash.com/photo-1593941707882-a5bba14938cb?q=80&w=2072&auto=format&fit=crop",
    engine: "3.5L V6 Twin-Turbo",
    mileage: "Delivery Mileage",
    transmission: "Automatic",
    location: "Lagos, Nigeria"
  },
  {
    id: "fb-5",
    brand: "Mercedes-Benz",
    model: "GLE 450",
    price: "₦ 85,000,000",
    condition: "Tokunbo",
    image_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop",
    engine: "3.0L Inline-6",
    mileage: "35,000 mi",
    transmission: "Automatic",
    location: "Lagos, Nigeria",
  },
  {
    id: "fb-6",
    brand: "Lexus",
    model: "RX 350 F-Sport",
    price: "₦ 58,000,000",
    condition: "Tokunbo",
    image_url: "https://images.unsplash.com/photo-1563720225384-9c0f12f928e3?q=80&w=2000&auto=format&fit=crop",
    engine: "3.5L V6",
    mileage: "42,000 mi",
    transmission: "Automatic",
    location: "Lagos, Nigeria",
  },
  {
    id: "fb-7",
    brand: "Toyota",
    model: "Prado TXL",
    price: "₦ 48,000,000",
    condition: "Tokunbo",
    image_url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop",
    engine: "2.7L 4-Cylinder",
    mileage: "50,000 mi",
    transmission: "Automatic",
    location: "Lagos, Nigeria",
  },
  {
    id: "fb-8",
    brand: "Range Rover",
    model: "Velar",
    price: "₦ 72,000,000",
    condition: "Tokunbo",
    image_url: "https://images.unsplash.com/photo-1566367576585-051277d52997?q=80&w=2000&auto=format&fit=crop",
    engine: "2.0L 4-Cylinder Turbo",
    mileage: "28,000 mi",
    transmission: "Automatic",
    location: "Lagos, Nigeria",
  },
  {
    id: "fb-9",
    brand: "Mercedes-Benz",
    model: "S-Class 580",
    price: "₦ 150,000,000",
    condition: "Tokunbo",
    image_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop",
    engine: "4.0L V8 Biturbo",
    mileage: "18,000 mi",
    transmission: "Automatic",
    location: "Lagos, Nigeria",
  },
  {
    id: "fb-10",
    brand: "Honda",
    model: "Accord Touring",
    price: "₦ 28,000,000",
    condition: "Tokunbo",
    image_url: "https://images.unsplash.com/photo-1605816988069-b11383b50717?q=80&w=2070&auto=format&fit=crop",
    engine: "2.0L Turbo 4-Cylinder",
    mileage: "65,000 mi",
    transmission: "Automatic",
    location: "Lagos, Nigeria",
  },
  {
    id: "fb-11",
    brand: "Toyota",
    model: "Hilux V8",
    price: "₦ 45,000,000",
    condition: "Brand New",
    image_url: "https://images.unsplash.com/photo-1621004511394-1a3b1a2ee7b2?q=80&w=2070&auto=format&fit=crop",
    engine: "2.8L Diesel",
    mileage: "Delivery Mileage",
    transmission: "Automatic",
    location: "Lagos, Nigeria"
  },
  {
    id: "fb-12",
    brand: "Lexus",
    model: "GX 460",
    price: "₦ 62,000,000",
    condition: "Tokunbo",
    image_url: "https://images.unsplash.com/photo-1615655787680-92bdab68a73a?q=80&w=2070&auto=format&fit=crop",
    engine: "4.6L V8",
    mileage: "48,000 mi",
    transmission: "Automatic",
    location: "Lagos, Nigeria"
  }
];

export default function Showroom() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [conditionFilter, setConditionFilter] = useState<'All' | 'Brand New' | 'Tokunbo'>('All');
  const [makeFilter, setMakeFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All'); // Rough mapping

  useEffect(() => {
    async function fetchVehicles() {
      setLoading(true);
      const { data, error } = await supabase.from('vehicles').select('*');
      if (!error && data) {
        setVehicles([...fallbackVehicles, ...data]);
      } else {
        setVehicles([...fallbackVehicles]);
      }
      setLoading(false);
    }
    fetchVehicles();
  }, []);

  const getImageUrl = (v: Vehicle) => {
    return v.img_url || v.image_url || "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2069&auto=format&fit=crop";
  };

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
      makeMatch = v.brand.toLowerCase() === makeFilter.toLowerCase();
    }

    return condMatch && makeMatch;
  });

  const uniqueMakes = Array.from(new Set(vehicles.map(v => v.brand))).filter(Boolean);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen py-16">
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
                  <div className="w-full h-64 bg-[#FAFAFA] relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-[#FAFAFA] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                      style={{ backgroundImage: `url('${getImageUrl(car)}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A110D]/70 via-transparent to-transparent opacity-80" />
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
                    <div className="mb-4">
                      <span className="text-[10px] font-bold font-mono tracking-widest text-[#063A26] uppercase mb-2 block">{car.brand}</span>
                      <h3 className="text-2xl font-light tracking-wide text-[#0A110D] mb-3">{car.model}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6 pt-6 border-t border-[#E5E8E6]">
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Engine</div>
                        <div className="text-xs font-medium text-[#0A110D]">{car.engine || "Standard"}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Mileage</div>
                        <div className="text-xs font-medium text-[#0A110D]">{car.mileage || "N/A"}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Transmission</div>
                        <div className="text-xs font-medium text-[#0A110D]">{car.transmission || "Automatic"}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold font-mono tracking-widest text-[#4A5F54] uppercase mb-1">Location</div>
                        <div className="text-xs font-medium text-[#0A110D] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {car.location || "Lagos HQ"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-[#E5E8E6]">
                      <div className="text-sm font-mono text-[#D4AF37] font-bold tracking-widest uppercase mb-6">
                        {car.price || 'REQUEST QUOTE'}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => {
                             window.open(generateKunaljLink("Vehicle", `${car.brand} ${car.model}`, `Condition: ${car.condition || 'Unknown'}`), '_blank');
                          }}
                          className="flex-1 flex items-center justify-center text-[10px] font-bold tracking-wider bg-[#063A26] text-white hover:bg-[#D4AF37] hover:text-[#0A110D] transition-all py-3.5 uppercase shadow-md group-hover:shadow-xl group"
                        >
                          <span className="mr-2">Initiate Inquiry</span>
                          <ArrowUpRight size={14} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                        <a 
                          href="https://jiji.ng/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center text-[10px] font-bold tracking-wider border border-[#E5E8E6] text-[#0A110D] bg-[#FAFAFA] hover:border-[#063A26] transition-all py-3.5 uppercase group"
                        >
                          <span className="mr-2">Buy on Jiji</span>
                          <ArrowUpRight size={14} className="text-[#063A26]" />
                        </a>
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
