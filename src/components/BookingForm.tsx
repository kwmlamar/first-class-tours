import React, { useState } from 'react';
import { Calendar, Clock, Users, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Briefcase, MapPin, Plane, Ship, Hotel } from 'lucide-react';
import { VEHICLES, Vehicle, BookingRequest } from '../types';

interface BookingFormProps {
  onSuccess: (booking: BookingRequest) => void;
  initialService?: 'airport-transfer' | 'cruise-port';
}

const DESTINATIONS = [
  { id: 'fpo', name: 'Freeport International Airport (FPO)', type: 'airport', icon: Plane },
  { id: 'port', name: 'Freeport Cruise Port (Main Gates)', type: 'port', icon: Ship },
  { id: 'pelican', name: 'Pelican Bay Resort (Port Lucaya)', type: 'resort', icon: Hotel },
  { id: 'grand-lucayan', name: 'Grand Lucayan Resort', type: 'resort', icon: Hotel },
  { id: 'viva-wyndham', name: 'Viva Wyndham Fortuna Beach (All-Inclusive)', type: 'resort', icon: Hotel },
  { id: 'west-end', name: 'West End Marina & Condos (Old Bahama Bay)', type: 'resort', icon: Hotel },
  { id: 'taino', name: 'Taino Beach Resorts & Shacks', type: 'resort', icon: Hotel },
  { id: 'downtown', name: 'Downtown Freeport / Heritage district', type: 'resort', icon: MapPin },
];

