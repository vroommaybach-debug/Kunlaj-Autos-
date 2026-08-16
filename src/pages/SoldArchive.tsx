import { motion, useScroll, useTransform } from "motion/react";
import React, { useRef } from "react";
import { ArrowUpRight, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cars } from "../lib/carsData";

const hiace = cars.find(c => c.id === 'toyota-hiace-2001');

const SUCCESS_STORIES = [
  {
    id: 1,
    client: "Verified Buyer",
    vehicle: "Toyota Hiace 2001",
    quote: "A perfectly working engine and a seamless transaction. Very satisfied with the reliable delivery.",
    context: "Sourced for a client who needed a dependable commercial bus. We delivered this foreign-used Hiace in excellent mechanical condition.",
    imageUrl: hiace?.images[0] || "",
    price: "₦ 7,800,000",
    date: "August 2026"
  }
];

export default function SoldArchive() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="w-full bg-[#1A1A1A] min-h-screen text-white relative">
      {/* Immersive Header */}
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden sticky top-0">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('${cars[3].images[1]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: useTransform(scrollYProgress, [0, 0.2], [0.5, 0])
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/40 via-[#1A1A1A]/80 to-[#1A1A1A] z-10" />
        
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-12 h-px bg-[#C8102E]"></span>
            <span className="text-xs font-mono tracking-widest text-[#C8102E] uppercase font-bold">The Hall of Fame</span>
            <span className="w-12 h-px bg-[#C8102E]"></span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6 leading-tight"
          >
            Success Stories &<br />
            <span className="font-medium text-[#C8102E]">Sold Inventory</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed"
          >
            A curated archive of our most remarkable deliveries. Real clients, real vehicles, absolute transparency. Scroll to explore the KUNLAJ standard.
          </motion.p>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 1 }}
             className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce"
          >
             <span className="text-[10px] font-mono tracking-widest text-[#C8102E] uppercase mb-2">Scroll</span>
             <div className="w-px h-12 bg-gradient-to-b from-[#C8102E] to-transparent"></div>
          </motion.div>
        </div>
      </div>

      {/* Cinematic Sections */}
      <div className="relative z-30 bg-[#1A1A1A]">
        {SUCCESS_STORIES.map((story, idx) => (
          <StorySection key={story.id} story={story} index={idx} />
        ))}
      </div>

      {/* Call to Action */}
      <div className="py-32 bg-[#FAFAFA] text-[#1A1A1A] relative overflow-hidden z-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8102E] rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1A1A1A] rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-8">Ready to write your own<br/><span className="font-semibold text-[#C8102E]">Success Story?</span></h2>
          <p className="text-[#4A5F54] mb-12 max-w-xl mx-auto">Browse our current active inventory or contact us for a custom special order.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/showroom" 
              className="inline-flex justify-center items-center space-x-3 bg-[#1A1A1A] text-[#FAFAFA] text-xs font-bold tracking-wider uppercase px-10 py-5 hover:bg-[#C8102E] hover:text-[#1A1A1A] transition-colors shadow-2xl relative overflow-hidden group"
            >
              <span className="relative z-10">View Showroom</span>
              <ArrowUpRight size={16} className="relative z-10 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <a 
              href="https://wa.me/2348038587752"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center space-x-3 bg-white border-2 border-[#E5E8E6] text-[#1A1A1A] text-xs font-bold tracking-wider uppercase px-10 py-5 hover:border-[#C8102E] transition-colors shadow-lg group"
            >
              <span>Contact Live Agent</span>
              <MessageCircle size={16} className="transform group-hover:scale-110 transition-transform text-[#C8102E]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StorySection({ story, index }: { story: any, index: number, key?: React.Key }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="min-h-screen flex items-center py-24 relative overflow-hidden">
      {/* Background Parallax Image */}
      <motion.div 
        className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 grayscale-[30%] opacity-40"
        style={{
          backgroundImage: `url('${story.imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          y
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/90 to-[#1A1A1A]/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-[#1A1A1A] z-10" />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-20">
        <motion.div 
          style={{ opacity }}
          className={`flex flex-col lg:flex-row gap-16 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}
        >
          {/* Content */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono tracking-widest text-[#C8102E] uppercase bg-[#C8102E]/10 px-3 py-1 border border-[#C8102E]/20">{story.date}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-[#C8102E] fill-[#C8102E]" />)}
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
              {story.vehicle}
            </h2>
            
            <div className="relative pl-8 py-2 border-l-2 border-[#C8102E]">
              <p className="text-xl md:text-2xl font-medium text-white/90 italic leading-snug">"{story.quote}"</p>
              <p className="mt-4 text-sm font-bold tracking-widest text-[#C8102E] uppercase">— {story.client}</p>
            </div>
            
            <p className="text-white/60 font-light leading-relaxed max-w-xl text-lg">
              {story.context}
            </p>

            <div className="pt-8 border-t border-white/10 flex items-center justify-between max-w-md">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase mb-1">Status</div>
                <div className="text-sm font-bold tracking-wider text-green-500 uppercase">Delivered</div>
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest text-white/40 uppercase mb-1">Value</div>
                <div className="text-sm font-bold tracking-wider text-white uppercase">{story.price}</div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="flex-1 w-full">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10 shadow-2xl group">
              <motion.div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url('${story.imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase">Verified Spec</span>
                <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <ArrowUpRight size={14} className="text-white" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
