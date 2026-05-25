import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Phone, Clock, ArrowRight, ChevronDown, Check, 
  MapPin, Menu, X, Shield, Award, Calendar, 
  CheckCircle2, Compass, ArrowUpRight, ShieldCheck, Mail, ArrowDown, HelpCircle, UserCheck
} from 'lucide-react';
import { REVIEWS, VEHICLES, FAQS, TOUR_STOPS, BookingRequest } from './types';
import BookingForm from './components/BookingForm';
import TourPlanner from './components/TourPlanner';
import WaterShowcase from './components/WaterShowcase';

// CUSTOM RE-USABLE CIRCULAR LOGO BADGE
function LogoBadge({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`relative rounded-full flex items-center justify-center bg-ocean-950 border border-sand-400 select-none ${className}`}>
      {/* Outer spinning ring effect on hover */}
      <div className="absolute inset-0.5 rounded-full border border-dashed border-sand-400/30 animate-[spin_40s_linear_infinite]" />
      
      {/* Central typography */}
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-serif text-base md:text-lg font-black text-sand-400 tracking-tighter leading-none">FC</span>
        <span className="text-[5px] font-mono tracking-widest text-ocean-100 uppercase mt-0.5 leading-none px-0.5">TOURS</span>
      </div>
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'transfer' | 'tour'>('transfer');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showNotification, setShowNotification] = useState(false);
  const [lastBookingRef, setLastBookingRef] = useState<string>('');
  const [backdropUrl, setBackdropUrl] = useState('https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=2200');
  
  // Local bookings storage check for immediate preview console
  const [localBookings, setLocalBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    const fetchBookings = () => {
      const b1 = JSON.parse(localStorage.getItem('first_class_bookings') || '[]');
      const b2 = JSON.parse(localStorage.getItem('first_class_tours') || '[]');
      setLocalBookings([...b1, ...b2]);
    };
    fetchBookings();
    
    // Listen for storage changes
    window.addEventListener('storage', fetchBookings);
    return () => window.removeEventListener('storage', fetchBookings);
  }, []);

  const handleBookingSuccess = (booking: BookingRequest) => {
    setLastBookingRef(booking.id);
    setShowNotification(true);
    // Refresh bookings
    const b1 = JSON.parse(localStorage.getItem('first_class_bookings') || '[]');
    const b2 = JSON.parse(localStorage.getItem('first_class_tours') || '[]');
    setLocalBookings([...b1, ...b2]);
    
    // Auto clear notification after 8s
    setTimeout(() => {
      setShowNotification(false);
    }, 8000);
  };

  const clearBooking = (id: string) => {
    if (window.confirm('Would you like to cancel this simulated booking request?')) {
      const b1 = JSON.parse(localStorage.getItem('first_class_bookings') || '[]');
      const filtered1 = b1.filter((b: any) => b.id !== id);
      localStorage.setItem('first_class_bookings', JSON.stringify(filtered1));

      const b2 = JSON.parse(localStorage.getItem('first_class_tours') || '[]');
      const filtered2 = b2.filter((t: any) => t.id !== id);
      localStorage.setItem('first_class_tours', JSON.stringify(filtered2));

      setLocalBookings([...filtered1, ...filtered2]);
    }
  };

  const getWhatsAppDirectLink = () => {
    const msg = `Hello Harold! I am planning a trip to Grand Bahama and would like to ask a question. Please let me know your availability!`;
    return `https://wa.me/12428172900?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="relative min-h-screen bg-white text-ocean-950 overflow-x-hidden antialiased">
      
      {/* FLOATING SUCCESS BUBBLE */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-ocean-950 border border-sand-400 text-white rounded-2xl shadow-2xl p-5"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-sand-400/20 text-sand-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-sand-400/30">
                <Check className="w-5 h-5 stroke-[3px]" />
              </div>
              <div className="flex-1">
                <h5 className="font-serif text-sm font-bold text-sand-300">Request Logged for Harold</h5>
                <p className="text-xs text-ocean-200 mt-1 leading-relaxed">
                  Refer: <strong className="font-mono text-white tracking-widest">{lastBookingRef}</strong>. Harold Adderley will confirm via email or SMS. Double-check your WhatsApp message to prioritize scheduling!
                </p>
                <div className="mt-3.5 flex gap-2">
                  <a 
                    href={`https://wa.me/12428172900?text=${encodeURIComponent(`Hello Harold, my booking ref is ${lastBookingRef}. Please prioritize my confirmation request!`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-2xs transition-all flex items-center justify-center gap-1"
                  >
                    Send Direct Ping
                  </a>
                  <button 
                    onClick={() => setShowNotification(false)}
                    className="px-3 py-2 text-ocean-300 hover:text-white rounded-lg text-2xs font-semibold hover:bg-ocean-900 border border-ocean-800 transition-all cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED FLOATING WHATSAPP TRIGGER */}
      <a
        href={getWhatsAppDirectLink()}
        target="_blank"
        rel="noreferrer referrer"
        aria-label="Contact owner Harold Adderley directly on WhatsApp"
        className="fixed bottom-6 left-6 z-40 bg-[#25D366] hover:bg-[#20ba56] hover:scale-110 active:scale-95 text-white p-3.5 rounded-full shadow-2xl transition-all flex items-center justify-center cursor-pointer group"
      >
        {/* Simple ripple wave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping opacity-60 pointer-events-none group-hover:hidden" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-6 h-6 fill-white">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-ocean-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand layout */}
          <a href="#" className="flex items-center space-x-3 group outline-none">
            <LogoBadge className="w-13 h-13 transition-transform group-hover:rotate-6" />
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-ocean-950 leading-none">
                First Class Tours
              </span>
              <span className="text-[10px] font-mono tracking-widest text-ocean-600 uppercase mt-1 block">
                Freeport · Grand Bahama
              </span>
            </div>
          </a>

          {/* Desktop Nav menu links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-ocean-800">
            <a href="#" className="hover:text-ocean-600 transition-colors">Home</a>
            <a href="#services" className="hover:text-ocean-600 transition-colors">Our Services</a>
            <a href="#why-first-class" className="hover:text-ocean-600 transition-colors">About</a>
            <a href="#interactive-planner" className="hover:text-ocean-600 transition-colors">Book Transfer</a>
            <a href="#custom-tour-builder" className="hover:text-ocean-600 transition-colors">Custom Tour</a>
            <a href="#testimonials" className="hover:text-ocean-600 transition-colors">Reviews</a>
            <a href="#faqs" className="hover:text-ocean-600 transition-colors">FAQS</a>
          </nav>

          {/* CTA & Active Hours Badge */}
          <div className="hidden lg:flex items-center space-x-5">
            <div className="text-right">
              <div className="flex items-center justify-end text-[10px] uppercase font-bold text-emerald-600 gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Harold Online · 24/7
              </div>
              <a href="tel:+12428172900" className="text-xs font-mono font-bold text-ocean-800 hover:text-ocean-600 transition-colors block mt-0.5">
                +1 (242) 817-2900
              </a>
            </div>
            
            <a
              href="#interactive-planner"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-ocean-950 text-white hover:bg-ocean-900 border border-ocean-800 shadow-md shadow-ocean-950/10 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Book Transfer
            </a>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <a href="tel:+12428172900" className="p-2.5 rounded-full bg-ocean-50 text-ocean-800" aria-label="Call direct">
              <Phone className="w-4 h-4" />
            </a>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ocean-800 outline-none hover:bg-ocean-50 rounded-lg cursor-pointer transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-ocean-100 bg-white shadow-lg overflow-hidden absolute top-20 left-0 right-0 z-30"
          >
            <div className="px-5 py-6 space-y-4 text-center">
              <a 
                href="#" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-ocean-900 hover:text-ocean-600 py-1"
              >
                Home
              </a>
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-ocean-900 hover:text-ocean-600 py-1"
              >
                Our Services
              </a>
              <a 
                href="#why-first-class" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-ocean-900 hover:text-ocean-600 py-1"
              >
                About Harold
              </a>
              <a 
                href="#interactive-planner" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-ocean-900 hover:text-ocean-600 py-1"
              >
                Interactive Transfer Estimator
              </a>
              <a 
                href="#custom-tour-builder" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-ocean-900 hover:text-ocean-600 py-1"
              >
                Private Tour Course Designer
              </a>
              <a 
                href="#testimonials" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-ocean-900 hover:text-ocean-600 py-1"
              >
                Guest Reviews
              </a>
              <a 
                href="#faqs" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-ocean-900 hover:text-ocean-600 py-1"
              >
                FAQS
              </a>

              <div className="pt-4 border-t border-ocean-100">
                <p className="text-xs text-ocean-500 mb-2">Owner operated by Harold Adderley</p>
                <a
                  href="#interactive-planner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full bg-ocean-950 text-white font-bold py-3 px-4 rounded-xl block text-xs"
                >
                  Book Your Transfer
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-ocean-950 text-white overflow-hidden py-16 md:py-24">
        
        {/* Full-bleed high quality Unsplash pristine turquoise sea background representation */}
        <div className="absolute inset-0 z-0">
          <img
            src={backdropUrl}
            alt="Pristine Grand Bahama barrier reef and turquoise waters aerial visual"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 scale-102 transition-all duration-700 ease-in-out"
          />
          {/* Deep elegant overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-950 via-ocean-950/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Direct Copy Section */}
            <div className="lg:col-span-7 space-y-7 text-left">
              
              {/* Cruise port specific custom badge widget */}
              <div className="inline-flex items-center gap-2 bg-sand-400/20 text-sand-300 border border-sand-400/40 rounded-full py-2 px-4 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-xs animate-fade-in pointer-events-none">
                <span className="w-2.5 h-2.5 bg-sand-400 rounded-full animate-ping flex-shrink-0" />
                Cruise Day? We will be waiting right at the port gates.
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-tight leading-tight leading-none leading-normal">
                The Real<br />
                <span className="text-sand-400 inline-block mt-1">Grand Bahama.</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-ocean-150 font-light leading-relaxed max-w-2xl">
                Food tours, beach experiences, and private sightseeing — guided by a native local expert who knows every corner of Grand Bahama. Since 2014.
              </p>

              {/* Verified Trust Strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5 pt-2 border-y border-white/10 py-5 max-w-2xl">
                <span className="text-xs font-semibold text-ocean-200">Owner-Operated Since 2014</span>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <span className="text-xs font-semibold text-ocean-200">Freeport, Grand Bahama</span>
                <div className="h-4 w-px bg-white/20 hidden sm:block" />
                <span className="text-xs font-semibold text-ocean-200">Food Tours · Beach · Sightseeing</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <button
                  onClick={() => {
                    const el = document.getElementById('custom-tour-builder');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-sand-400 hover:bg-sand-500 text-ocean-950 font-black py-4 px-8 rounded-xl text-center shadow-lg shadow-sand-400/20 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  Explore Our Tours
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#interactive-planner"
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/20 text-white font-bold py-4 px-8 rounded-xl text-center transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-sm flex items-center justify-center"
                >
                  Book a Transfer
                </a>
              </div>

            </div>

            {/* Quick Estimator Showcase mockup Right Col */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-sand-400/20 via-ocean-400/10 to-transparent blur-xl pointer-events-none" />
              
              <div className="relative bg-white/5 border border-white/10 p-6 md:p-7 rounded-2xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-bold text-sand-300 font-mono tracking-wider">Our Experiences</span>
                  <span className="text-[10px] text-ocean-200">Freeport, Grand Bahama</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <span className="text-xs text-ocean-300 font-light block">Conch demo · Port Lucaya · Local eats</span>
                      <strong className="text-sm text-white font-semibold block mt-0.5">Grand Bahama Food Tour</strong>
                    </div>
                    <span className="font-mono text-sm font-bold text-sand-300">Custom rate</span>
                  </div>

                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <span className="text-xs text-ocean-300 font-light block">Taino Beach · Gold Rock · Coastal stops</span>
                      <strong className="text-sm text-white font-semibold block mt-0.5">Beach Experience</strong>
                    </div>
                    <span className="font-mono text-sm font-bold text-sand-300">Custom rate</span>
                  </div>

                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <span className="text-xs text-ocean-300 font-light block">Garden of the Groves · Heritage Trail</span>
                      <strong className="text-sm text-white font-semibold block mt-0.5">Island Sightseeing Tour</strong>
                    </div>
                    <span className="font-mono text-sm font-bold text-sand-300">Custom rate</span>
                  </div>
                </div>

                <div className="mt-5 text-center">
                  <button
                    onClick={() => {
                      const el = document.getElementById('custom-tour-builder');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs text-sand-300 hover:text-sand-400 font-bold tracking-wide flex items-center justify-center gap-1 w-full cursor-pointer"
                  >
                    Build your custom tour below
                    <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Diagonal cut design banner */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
      </section>

      {/* GRAND BAHAMA WATER & BEACH SHOWCASE SECTION */}
      <WaterShowcase onSelectPhotoAsBackdrop={setBackdropUrl} activeBackdropUrl={backdropUrl} />

      {/* ACTIVE RESERVATIONS PANEL (Conditional Console, displays only if customer has a live request) */}
      <AnimatePresence>
        {localBookings.length > 0 && (
          <section className="bg-ocean-50 border-y border-ocean-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold text-ocean-900 uppercase tracking-widest flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-ocean-700" />
                    My Active Freeport Reservations ({localBookings.length})
                  </h3>
                  <p className="text-xs text-ocean-600 mt-1">Simulated database. These are saved in your browser storage.</p>
                </div>
                
                <button
                  onClick={() => {
                    if (window.confirm('Clear all local saved trip metadata?')) {
                      localStorage.removeItem('first_class_bookings');
                      localStorage.removeItem('first_class_tours');
                      setLocalBookings([]);
                    }
                  }}
                  className="text-xs text-red-650 hover:text-red-800 underline font-medium cursor-pointer"
                >
                  Clear history
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localBookings.map((bk) => (
                  <div key={bk.id} className="bg-white border border-ocean-150 p-4 rounded-xl shadow-xs relative flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-0.5 bg-ocean-100 text-ocean-800 rounded-md font-mono font-bold text-[10px]">
                          Ref: {bk.id}
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded font-bold text-[9px] uppercase tracking-wider">
                          Harold Reviewing
                        </span>
                      </div>

                      <div className="space-y-1.5 py-1.5">
                        <p className="text-xs font-bold text-ocean-950">
                          {bk.serviceType === 'airport-transfer' ? 'Airport Transfer' : bk.serviceType === 'cruise-port' ? 'Cruise Port Pick-up' : 'Custom Sightseeing Tour'}
                        </p>
                        <p className="text-[11px] text-ocean-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-ocean-400" />
                          From: <strong className="font-semibold text-ocean-800 truncate max-w-[190px] inline-block mb-[-2px]">{bk.pickupLocation || 'Custom Route'}</strong>
                        </p>
                        <p className="text-[11px] text-ocean-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-ocean-400" />
                          To: <strong className="font-semibold text-ocean-800 truncate max-w-[190px] inline-block mb-[-2px]">{bk.dropoffLocation || 'Sightseeing Stops'}</strong>
                        </p>
                        <p className="text-[11px] text-ocean-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-ocean-400" />
                          Schedule: <span className="font-semibold text-ocean-800 font-mono">{bk.date}</span> at <span className="font-semibold text-ocean-800 font-mono">{bk.time || 'Tour Slot'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-ocean-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-ocean-900 font-mono">Cost: ${bk.estimatedCost || bk.estimatedCost === 0 ? bk.estimatedCost : 110} USD</span>
                      
                      <div className="flex space-x-2">
                        <a
                          href={`https://wa.me/12428172900?text=${encodeURIComponent(`Hello Harold! Verification ping regarding my trip ${bk.id} scheduled for ${bk.date}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                        >
                          Ping Status
                        </a>
                        <button
                          onClick={() => clearBooking(bk.id)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg text-[10px] font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* SERVICES BLOCK */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-ocean-700 tracking-widest uppercase block mb-3">Our Dedicated Portfolios</span>
            <h2 className="font-serif text-3xl md:text-4xl text-ocean-950 font-bold leading-tight mb-4">
              Premium Grand Bahama Transit Solutions
            </h2>
            <p className="text-sm md:text-base text-ocean-700/80 font-light">
              We specialize in localized comfort, ensuring you never travel with strangers or face hidden shuttle fees. Owned and operated by Harold Adderley.
            </p>
          </div>

          {/* Cards Grid of Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* SERVICE CARD 1 — Food Tour */}
            <div className="bg-white rounded-2xl p-6 md:p-8 card-luxury text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-800 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-ocean-950 mb-2.5">Grand Bahama Food Tour</h3>
                <p className="text-xs md:text-sm text-ocean-700 font-light leading-relaxed mb-6">
                  A guided culinary journey through Grand Bahama's best flavours — fresh conch demonstrations, Port Lucaya local eats, and authentic Bahamian street food led by Harold himself.
                </p>
              </div>
              <a href="#custom-tour-builder" className="text-xs font-bold text-ocean-800 hover:text-ocean-600 flex items-center gap-1.5 group">
                Plan your food tour <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* SERVICE CARD 2 — Beach Experience */}
            <div className="bg-white rounded-2xl p-6 md:p-8 card-luxury text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-800 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-ocean-950 mb-2.5">Beach Experience</h3>
                <p className="text-xs md:text-sm text-ocean-700 font-light leading-relaxed mb-6">
                  Private beach stops at Taino Beach, Gold Rock, and hidden coastal spots only locals know. Harold handles the transport, timing, and logistics — you just enjoy the water.
                </p>
              </div>
              <a href="#custom-tour-builder" className="text-xs font-bold text-ocean-800 hover:text-ocean-600 flex items-center gap-1.5 group">
                Choose your beach stops <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* SERVICE CARD 3 — Sightseeing Tour */}
            <div className="bg-white rounded-2xl p-6 md:p-8 card-luxury text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-800 flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ocean-950 mb-2.5">Sightseeing Tour</h3>
                <p className="text-xs md:text-sm text-ocean-700 font-light leading-relaxed mb-6">
                  Garden of the Groves, Port Lucaya Marketplace, the Heritage Trail, and more — a full island overview guided by someone who has lived it for decades.
                </p>
              </div>
              <a href="#custom-tour-builder" className="text-xs font-bold text-ocean-800 hover:text-ocean-600 flex items-center gap-1.5 group">
                Design your sightseeing route <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* SERVICE CARD 4 — Airport Transfers */}
            <div className="bg-white rounded-2xl p-6 md:p-8 card-luxury text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-800 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-ocean-950 mb-2.5">FPO Airport Transfers</h3>
                <p className="text-xs md:text-sm text-ocean-700 font-light leading-relaxed mb-6">
                  Direct transport from Freeport International Airport (FPO) to Pelican Bay, Viva Fortuna, or private West End estates. Flight tracking included.
                </p>
              </div>
              <a href="#interactive-planner" onClick={() => setServiceTypeAndScroll('airport-transfer')} className="text-xs font-bold text-ocean-800 hover:text-ocean-600 flex items-center gap-1.5 group">
                Schedule airport pickup <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* SERVICE CARD 5 — Cruise Port Pickups */}
            <div className="bg-white rounded-2xl p-6 md:p-8 card-luxury text-left flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-800 flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-ocean-950 mb-2.5">Cruise Port Pickups</h3>
                <p className="text-xs md:text-sm text-ocean-700 font-light leading-relaxed mb-6">
                  No queueing at the crowded cruise docks. Your driver waits at the gate with a signboard — ready for instant, beach-ready boarding the moment you step off.
                </p>
              </div>
              <a href="#interactive-planner" onClick={() => setServiceTypeAndScroll('cruise-port')} className="text-xs font-bold text-ocean-800 hover:text-ocean-600 flex items-center gap-1.5 group">
                Schedule port pickup <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* SERVICE CARD 6 - SPECIAL PROOF BLOCK */}
            <div className="bg-ocean-950 rounded-2xl p-6 md:p-8 text-left flex flex-col justify-between relative overflow-hidden border border-sand-400/40 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(233,196,106,0.15),transparent_60%)] pointer-events-none" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold text-sand-400 uppercase tracking-widest font-mono">Real-Time Support</span>
                <h3 className="font-serif text-xl font-bold text-white mb-2.5 mt-2">Need a custom charter?</h3>
                <p className="text-xs md:text-sm text-ocean-200 font-light leading-relaxed mb-6">
                  Have a customized itinerary, multiple days of transport requirements, or custom hotel coordinates? Shoot Harold a note on WhatsApp directly for instant rates.
                </p>
              </div>
              <a 
                href={getWhatsAppDirectLink()}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 text-xs font-bold text-sand-400 hover:text-sand-300 flex items-center gap-1.5 group"
              >
                Chat Direct with Harold <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* WHY FIRST CLASS / TRUST SEGMENT */}
      <section className="py-20 bg-ocean-50 border-y border-ocean-100" id="why-first-class">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Column / Showcase */}
            <div className="space-y-6">
              
              {/* Image featuring a beautiful SUV inside Freeport coastline representation */}
              <div className="relative rounded-2xl overflow-hidden border border-ocean-200 shadow-xl max-h-[360px]">
                <img
                  src="https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=1000"
                  alt="Spotless vehicle interiors matching First Class standard"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="inline-block px-2.5 py-1 bg-sand-400 text-ocean-950 font-bold text-[10px] uppercase rounded-md shadow">
                    Immaculate Fleet Verified
                  </span>
                  <span className="text-xs text-white backdrop-blur-xs bg-black/45 px-2 py-1 rounded">
                    Spotless clean after every guest
                  </span>
                </div>
              </div>

              {/* Verified Grid highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-ocean-150 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                    ✓
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-ocean-950 mb-1">On Time, Every Time</h4>
                  <p className="text-[11px] text-ocean-600 font-light leading-relaxed">
                    We plan flight buffers and monitor ports constantly so we are parked and ready before you step outside.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-ocean-150 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                    ✓
                  </div>
                  <h4 className="text-xs md:text-sm font-bold text-ocean-950 mb-1">Direct Communication</h4>
                  <p className="text-[11px] text-ocean-600 font-light leading-relaxed">
                    No offshore calling systems or dispatcher delays. Massage us and speak immediately with Harold.
                  </p>
                </div>
              </div>

            </div>

            {/* Explanation text column */}
            <div className="space-y-6 lg:pl-4 text-left">
              <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest block mb-2">Our Core Standards</span>
              <h2 className="font-serif text-3xl md:text-4xl text-ocean-950 font-bold leading-tight">
                No Corporate Shortcuts.<br />Just Real Bahamian Hospitality.
              </h2>
              <p className="text-sm md:text-base text-ocean-700 font-light leading-relaxed">
                First Class Tours is built around one thing: Harold Adderley knows Grand Bahama in a way no guidebook can match. He grew up here, knows where the real food is, knows which beaches don't show up on tourist maps, and shows up on time.
              </p>

              <div className="space-y-4 pt-4 border-t border-ocean-200">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sand-200 text-ocean-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-ocean-950">Real Local Knowledge</h4>
                    <p className="text-xs text-ocean-600 mt-0.5 font-light leading-normal">
                      Harold shares the authentic side of Grand Bahama — where locals actually eat, which beaches are worth it, and what's genuinely worth your time on the island.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-sand-200 text-ocean-900 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-ocean-950">Clean Vehicles, Direct Communication</h4>
                    <p className="text-xs text-ocean-600 mt-0.5 font-light leading-normal">
                      Air-conditioned, well-maintained vehicles and a direct line to Harold on WhatsApp — no middlemen, no dispatchers, no surprises.
                    </p>
                  </div>
                </div>
              </div>

              {/* Harold signature block */}
              <div className="pt-6 border-t border-ocean-150 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-ocean-100 border-2 border-sand-400 flex items-center justify-center">
                    <span className="text-ocean-800 font-bold text-lg font-serif">H</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ocean-950">Harold Adderley</h4>
                    <span className="text-[10px] uppercase font-bold text-ocean-500 tracking-wider">Owner & Guide, First Class Tours</span>
                  </div>
                </div>

                <div className="bg-white px-4 py-2 rounded-lg border border-ocean-150 text-right">
                  <span className="text-[8px] uppercase tracking-wider font-bold block text-ocean-500">Contact Harold</span>
                  <a href="tel:+12428172900" className="text-xs font-mono font-bold text-ocean-900">+1 (242) 817-2900</a>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* DETAILED INTERACTIVE SHUTTLE PLANNING BOARD (PORTALS TABS) */}
      <section className="py-20 bg-white" id="booking-area">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-ocean-700 tracking-widest uppercase block mb-3">Interactive Travel Hub</span>
            <h2 className="font-serif text-3xl md:text-4xl text-ocean-950 font-bold leading-tight mb-4">
              Reserve Your Premium Transport Instantly
            </h2>
            <p className="text-sm md:text-base text-ocean-700/85 font-light">
              Select your travel style below. Generate direct estimates, plan schedules, and lock in your priority Grand Bahama transfers under comfortable premium conditions.
            </p>
          </div>

          {/* Selector Tabs buttons */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-ocean-50 border border-ocean-100 rounded-xl space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('transfer')}
                className={`py-3 px-6 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'transfer'
                    ? 'bg-ocean-900 text-white shadow-md'
                    : 'text-ocean-750 hover:bg-ocean-100 hover:text-ocean-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                Airport & Cruise Transfers
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('tour')}
                className={`py-3 px-6 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'tour'
                    ? 'bg-ocean-900 text-white shadow-md'
                    : 'text-ocean-750 hover:bg-ocean-100 hover:text-ocean-900'
                }`}
              >
                <Compass className="w-4 h-4" />
                Private Sightseeing Tour Builder
              </button>
            </div>
          </div>

          {/* RENDER THE TABS */}
          <div className="relative z-10">
            {activeTab === 'transfer' ? (
              <BookingForm onSuccess={handleBookingSuccess} />
            ) : (
              <TourPlanner />
            )}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-ocean-50 border-t border-b border-ocean-100 relative">
        {/* Background wave line aesthetics representation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold text-ocean-705 uppercase tracking-widest block mb-2">Three Simple Steps</span>
            <h2 className="font-serif text-3xl md:text-4xl text-ocean-950 font-bold leading-tight">
              Seamless from Touchdown to Sunset
            </h2>
            <p className="text-xs md:text-sm text-ocean-650 mt-3 font-light">
              We coordinate behind the scenes so your family never waits outside Grand Bahama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-ocean-150 shadow-xs relative text-center">
              <div className="w-12 h-12 rounded-full gold-gradient text-ocean-950 font-bold flex items-center justify-center text-lg mx-auto mb-6 shadow">
                1
              </div>
              <h3 className="font-serif text-base md:text-lg font-bold text-ocean-950 mb-2">Submit Details Online</h3>
              <p className="text-xs text-ocean-700 font-light leading-relaxed">
                Use our Interactive Airport Form or Tour stops builder above. Let us know passengers, luggage, and dates. No immediate payment card holds required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-ocean-150 shadow-xs relative text-center">
              <div className="w-12 h-12 rounded-full gold-gradient text-ocean-950 font-bold flex items-center justify-center text-lg mx-auto mb-6 shadow">
                2
              </div>
              <h3 className="font-serif text-base md:text-lg font-bold text-ocean-950 mb-2">Instant Detail Match</h3>
              <p className="text-xs text-ocean-700 font-light leading-relaxed">
                Harold reviews coordinates and schedules. We lock in your vehicle slot and ping you on email or WhatsApp with easy meeting gates confirmation guides.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-ocean-150 shadow-xs relative text-center">
              <div className="w-12 h-12 rounded-full gold-gradient text-ocean-950 font-bold flex items-center justify-center text-lg mx-auto mb-6 shadow">
                3
              </div>
              <h3 className="font-serif text-base md:text-lg font-bold text-ocean-950 mb-2">Driver Meets You First-Class</h3>
              <p className="text-xs text-ocean-700 font-light leading-relaxed">
                Step outside FPO customs or the main cruise terminal. Greet your professional driver, grab your complimentary cold water, and sit back in cool luxury!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-ocean-700 tracking-widest uppercase block mb-3">Guest Reviews</span>
            <h2 className="font-serif text-3xl md:text-4xl text-ocean-950 font-bold leading-tight mb-4">
              See What Guests Are Saying
            </h2>
            <p className="text-sm text-ocean-700 font-light">
              Real reviews from real guests — find First Class Tours on Google and TripAdvisor.
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://www.google.com/maps/search/First+Class+Tours+Freeport+Bahamas"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-white border border-ocean-150 hover:border-ocean-300 rounded-2xl p-6 shadow-xs transition-all hover:-translate-y-0.5 group"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-bold text-ocean-900 group-hover:text-ocean-700">Reviews on Google</span>
            </a>

            <a
              href="https://www.tripadvisor.com/Search?q=First+Class+Tours+Freeport+Bahamas"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 bg-white border border-ocean-150 hover:border-ocean-300 rounded-2xl p-6 shadow-xs transition-all hover:-translate-y-0.5 group"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="#00AF87" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span className="text-sm font-bold text-ocean-900 group-hover:text-ocean-700">Reviews on TripAdvisor</span>
            </a>
          </div>

          <p className="text-xs text-ocean-500 mt-8 font-light">
            Visited recently? Harold would love to hear from you.
          </p>

        </div>
      </section>

      {/* COMPREHENSIVE FAQS SECTION */}
      <section className="py-20 bg-ocean-50 border-y border-ocean-100" id="faqs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-ocean-700 uppercase tracking-widest block mb-2">Transit Guidelines</span>
            <h2 className="font-serif text-3xl font-bold text-ocean-950">FAQS & Travel Policies</h2>
            <p className="text-xs md:text-sm text-ocean-600 mt-2">Everything you need to plan your airport or cruise ship day.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-ocean-150 rounded-xl overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between outline-none cursor-pointer hover:bg-ocean-50/20"
                  >
                    <span className="text-xs md:text-sm font-bold text-ocean-950 pr-4 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-ocean-400 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-ocean-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-ocean-100"
                      >
                        <div className="p-5 text-xs text-ocean-700 leading-relaxed font-light bg-ocean-50/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* BOOKING CTA SEGMENT */}
      <section className="relative py-24 bg-ocean-950 text-white text-center overflow-hidden">
        {/* Unsplash beautiful shoreline overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=2000"
            alt="Pristine Grand Bahama water backdrop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 scale-102"
          />
          <div className="absolute inset-0 bg-ocean-950/85" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="text-xs font-bold text-sand-400 uppercase tracking-widest font-mono">The Real Grand Bahama.</span>
          
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Ready to see Grand Bahama the right way?
          </h2>
          
          <p className="text-sm md:text-base text-ocean-200 font-light max-w-xl mx-auto leading-relaxed">
            Transfers, tours, and VIP transport — all in one place. No delays, no stress. Let Harold Adderley and his team show you what reliable luxury looks like.
          </p>

          <div className="pt-2">
            <a
              href="#interactive-planner"
              className="bg-sand-400 hover:bg-sand-500 text-ocean-950 font-black py-4 px-10 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-sand-400/20 text-sm cursor-pointer transition-all"
            >
              Book Now
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-ocean-300 font-mono">
            Direct Airport & Cruise Port transfers start from only $75 USD.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ocean-950 text-white border-t border-white/10 py-16 text-xs md:text-sm font-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            
            {/* Col 1 Brand */}
            <div className="md:col-span-4 space-y-4">
              <a href="#" className="flex items-center space-x-3 outline-none">
                <LogoBadge className="w-12 h-12" />
                <div className="flex flex-col text-left">
                  <span className="font-serif text-base font-bold text-white leading-tight">
                    First Class Tours
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-sand-400 uppercase block">
                    Freeport · Grand Bahama
                  </span>
                </div>
              </a>
              <p className="text-xs text-ocean-200 mt-2 font-light leading-relaxed">
                Pristine private transport, resort transfers, and custom day charters in Freeport, Bahamas. Owned and operated by Harold Adderley. Established 2014.
              </p>
              
              <div className="pt-2 flex items-center space-x-2 text-2xs text-emerald-400 font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Open Today · 24 Hours · Calls Welcome
              </div>
            </div>

            {/* Col 2 Areas of Service */}
            <div className="md:col-span-4 space-y-3 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Destinations & Hot Spots</h4>
              <ul className="space-y-2 text-xs text-ocean-250">
                <li>• Pelican Bay / Port Lucaya</li>
                <li>• Viva Wyndham Fortuna Beach Resort</li>
                <li>• Gold Rock Beach (Lucayan National Park)</li>
                <li>• West End Marina & Old Bahama Bay</li>
                <li>• Freeport Cruise Terminal (Gates Transfer)</li>
                <li>• Bahamas Heritage Trail (Downtown)</li>
              </ul>
            </div>

            {/* Col 3 Contact info */}
            <div className="md:col-span-4 space-y-3 text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Direct Communication</h4>
              <div className="space-y-3.5 text-xs text-ocean-200">
                <p>Feel free to contact Harold Adderley directly for urgent airport pickups, flight delays, custom quotes or specific group arrangements.</p>
                <div className="space-y-1">
                  <a href="tel:+12428172900" className="flex items-center gap-2 font-mono text-sand-400 text-xs font-bold hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-ocean-400" />
                    +1 (242) 817-2900 (WhatsApp)
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-2xs text-ocean-300 text-center gap-4">
            <div>
              <p>© 2026 First Class Tours & Transportation. All Rights Reserved. Freeport, Grand Bahama, Bahamas.</p>
              <p className="mt-1 text-ocean-400">Freeport, Grand Bahama, Bahamas.</p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#services" className="hover:text-white transition-colors">Our Services</a>
              <a href="#why-first-class" className="hover:text-white transition-colors">Private Charters</a>
              <a href="#booking-area" className="hover:text-white transition-colors">Direct Booker</a>
              <a href="#" className="hover:text-white transition-colors">Top of Page</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

// Helper to set interactive components service type and direct scroll beautifully
function setServiceTypeAndScroll(type: 'airport-transfer' | 'cruise-port') {
  const el = document.getElementById('interactive-planner');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    // Trigger selector click simulated
    const btn = el.querySelector(`button[type="button"]`) as HTMLElement;
    if (btn) btn.click();
  }
}
