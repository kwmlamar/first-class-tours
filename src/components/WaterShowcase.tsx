import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, MapPin, Compass, ArrowRight, Sparkles, Droplets, Sun, Waves } from 'lucide-react';

export interface BeachPhoto {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
  description: string;
  hue: string;
  sand: string;
  bestTime: string;
  accentQuote: string;
  transferDestination: string;
}

export const BAHAMAS_PHOTOS: BeachPhoto[] = [
  {
    id: 'port-welcoming',
    title: 'Freeport Harbour',
    subtitle: 'Cruise Channel',
    category: 'Freeport Harbour',
    url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1200',
    description: 'Your first view of Grand Bahama as your cruise ship docks. The shallow harbour water runs a vivid turquoise — Harold and his team wait right at the port gates, ready to take you straight into the island.',
    hue: 'Turquoise',
    sand: 'Coral sand',
    bestTime: 'Midday',
    accentQuote: 'Step off the ship and straight into Grand Bahama — Harold is waiting at the gate.',
    transferDestination: 'Freeport Cruise Port'
  },
  {
    id: 'gold-rock-crystal',
    title: 'Gold Rock Beach',
    subtitle: 'Lucayan National Park',
    category: 'Lucayan National Park',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    description: 'One of the most beautiful beaches in the Bahamas. At low tide the water pulls back to reveal wide, rippled sandbars you can walk out on. Clear, calm, and uncrowded — a regular stop on Harold\'s beach experience tours.',
    hue: 'Emerald and white',
    sand: 'Fine white sand',
    bestTime: 'Low tide',
    accentQuote: 'Wide open sandbars, crystal water, and no crowds — this is what Grand Bahama really looks like.',
    transferDestination: 'Gold Rock Beach'
  },
  {
    id: 'coastal-panorama',
    title: 'Grand Bahama Coastline',
    subtitle: 'Aerial View',
    category: 'Grand Bahama Coast',
    url: 'https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&q=80&w=1200',
    description: 'A look at the full scale of Grand Bahama\'s coastline — pine forests meeting shallow turquoise reef as far as you can see. The island is bigger and quieter than most visitors expect, and Harold knows every corner of it.',
    hue: 'Aqua and deep blue',
    sand: 'Shell and coral mix',
    bestTime: 'Late afternoon',
    accentQuote: 'Grand Bahama is bigger and quieter than most visitors expect — Harold knows every corner of it.',
    transferDestination: 'West End, Grand Bahama'
  }
];

interface WaterShowcaseProps {
  onSelectPhotoAsBackdrop?: (url: string) => void;
  activeBackdropUrl?: string;
}

export default function WaterShowcase({ onSelectPhotoAsBackdrop, activeBackdropUrl }: WaterShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activePhoto = BAHAMAS_PHOTOS[activeIndex];

  const handleScrollToBooking = (destinationName: string) => {
    // Attempt to set booking info
    const el = document.getElementById('booking-area');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-ocean-50/10 to-white relative overflow-hidden" id="water-showcase">
      {/* Decorative ambient rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-200/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Core explanation section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ocean-100 text-ocean-800 rounded-full text-xs font-bold uppercase tracking-wider border border-ocean-200/50">
            <Waves className="w-3.5 h-3.5 text-ocean-600 animate-pulse" />
            Emphasizing Bahamas Pristine Waters
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-ocean-950">
            The Waters That Make Grand Bahama Worth It
          </h2>

          <p className="text-sm md:text-base text-ocean-800/80 font-light leading-relaxed">
            The Bahamas is known for its water for a reason. These are real spots Harold takes guests to — from the cruise port gates to open beaches most tourists never find.
          </p>
        </div>

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive photo selector list (Left, 4 columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-ocean-700 tracking-wider uppercase font-mono block mb-1">
                Select Grand Bahama Water View
              </span>
              
              {BAHAMAS_PHOTOS.map((photo, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={photo.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer outline-none ${
                      isActive
                        ? 'bg-gradient-to-r from-ocean-900 to-ocean-950 text-white border-ocean-900 shadow-lg shadow-ocean-900/15'
                        : 'bg-white text-ocean-950 border-ocean-100 hover:border-ocean-300 hover:bg-ocean-50/20'
                    }`}
                  >
                    {/* Tiny thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-inner">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-mono uppercase tracking-wider block ${isActive ? 'text-sand-300' : 'text-ocean-500'}`}>
                        Photo {idx + 1} · {photo.subtitle}
                      </span>
                      <h4 className="text-xs font-bold truncate mt-0.5">
                        {photo.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>


          </div>

          {/* Core Interactive Showcase Display Frame (Center/Right, 8 columns) */}
          <div className="lg:col-span-8 bg-white border border-ocean-100 rounded-3xl p-6.5 md:p-8 shadow-xl relative flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Visual Frame */}
                  <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden relative shadow-md group border border-ocean-100">
                    <img
                      src={activePhoto.url}
                      alt={activePhoto.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                    />

                    <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 rounded-xl border border-white/5 backdrop-blur-2xs text-left">
                      <span className="text-[10px] font-bold text-sand-300 uppercase tracking-widest font-mono">
                        {activePhoto.category}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-white mt-1">
                        {activePhoto.title}
                      </h3>
                      <p className="text-[11px] text-ocean-100 mt-1 font-light leading-relaxed">
                        {activePhoto.accentQuote}
                      </p>
                    </div>
                  </div>


                  {/* Localized Storytelling */}
                  <div className="pt-6 text-left">
                    <h4 className="text-xs font-bold text-ocean-900 uppercase font-mono tracking-wider mb-2">
                      Local Insights & Experience Details
                    </h4>
                    <p className="text-xs md:text-sm text-ocean-800 font-light leading-relaxed">
                      {activePhoto.description}
                    </p>
                  </div>
                </div>

                {/* Direct Action triggers */}
                <div className="mt-8 pt-5 border-t border-ocean-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-mono text-ocean-500 tracking-wider">Plan trip stop coordinates</span>
                    <p className="text-xs font-bold text-ocean-950">
                      Destination: <span className="text-ocean-700">{activePhoto.transferDestination}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleScrollToBooking(activePhoto.transferDestination)}
                    className="bg-ocean-900 hover:bg-ocean-950 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-ocean-900/10 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Add this stop to your tour
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
