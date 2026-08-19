export default function Legal() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen text-[#1A1A1A] py-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-16 border-b border-[#E5E8E6] pb-8">
          <div className="flex items-center gap-3 mb-3">
             <span className="w-6 h-px bg-[#C8102E]"></span>
             <span className="text-[10px] font-mono tracking-widest text-[#C8102E] uppercase font-bold block">05 / DOCUMENTATION</span>
          </div>
          <h1 className="text-4xl font-light tracking-[0.02em] text-[#1A1A1A]">LEGAL FRAMEWORK</h1>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-medium tracking-wide mb-6">Privacy Policy</h2>
          <div className="space-y-6 text-sm text-[#4A5F54] leading-relaxed">
            <p>
              At KUNLAJ Autos Ltd., operating out of 285 Ipaja Road, Lagos, we prioritize the confidentiality and integrity of our clients' data. This document outlines our data handling practices concerning our primary operations: vehicle sales (Accident-Free Tokunbo and Brand New), parts sourcing, and professional services.
            </p>
            <h3 className="text-lg font-medium text-[#1A1A1A] pt-4 border-t border-[#E5E8E6]/50">1. Data Collection & WhatsApp Routing</h3>
            <p>
              Our platform utilizes a streamlined intent-routing engine. When you request a vehicle quote, verify parts fitment via our Year-Make-Model (YMM) system, or book a service appointment, we collect explicit configuration details. This data is securely forwarded immediately to our centralized operations team via WhatsApp (+234 803 858 7752). Your connection is end-to-end encrypted under standard WhatsApp protocol. We do not store your communication data locally on our web servers.
            </p>
            <h3 className="text-lg font-medium text-[#1A1A1A] pt-4 border-t border-[#E5E8E6]/50">2. Platform Integrations</h3>
            <p>
              As a Verified Enterprise Seller, inquiries initiated on our platforms are governed by kunlajautos.com.ng's privacy agreements. KUNLAJ Autos acts on inquiries respectfully and promises full transparency regarding the condition, mileage, custom duties, and documentation of all vehicles.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-medium tracking-wide mb-6">Sales Terms & Duty Clearances</h2>
          <div className="space-y-6 text-sm text-[#4A5F54] leading-relaxed">
            <h3 className="text-lg font-medium text-[#1A1A1A] pt-4 border-t border-[#E5E8E6]/50">1. Vehicle Condition & Inspections</h3>
            <p>
              All Tokunbo vehicles are guaranteed accident-free unless explicitly stated otherwise. We encourage prospective buyers to run VIN checks and employ personal mechanics for physical inspections at our Ipaja terminal before payment. 
            </p>
            <h3 className="text-lg font-medium text-[#1A1A1A] pt-4 border-t border-[#E5E8E6]/50">2. Customs and Documentation</h3>
            <p>
              100% of our imported vehicles carry full Nigerian Customs Service (NCS) duty payments. We supply all original clearance papers at the point of sale. Post-purchase vehicle registration support can be facilitated upon request.
            </p>
            <h3 className="text-lg font-medium text-[#1A1A1A] pt-4 border-t border-[#E5E8E6]/50">3. Parts Sourcing Liability</h3>
            <p>
              While our Fitment Matrix engineering catalog strives for strict accuracy, final hardware compatibility remains the responsibility of the client matching real-world specs. KUNLAJ Autos assumes full liability for replacements only when the component is sourced and installed at our Service Matrix center.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
