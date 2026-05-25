import React, { useState } from 'react';
import { TOUR_STOPS, VEHICLES, TourStop, Vehicle } from '../types';
import { Clock, MapPin, Compass, Check, Sparkles, MessageSquare, Plus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TourPlanner() {
  const [selectedStops, setSelectedStops] = useState<string[]>(['dorsette-conch', 'garden-groves', 'port-lucaya']);
  const [vehicleId, setVehicleId] = useState<string>('tour-van');
  const [tourName, setTourName] = useState('');
  const [tourEmail, setTourEmail] = useState('');
  const [tourPhone, setTourPhone] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingCode, setBookingCode] = useState('');

  const currentVehicle = VEHICLES.find(v => v.id === vehicleId) || VEHICLES[1];

  const toggleStop = (id: string) => {
    setSelectedStops(prev => {
      if (prev.includes(id)) {
        // Must keep at least 1 stop
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== id);
      }
      return [...prev, id];
    });
  };

  // Calculations
  const totalStopsDuration = TOUR_STOPS
    .filter(s => selectedStops.includes(s.id))
    .reduce((sum, s) => sum + s.duration, 0);

  // Add standard transit padding (0.5 hour per stop after the first)
  const travelTransitDuration = Math.max(0, (selectedStops.length - 1) * 0.4);
  const totalDuration = parseFloat((totalStopsDuration + travelTransitDuration + 1).toFixed(1)); // +1 hr baseline buffer

  const stopsAdmissionFees = TOUR_STOPS
    .filter(s => selectedStops.includes(s.id))
    .reduce((sum, s) => sum + s.costAddition, 0);

  // Cost = Hourly Rate * Duration + Admission Fees
  const calculatedCost = Math.round((currentVehicle.basePriceHourly * totalDuration) + (stopsAdmissionFees * 1));

  const handleBookTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName || !tourEmail || !tourPhone || !tourDate) {
      alert('Please fill out your name, contact info, and date to secure your tour.');
      return;
    }
    
    const code = `FC-TOUR-${Math.floor(2000 + Math.random() * 7999)}`;
    setBookingCode(code);
    setIsBooked(true);

    // Save to local tour bookings tracker
    const existing = JSON.parse(localStorage.getItem('first_class_tours') || '[]');
    const newTour = {
      id: code,
      clientName: tourName,
      clientEmail: tourEmail,
      clientPhone: tourPhone,
      date: tourDate,
      cost: calculatedCost,
      stops: selectedStops,
      duration: totalDuration,
      vehicle: currentVehicle.name,
    };
    localStorage.setItem('first_class_tours', JSON.stringify([newTour, ...existing]));
  };

  const getWhatsAppTourLink = () => {
    const stopsList = TOUR_STOPS
      .filter(s => selectedStops.includes(s.id))
      .map(s => `- ${s.name}`)
      .join('\n');

    const msg = `Hello Harold! I just customized our Grand Bahama Private Tour!
*Tour Ref*: ${bookingCode}
*Guest*: ${tourName}
*Date*: ${tourDate}
*Duration*: ~${totalDuration} Hours
*Vehicle Class*: ${currentVehicle.name}
*Stops Planned*:
${stopsList}
*Est Total Cost*: $${calculatedCost} USD

I would like to lock in this date with you! Cheers.`;

    return `https://wa.me/12428172900?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl border border-ocean-100 shadow-xl overflow-hidden flex flex-col lg:flex-row" id="custom-tour-builder">
      {/* Selection Left Col */}
      <div className="lg:w-7/12 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-ocean-100">
        <div className="flex items-center space-x-2 mb-2">
          <Compass className="text-sand-400 w-5 h-5" />
          <span className="text-xs font-bold text-ocean-700 tracking-wider uppercase">Interactive Spot Builder</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ocean-950 mb-3">
          Design Your Grand Bahama Sightseeing Course
        </h3>
        <p className="text-sm text-ocean-700/80 mb-6 font-light leading-relaxed">
          Select the local spots and beach sanctuaries you wish to explore. We handle every mile, park pass coordination, and comfort detail at your leisure.
        </p>

        {/* Categories / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TOUR_STOPS.map((stop) => {
            const isChecked = selectedStops.includes(stop.id);
            return (
              <div
                key={stop.id}
                onClick={() => toggleStop(stop.id)}
                className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                  isChecked
                    ? 'border-ocean-600 bg-ocean-50/20 ring-1 ring-ocean-500/20'
                    : 'border-ocean-100 hover:border-ocean-200 bg-white'
                }`}
              >
                {/* Images */}
                <div className="h-28 w-full relative">
                  <img
                    src={stop.image}
                    alt={stop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Selected check ring */}
                  <div className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isChecked ? 'gold-gradient text-ocean-950 shadow' : 'bg-black/30 text-white hover:bg-black/50'
                  }`}>
                    {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>

                  <div className="absolute bottom-2 left-3">
                    <span className="inline-block px-1.5 py-0.5 bg-white/10 text-white backdrop-blur-xs text-[9px] font-bold tracking-wider uppercase rounded">
                      {stop.category}
                    </span>
                  </div>
                </div>

                <div className="p-3.5">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-ocean-950 group-hover:text-ocean-700 leading-tight">
                      {stop.name}
                    </h4>
                    {stop.costAddition > 0 && (
                      <span className="text-[10px] font-semibold text-ocean-800 ml-1 flex-shrink-0">
                        +${stop.costAddition} tkt
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ocean-600 font-light line-clamp-2 leading-relaxed">
                    {stop.description}
                  </p>
                  <div className="flex items-center space-x-1 mt-2.5 text-[10px] font-bold text-ocean-800">
                    <Clock className="w-3 h-3 text-ocean-400" />
                    <span>Est {stop.duration} Hours stop</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary / Calculator Right Col */}
      <div className="lg:w-5/12 bg-ocean-50 p-6 md:p-8 flex flex-col justify-between">
        {!isBooked ? (
          <div className="space-y-6">
            <div>
              <h4 className="font-serif text-xl font-bold text-ocean-950 mb-4 border-b border-ocean-150 pb-3">
                Your Custom Tour Estimate
              </h4>

              {/* Total Summary Stats */}
              <div className="grid grid-cols-2 gap-3.5 mb-5">
                <div className="border border-ocean-150 p-3 rounded-xl bg-white shadow-xs">
                  <span className="text-[10px] text-ocean-500 font-bold block mb-0.5 uppercase tracking-wide">Course Duration</span>
                  <p className="text-lg font-bold text-ocean-950 font-mono">~{totalDuration} <span className="text-sm">Hrs</span></p>
                  <span className="text-[9px] text-ocean-400 block leading-tight">Includes scenic beach drives</span>
                </div>
                <div className="border border-ocean-150 p-3 rounded-xl bg-white shadow-xs">
                  <span className="text-[10px] text-ocean-500 font-bold block mb-0.5 uppercase tracking-wide">Selected Spots</span>
                  <p className="text-lg font-bold text-ocean-950 font-mono">{selectedStops.length} <span className="text-sm">Stops</span></p>
                  <span className="text-[9px] text-ocean-400 block leading-tight">Admissions handled by driver</span>
                </div>
              </div>

              {/* Vehicle selector */}
              <div className="space-y-2 mb-5">
                <label className="text-[10px] font-bold text-ocean-900 uppercase block tracking-wider">
                  Select Ride Class & Hourly Grade
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VEHICLES.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleId(v.id)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        v.id === vehicleId
                          ? 'border-ocean-800 bg-ocean-900 text-white'
                          : 'border-ocean-200 bg-white text-ocean-700 hover:border-ocean-300'
                      }`}
                    >
                      <span className="block text-[10px] font-light mb-0.5">
                        {v.type === 'suv' ? 'Executive SUV' : 'Tour Van'}
                      </span>
                      ${v.basePriceHourly}/hour
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-ocean-550 leading-relaxed font-light mt-1">
                  Hourly rates include private tour curation, full flexibility, and cold waters standard. 5 hours minimum for deep east island gold rock tours.
                </p>
              </div>

              {/* Live breakdown cost */}
              <div className="bg-white border border-ocean-100 p-4 rounded-xl space-y-2 mb-6">
                <div className="flex justify-between text-xs text-ocean-700 font-medium">
                  <span>{currentVehicle.name} ({totalDuration} hrs)</span>
                  <span className="font-mono">${currentVehicle.basePriceHourly * totalDuration}</span>
                </div>
                {stopsAdmissionFees > 0 && (
                  <div className="flex justify-between text-xs text-ocean-700 font-medium pt-1.5 border-t border-ocean-50">
                    <span>Est. Stop Tickets & Permits</span>
                    <span className="font-mono">${stopsAdmissionFees}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2.5 border-t border-ocean-150">
                  <span className="text-sm font-bold text-ocean-950">Grand Estimate</span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-black text-ocean-900 font-sans font-mono">${calculatedCost}</span>
                    <span className="text-[9px] font-bold text-ocean-500 font-mono ml-0.5">USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tour request form */}
            <form onSubmit={handleBookTour} className="space-y-3.5 border-t border-ocean-150 pt-5">
              <span className="text-[10px] font-bold text-ocean-900 uppercase block tracking-wider mb-1">
                Enter Details to Secure Cruise/Resort Day Choice
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Visitor Name"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  className="w-full bg-white focus:bg-white border border-ocean-200 outline-none rounded-lg p-2.5 text-xs font-semibold transition-all"
                />
                <input
                  type="date"
                  required
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  className="w-full bg-white focus:bg-white border border-ocean-200 outline-none rounded-lg p-2.5 text-xs font-semibold transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  required
                  placeholder="Email ID"
                  value={tourEmail}
                  onChange={(e) => setTourEmail(e.target.value)}
                  className="w-full bg-white border border-ocean-200 outline-none rounded-lg p-2.5 text-xs font-semibold transition-all"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Mobile"
                  value={tourPhone}
                  onChange={(e) => setTourPhone(e.target.value)}
                  className="w-full bg-white border border-ocean-200 outline-none rounded-lg p-2.5 text-xs font-semibold transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-sand-400 hover:bg-sand-500 text-ocean-950 font-bold py-3 px-4 rounded-xl text-xs md:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Send Custom Tour Itinerary
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6 text-center py-8">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-100">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-serif text-xl font-bold text-ocean-950">Itinerary Saved Successfully!</h4>
              <p className="text-xs text-ocean-600 mt-1">Your customizable Freeport tour itinerary has been processed.</p>
              
              <div className="mt-4 bg-white border border-ocean-200 p-3.5 rounded-xl inline-block">
                <span className="text-[9px] text-ocean-500 font-bold block uppercase tracking-wide mb-0.5">Private Itinerary Code</span>
                <span className="font-mono text-sm font-extrabold text-ocean-900 tracking-wider font-mono">{bookingCode}</span>
              </div>
            </div>

            <div className="bg-sand-200/50 p-4.5 rounded-xl border border-sand-300 text-left space-y-3.5">
              <p className="text-xs text-ocean-850 leading-relaxed font-light">
                Harold helps fine-tune custom charters. Take this specific reference code and click below to ping Harold Adderley direct on WhatsApp to verify vehicle availability!
              </p>
              
              <a
                href={getWhatsAppTourLink()}
                target="_blank"
                rel="noreferrer referrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Discuss stops with Harold
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsBooked(false);
                setTourName('');
              }}
              className="text-xs text-ocean-600 hover:text-ocean-800 underline block mx-auto font-medium transition-all"
            >
              Reset and design a different tour
            </button>
          </div>
        )}

        <div className="border-t border-ocean-150 pt-4 flex items-center justify-center space-x-2 text-xs text-ocean-600 font-light mt-4">
          <ShieldCheck className="w-4 h-4 text-ocean-700" />
          <span>No commitment required online. Pay after tour completion.</span>
        </div>
      </div>
    </div>
  );
}
