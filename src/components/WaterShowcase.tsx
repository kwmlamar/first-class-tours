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
    title: 'The Turquoise Welcome Gates',
    subtitle: 'Freeport Harbour Cruise Channel',
    category: 'Freeport Harbour Channel',
    url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1200',
    description: 'Your very first view of Grand Bahama\'s magical water color. This shallow cruise channel is flanked by bright, pastel-colored wooden shops, towering palm trees, and active catamarans floating on a pure turquoise mirror. Our drivers wait directly here at the gate to begin your ocean-side escape.',
    hue: 'Luminous Neon Cyan (#00C6DF)',
    sand: 'Coral Beach Pearl',
    bestTime: 'High Noon (for maximum water glow)',
    accentQuote: 'The water at the cruise port is so bright it looks artificial — a stunning, neon-teal welcome to Freeport.',
    transferDestination: 'Freeport Cruise Port (Main Gates)'
  },
  {
    id: 'gold-rock-crystal',
    title: 'The Pristine Sandbar Dream',
    subtitle: 'Gold Rock Beach (Lucayan National Park)',
    category: 'Lucayan National Park Shoreline',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    description: 'Arguably the most famous beach in the Bahamas. At low tide, the emerald water retreats to expose miles of rippled, powdery white-sand bars. Towering palms line the left coast, while swimmers wade in waist-deep water that remains completely transparent for hundreds of yards out.',
    hue: 'Crystal Seafoam & Electric Jade',
    sand: 'Sugar-fine Soft White Sand',
    bestTime: 'Low Tide hour (highly recommended by Harold)',
    accentQuote: 'Where "Pirates of the Caribbean" was filmed — a tranquil, untouched beach sanctuary where the ocean merges with the sky.',
    transferDestination: 'Gold Rock Beach & Lucayan Caves'
  },
  {
    id: 'coastal-panorama',
    title: 'The Aerial Reef & Forest Shelf',
    subtitle: 'Sunset Over Grand Bahama\'s Pristine Coastline',
    category: 'Grand Bahama Coastline (Aerial)',
    url: 'https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&q=80&w=1200',
    description: 'An breathtaking perspective showing the thin ribbon of sugar-sand beach separating lush green pine forests from a massive, shallow turquoise shelf. Watch the pale-pink sunset reflect on the peaceful, mirror-like shallows before the bottom drops into the deep navy Atlantic.',
    hue: 'Translucent Aqua fading to Sapphire Blue',
    sand: 'Mixed Silica & Coral-Shell Pearl',
    bestTime: 'Sunset / Evening Dusk',
    accentQuote: 'An extraordinary aerial sight showing the sheer scale of Freeport\'s crystal-clear shallow reef boundary.',
    transferDestination: 'West End Marina & Condos (Old Bahama Bay)'
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
            Experience the World\'s Most Beautiful Water
          </h2>
          
          <p className="text-sm md:text-base text-ocean-800/80 font-light leading-relaxed">
            The Bahamas is defined by the extraordinary clarity of its shallow reefs. Explore three real photographs of Grand Bahama\'s waters sent in by our guests, and discover how First Class Tours puts these shores at the heart of your island itinerary.
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

            {/* Live Backdrop Customizer Tooltip */}
            {onSelectPhotoAsBackdrop && (
              <div className="bg-sand-100/60 border border-sand-300 p-5 rounded-2xl text-left hidden lg:block">
                <div className="flex items-center gap-2 text-sand-500 mb-1.5">
                  <Sparkles className="w-4 h-4 fill-sand-500 text-sand-500 animate-spin-slow" />
                  <span className="text-[10px] font-bold tracking-wider uppercase font-mono">App Ambient Decorator</span>
                </div>
                <p className="text-xs text-ocean-900/80 leading-relaxed font-light mb-4">
                  Love this water scene? Tap below to set this specific photograph as the large full-bleed backdrop in our main website Hero header!
                </p>
                
                <button
                  onClick={() => onSelectPhotoAsBackdrop(activePhoto.url)}
                  disabled={activeBackdropUrl === activePhoto.url}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                    activeBackdropUrl === activePhoto.url
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-ocean-950 hover:bg-ocean-900 text-white hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {activeBackdropUrl === activePhoto.url ? (
                    <>✓ Set as Current Backdrop</>
                  ) : (
                    <>Set as Site Hero Backdrop</>
                  )}
                </button>
              </div>
            )}

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
                    {/* Glowing water tag overlays */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 bg-black/50 text-white backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider border border-white/15 shadow flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-ocean-300 fill-ocean-300" />
                        Water Color: {activePhoto.hue}
                      </span>
                    </div>

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

                  {/* Scientific/Experiential Shoreline Specs Row */}
                  <div className="grid grid-cols-3 gap-4 py-6 border-b border-ocean-100">
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-ocean-500 uppercase tracking-wider block">Water Luminescence</span>
                      <span className="text-xs sm:text-sm font-bold text-ocean-950 flex items-center gap-1 mt-0.5">
                        <Droplets className="w-3.5 h-3.5 text-ocean-500 flex-shrink-0" />
                        {activePhoto.hue.split('(')[0].trim()}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] font-mono text-ocean-500 uppercase tracking-wider block">Coastline Sand Base</span>
                      <span className="text-xs sm:text-sm font-bold text-ocean-950 flex items-center gap-1 mt-0.5">
                        <Sun className="w-3.5 h-3.5 text-sand-500 flex-shrink-0" />
                        {activePhoto.sand}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[9px] font-mono text-ocean-500 uppercase tracking-wider block">Optimal Viewing Hour</span>
                      <span className="text-xs sm:text-sm font-bold text-ocean-950 flex items-center gap-1 mt-0.5">
                        <Waves className="w-3.5 h-3.5 text-ocean-600 flex-shrink-0" />
                        {activePhoto.bestTime.split('(')[0].trim()}
                      </span>
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

                  <div className="flex gap-2 w-full sm:w-auto">
                    {onSelectPhotoAsBackdrop && (
                      <button
                        onClick={() => onSelectPhotoAsBackdrop(activePhoto.url)}
                        className="flex-1 sm:flex-none uppercase text-[10px] font-bold border border-ocean-200 hover:border-ocean-400 bg-white hover:bg-ocean-50 text-ocean-900 py-3 px-4 rounded-xl transition-all cursor-pointer block lg:hidden"
                      >
                        Set as Backdrop
                      </button>
                    )}

                    <button
                      onClick={() => handleScrollToBooking(activePhoto.transferDestination)}
                      className="flex-grow sm:flex-none bg-ocean-900 hover:bg-ocean-950 text-white font-bold py-3 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-ocean-900/10 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Book Tour Stop to this location
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