export default function BookingForm({ onSuccess, initialService = 'airport-transfer' }: BookingFormProps) {
  const [service, setService] = useState<'airport-transfer' | 'cruise-port'>(initialService);
  const [pickup, setPickup] = useState(DESTINATIONS[0].name);
  const [dropoff, setDropoff] = useState(DESTINATIONS[2].name);
  const [customPickup, setCustomPickup] = useState('');
  const [customDropoff, setCustomDropoff] = useState('');
  
  const [useCustomPickup, setUseCustomPickup] = useState(false);
  const [useCustomDropoff, setUseCustomDropoff] = useState(false);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState(2);
  const [bags, setBags] = useState(2);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('luxury-suv');
  
  // Client Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  // UI Steps: 1: Route & Passengers, 2: Vehicle & Contact, 3: Completed
  const [step, setStep] = useState(1);
  const [bookingResult, setBookingResult] = useState<BookingRequest | null>(null);

  // Auto-set suggested vehicle based on passenger count
  React.useEffect(() => {
    if (passengers > 5 && selectedVehicle === 'luxury-suv') {
      setSelectedVehicle('tour-van');
    }
  }, [passengers, selectedVehicle]);

  // Adjust pickup options based on service selection
  React.useEffect(() => {
    if (service === 'cruise-port') {
      setPickup(DESTINATIONS[1].name); // Freeport Cruise Port
      setDropoff(DESTINATIONS[2].name); // Pelican Bay Resort
    } else {
      setPickup(DESTINATIONS[0].name); // Freeport Airport
      setDropoff(DESTINATIONS[2].name); // Pelican Bay Resort
    }
  }, [service]);

  const activePickup = useCustomPickup ? customPickup : pickup;
  const activeDropoff = useCustomDropoff ? customDropoff : dropoff;

  // Cost calculator
  const calculateEstimate = () => {
    const vehicle = VEHICLES.find(v => v.id === selectedVehicle) || VEHICLES[0];
    let cost = vehicle.basePriceAirport;

    // Apply passenger adjustment if they exceed baseline (e.g. > 3 passengers adds $10 per seat)
    if (passengers > 3) {
      cost += (passengers - 3) * 10;
    }

    // Remote location surcharges (e.g. West End is further away)
    if (activePickup.includes('West End') || activeDropoff.includes('West End')) {
      cost += 40; 
    }

    return cost;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!date || !time || !activePickup || !activeDropoff) {
        alert('Please fill in your pickup location, dropoff location, date, and preferred time.');
        return;
      }
      setStep(2);
    } else {
      if (!name || !email || !phone) {
        alert('Please fill in your name, email address, and phone number to complete.');
        return;
      }

      const generatedId = `FC-${Math.floor(1000 + Math.random() * 9000)}-GB`;
      const estimate = calculateEstimate();

      const newBooking: BookingRequest = {
        id: generatedId,
        serviceType: service,
        pickupLocation: activePickup,
        dropoffLocation: activeDropoff,
        date,
        time,
        passengers,
        baggageCount: bags,
        vehicleId: selectedVehicle,
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        specialRequests,
        status: 'pending',
        estimatedCost: estimate,
        createdAt: new Date().toISOString()
      };

      // Save locally to show status
      const existing = JSON.parse(localStorage.getItem('first_class_bookings') || '[]');
      localStorage.setItem('first_class_bookings', JSON.stringify([newBooking, ...existing]));

      setBookingResult(newBooking);
      setStep(3);
      onSuccess(newBooking);
    }
  };

  const totalEstimate = calculateEstimate();
  const currentVehicleObj = VEHICLES.find(v => v.id === selectedVehicle) || VEHICLES[0];

  const getWhatsAppLink = (booking: BookingRequest) => {
    const message = `Hello Harold! I just booked a luxury transfer on your website. 
*Booking Ref*: ${booking.id}
*Service*: ${booking.serviceType === 'airport-transfer' ? 'Airport Transfer' : 'Cruise Port Pick-Up'}
*Name*: ${booking.clientName}
*Date/Time*: ${booking.date} at ${booking.time}
*From*: ${booking.pickupLocation}
*To*: ${booking.dropoffLocation}
*Passengers*: ${booking.passengers} pax (${booking.baggageCount} bags)
*Vehicle*: ${booking.vehicleId === 'luxury-suv' ? 'Executive SUV' : 'Private Tour Van'}
*Est. Cost*: $${booking.estimatedCost} USD

Please confirm availability! Thank you.`;
    
    return `https://wa.me/12428172900?text=${encodeURIComponent(message)}`; // Simulated Harold Adderley Grand Bahama WhatsApp contact
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-ocean-100 flex flex-col md:flex-row max-w-5xl mx-auto" id="interactive-planner">
      
      {/* Visual / Pricing summary panel (Left Side) */}
      <div className="md:w-5/12 bg-ocean-950 text-white p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(18,116,147,0.35),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center px-3 py-1 bg-sand-400/20 text-sand-300 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 border border-sand-400/30">
            {service === 'airport-transfer' ? 'FPO Airport Express' : 'Cruise Port Priority Gateway'}
          </div>

          <h3 className="font-serif text-3xl md:text-4xl text-white font-medium mb-3 leading-tight leading-none leading-normal">
            Your Premium Transfer
          </h3>
          <p className="text-ocean-200 text-sm mb-6 font-light">
            Private, non-stop, and air-conditioned directly to your destination. Never wait in taxi lines.
          </p>

          <div className="space-y-4 border-t border-ocean-800/60 pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-ocean-300 font-medium">Pickup Point</span>
              <span className="text-white text-right max-w-[200px] font-medium truncate">{activePickup || 'Not selected'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ocean-300 font-medium">Destination</span>
              <span className="text-white text-right max-w-[200px] font-medium truncate">{activeDropoff || 'Not selected'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ocean-300 font-medium font-sans">Vehicle Class</span>
              <span className="text-sand-300 text-right font-medium">{currentVehicleObj.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ocean-300 font-medium">Passengers / Luggage</span>
              <span className="text-white text-right font-medium font-mono">{passengers} Pax / {bags} Bags</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 bg-ocean-900/60 p-5 rounded-xl border border-ocean-800/40">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-ocean-300 tracking-wider uppercase font-semibold mb-0.5">Estimated Rate</p>
              <div className="flex items-baseline">
                <span className="font-serif text-3xl md:text-4xl text-sand-400 font-bold font-serif font-sans font-mono">${totalEstimate}</span>
                <span className="text-sm font-light text-ocean-200 ml-1">USD</span>
              </div>
            </div>
            <div className="text-right text-xs text-ocean-300">
              <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md font-medium border border-emerald-500/20">
                All-Inclusive
              </span>
              <p className="mt-1 text-[10px] font-light">Price includes driver meet-and-greet</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-ocean-800/50 flex items-center space-x-2 text-xs text-ocean-200 font-light">
            <ShieldCheck className="text-sand-400 w-4 h-4 flex-shrink-0" />
            <span>Fully transparent rates. No hidden fuel surcharges.</span>
          </div>
        </div>
      </div>

      {/* Main interactive form card (Right Side) */}
      <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-between">
        
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Pick Service Tab */}
            <div className="flex space-x-2 p-1 bg-ocean-50 rounded-xl border border-ocean-100">
              <button
                type="button"
                onClick={() => setService('airport-transfer')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  service === 'airport-transfer'
                    ? 'bg-ocean-800 text-white shadow-md shadow-ocean-800/10'
                    : 'text-ocean-700 hover:bg-ocean-100/50 hover:text-ocean-900'
                }`}
              >
                <Plane className="w-4 h-4" />
                Airport Transfer
              </button>
              <button
                type="button"
                onClick={() => setService('cruise-port')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  service === 'cruise-port'
                    ? 'bg-ocean-800 text-white shadow-md shadow-ocean-800/10'
                    : 'text-ocean-700 hover:bg-ocean-100/50 hover:text-ocean-900'
                }`}
              >
                <Ship className="w-4 h-4" />
                Cruise Port Pick-Up
              </button>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs text-ocean-500">
              <span className="font-semibold text-ocean-800">1. Route & Travel Details</span>
              <span className="h-0.5 flex-1 mx-4 bg-ocean-100" />
              <span>2. Passenger & Contact Info</span>
            </div>

            {/* Locations Selector */}
            <div className="grid grid-cols-1 gap-5">
              {/* Pickup Area */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-ocean-900 tracking-wider uppercase block">
                    {service === 'airport-transfer' ? 'Pickup Location' : 'Port Meeting Point'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomPickup(!useCustomPickup)}
                    className="text-xs text-ocean-600 font-medium hover:text-ocean-800 underline"
                  >
                    {useCustomPickup ? 'Select from list' : 'Enter custom address'}
                  </button>
                </div>

                {useCustomPickup ? (
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Enter custom airport terminal, private villa or spot..."
                      value={customPickup}
                      onChange={(e) => setCustomPickup(e.target.value)}
                      className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium transition-all"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean-400 w-4 h-4" />
                    <select
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full bg-ocean-50/50 hover:bg-ocean-50/80 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 pl-10 pr-4 text-sm font-semibold transition-all appearance-none cursor-pointer"
                    >
                      {DESTINATIONS.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ocean-500">
                      ▼
                    </div>
                  </div>
                )}
              </div>

              {/* Dropoff Area */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-ocean-900 tracking-wider uppercase block">
                    Dropoff Destination
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomDropoff(!useCustomDropoff)}
                    className="text-xs text-ocean-600 font-medium hover:text-ocean-800 underline"
                  >
                    {useCustomDropoff ? 'Select from list' : 'Enter custom address'}
                  </button>
                </div>

                {useCustomDropoff ? (
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Enter custom beach, private estate, complex or dock..."
                      value={customDropoff}
                      onChange={(e) => setCustomDropoff(e.target.value)}
                      className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium transition-all"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ocean-400 w-4 h-4" />
                    <select
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="w-full bg-ocean-50/50 hover:bg-ocean-50/80 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 pl-10 pr-4 text-sm font-semibold transition-all appearance-none cursor-pointer"
                    >
                      {DESTINATIONS.filter(e => e.name !== pickup).map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ocean-500">
                      ▼
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dates / Passengers Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-ocean-900 tracking-wider uppercase block mb-1.5">
                  Travel Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 pl-9 pr-2 text-xs md:text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ocean-900 tracking-wider uppercase block mb-1.5">
                  Pick-up Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 pl-9 pr-2 text-xs md:text-sm font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Travel Size counters */}
            <div className="grid grid-cols-2 gap-4 bg-ocean-50/40 p-4 rounded-xl border border-ocean-100">
              <div>
                <label className="text-xs font-bold text-ocean-850 block mb-1">
                  Passengers
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-ocean-200 flex items-center justify-center font-bold text-ocean-800 hover:bg-ocean-150 text-sm"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-ocean-900 w-6 text-center">{passengers}</span>
                  <button
                    type="button"
                    onClick={() => setPassengers(Math.min(14, passengers + 1))}
                    className="w-8 h-8 rounded-full bg-white border border-ocean-200 flex items-center justify-center font-bold text-ocean-800 hover:bg-ocean-150 text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-ocean-500 mt-1 block">
                  {passengers <= 5 ? 'SUV or Van' : 'Tour Van required'}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-ocean-850 block mb-1">
                  Large Baggage Count
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setBags(Math.max(0, bags - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-ocean-200 flex items-center justify-center font-bold text-ocean-800 hover:bg-ocean-150 text-sm"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-ocean-900 w-6 text-center">{bags}</span>
                  <button
                    type="button"
                    onClick={() => setBags(Math.min(14, bags + 1))}
                    className="w-8 h-8 rounded-full bg-white border border-ocean-200 flex items-center justify-center font-bold text-ocean-800 hover:bg-ocean-150 text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-ocean-500 mt-1 block">Standard suitcases</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-ocean-850 hover:bg-ocean-900 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-ocean-900/10 flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
            >
              Configure Travel Vehicle
              <ArrowRight className="w-4 h-4 md:w-5 h-5" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs text-ocean-500">
              <span className="text-ocean-500">1. Route & Travel Details</span>
              <span className="h-0.5 flex-1 mx-4 bg-ocean-200" />
              <span className="font-semibold text-ocean-800">2. Passenger & Contact Info</span>
            </div>

            {/* Vehicle Selection Cards */}
            <div>
              <label className="text-xs font-bold text-ocean-900 tracking-wider uppercase block mb-3">
                Select Your Vehicle Class
              </label>
              
              <div className="space-y-3">
                {VEHICLES.map((v) => {
                  const isDisabled = passengers > 5 && v.id === 'luxury-suv';
                  const isSelected = selectedVehicle === v.id;
                  
                  return (
                    <div
                      key={v.id}
                      onClick={() => !isDisabled && setSelectedVehicle(v.id)}
                      className={`relative border-2 rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer ${
                        isDisabled
                          ? 'opacity-40 cursor-not-allowed bg-ocean-50 border-ocean-100'
                          : isSelected
                          ? 'border-sand-400 bg-ocean-50/40 shadow-sm'
                          : 'border-ocean-100 hover:border-ocean-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={v.image}
                          alt={v.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 object-cover rounded-md"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-ocean-900">{v.name}</h4>
                            {isDisabled && (
                              <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded border border-amber-500/20">
                                Size Limit Exceeded
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3 text-xs text-ocean-600 mt-1 font-medium">
                            <span className="flex items-center text-xs font-semibold gap-1">
                              <Users className="w-3.5 h-3.5 text-ocean-400" />
                              {v.capacity}
                            </span>
                            <span className="flex items-center text-xs font-semibold gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-ocean-400" />
                              {v.baggage}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col justify-center items-end">
                        <span className="text-xs text-ocean-500 font-medium">From</span>
                        <span className="text-base font-bold text-ocean-900 font-mono">${v.basePriceAirport}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {passengers > 5 && (
                <p className="text-xs text-amber-600 font-medium mt-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                  ⚠️ Parties of {passengers} passengers require our Private High-Roof Tour Van due to comfortable Grand Bahama safety limit guidelines.
                </p>
              )}
            </div>

            {/* Guest Contact Information */}
            <div className="space-y-4 pt-1 border-t border-ocean-100">
              <label className="text-xs font-bold text-ocean-900 tracking-wider uppercase block">
                Primary Passenger Information
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Guest Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 px-4 text-xs md:text-sm font-medium transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 px-4 text-xs md:text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp Phone Number (e.g., +1 555-0199)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 px-4 text-xs md:text-sm font-medium transition-all"
                  />
                  <span className="text-[10px] text-ocean-500 mt-1 block leading-tight">
                    For real-time flight changes, port status alerts, and coordination, Harold communicates directly over WhatsApp.
                  </span>
                </div>

                <div>
                  <textarea
                    placeholder="Flight Number / Cruise Ship Name, or special requests (e.g., child seat, grocery stop...)"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={2}
                    className="w-full bg-ocean-50/50 focus:bg-white border border-ocean-100 focus:border-ocean-600 outline-none rounded-xl py-3 px-4 text-xs md:text-sm font-medium transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Back & Submit buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 border border-ocean-200 hover:bg-ocean-50 text-ocean-800 font-medium py-3.5 px-4 rounded-xl transition-all text-xs md:text-sm"
              >
                Back to Details
              </button>
              
              <button
                type="submit"
                className="flex-1 bg-sand-400 hover:bg-sand-500 font-bold text-ocean-950 py-3.5 px-4 rounded-xl transition-all text-xs md:text-sm shadow-md shadow-sand-400/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Request First Class Transfer
                <CheckCircle2 className="w-4 h-4 ml-1" />
              </button>
            </div>
          </form>
        )}

        {step === 3 && bookingResult && (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border-4 border-emerald-100 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-serif text-2xl text-ocean-950 font-bold mb-1">Transfer Request Submitted!</h4>
              <p className="text-xs text-ocean-600 font-medium">Your Grand Bahama transfer request is saved safely.</p>
              <div className="mt-3 inline-block bg-ocean-50 border border-ocean-200 px-4 py-2 rounded-xl">
                <span className="text-[10px] text-ocean-500 tracking-wider uppercase font-bold block mb-0.5">Booking Reference Code</span>
                <span className="font-mono text-base font-extrabold text-ocean-900 tracking-widest">{bookingResult.id}</span>
              </div>
            </div>

            <div className="w-full bg-sand-200/45 p-5 rounded-2xl border border-sand-300 text-left space-y-3.5 max-w-md">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="text-ocean-700 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-extrabold text-ocean-950 tracking-wide uppercase">Next Steps: Harold Adderley</h5>
                  <p className="text-xs text-ocean-800 mt-1 leading-relaxed">
                    Harold matches every coordinate in real-time. To unlock direct priority scheduling and lock in your absolute peace of mind, send a pre-formatted message directly to Harold on WhatsApp in one click.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={getWhatsAppLink(bookingResult)}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/10 text-sm cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  Connect with Harold Now
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setName('');
                setSpecialRequests('');
                setStep(1);
              }}
              className="text-xs text-ocean-600 font-medium hover:text-ocean-800 underline active:scale-95 transition-all cursor-pointer"
            >
              Request another transfer or private hire
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
