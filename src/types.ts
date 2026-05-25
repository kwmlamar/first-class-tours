/**
 * TypeScript types and static data for First Class Tours & Transportation.
 */

export interface Vehicle {
  id: string;
  name: string;
  type: 'suv' | 'van';
  capacity: string;
  baggage: string;
  description: string;
  basePriceAirport: number; // Base price for transfers
  basePriceHourly: number; // Base price per hour for custom tours
  image: string;
  features: string[];
}

export interface TourStop {
  id: string;
  name: string;
  duration: number; // in hours
  costAddition: number; // custom local stop entrance fee if any
  description: string;
  image: string;
  category: 'nature' | 'shopping' | 'history' | 'dining';
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  text: string;
  avatar: string;
  source: 'TripAdvisor' | 'Google' | 'CruiseCritic';
}

export interface BookingRequest {
  id: string;
  serviceType: 'airport-transfer' | 'cruise-port' | 'private-tour' | 'custom-tour';
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  passengers: number;
  baggageCount: number;
  vehicleId: string;
  selectedStops?: string[]; // for custom tours
  tourDurationHours?: number; // for custom/private tours
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed';
  estimatedCost: number;
  createdAt: string;
}

// PREMIUM FLEET
export const VEHICLES: Vehicle[] = [
  {
    id: 'luxury-suv',
    name: 'Executive Suburban SUV',
    type: 'suv',
    capacity: '1 - 5 Passengers',
    baggage: 'Up to 5 Large Suitcases',
    description: 'Leather-trimmed captain seats, premium dual climate control, and unmatched luxury ride comfort. Ideal for couples, business travelers, and VIP cruise day-trippers.',
    basePriceAirport: 75,
    basePriceHourly: 90,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200', // Premium SUV on coastal road feel
    features: ['Plush Leather Seating', 'Dual Air Conditioning', 'Complimentary Bottled Water', 'Private Direct Route', 'Airport Curbside Priority']
  },
  {
    id: 'tour-van',
    name: 'Private High-Roof Tour Van',
    type: 'van',
    capacity: 'Up to 14 Passengers',
    baggage: 'Up to 14 Large Suitcases',
    description: 'Spacious high-roof design, supreme cold central A/C vents for every row, and tinted panoramic windows for viewing the Bahamas coastline.',
    basePriceAirport: 120,
    basePriceHourly: 110,
    image: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=1200', // Premium Clean Van
    features: ['Generous Headroom & Aisle Space', 'Individual A/C Vents', 'Bluetooth Premium Audio', 'Reclining Bench Seats', 'Easy Step-In / Group Access']
  }
];

// TOUR STOPS FOR ISLAND SIGHTSEEING
export const TOUR_STOPS: TourStop[] = [
  {
    id: 'dorsette-conch',
    name: 'Dorsette Conch Demonstration',
    duration: 1.0,
    costAddition: 0,
    description: 'Watch a live conch demonstration by a true Bahamian local — cracking, cleaning, and preparing fresh conch the traditional way. The most authentic food experience in Grand Bahama.',
    image: 'https://images.unsplash.com/photo-1522885140904-7b92dbb3e171?auto=format&fit=crop&q=80&w=800',
    category: 'dining'
  },
  {
    id: 'gold-rock',
    name: 'Gold Rock Beach & Lucayan Caves',
    duration: 3.5,
    costAddition: 12, // Park entrance fee
    description: 'Located in Lucayan National Park. Famous for its low tide pristine sandbar, movie-set backdrops (Pirates of the Caribbean), and spectacular pre-Columbian freshwater caves.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    category: 'nature'
  },
  {
    id: 'garden-groves',
    name: 'Garden of the Groves',
    duration: 2.0,
    costAddition: 18, // Botanical gardens ticket
    description: 'Freeport\'s lush 12-acre slice of paradise. Wander through winding paths, waterfalls, exotic birds, Bahamian crafts, and a historic hilltop chapel.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=800',
    category: 'nature'
  },
  {
    id: 'port-lucaya',
    name: 'Port Lucaya Marketplace',
    duration: 1.5,
    costAddition: 0,
    description: 'The vibrant heart of Freeport shopping and culture. Waterfront bars, open-air straw markets, authentic local dining (conch fritters), and island steel pan drums.',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800',
    category: 'shopping'
  },
  {
    id: 'beach-shack',
    name: 'Taino Beach & Local Seafood Shack',
    duration: 1.5,
    costAddition: 0,
    description: 'Watch fresh Bahamian Conch Salad made right in front of you. Dip your toes in Taino Beach shorelines with a cold local Kalik beer or fresh coconut water.',
    image: 'https://images.unsplash.com/photo-1522885140904-7b92dbb3e171?auto=format&fit=crop&q=80&w=800',
    category: 'dining'
  },
  {
    id: 'perfume-factory',
    name: 'The Fragrance Beach Factory',
    duration: 1.0,
    costAddition: 0,
    description: 'Set in a historic pastel-pink French-Bahamian mansion. Learn to blend your own customized fragrance and sample authentic Grand Bahama coconut perfumes.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    category: 'history'
  },
  {
    id: 'freeport-heritage',
    name: 'Downtown & Heritage Trail',
    duration: 1.5,
    costAddition: 0,
    description: 'A structured journey through the history of Freeport. See the original master-plan architecture, learn from Adderley family stories, and witness early island settler landmarks.',
    image: 'https://images.unsplash.com/photo-1473116763269-255ea7604bb6?auto=format&fit=crop&q=80&w=800',
    category: 'history'
  }
];

// INITIAL TESTIMONIALS (REAL GRAND BAHAMA REVIEWS COMPILATION)
export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Sarah & Michael Dunlap',
    location: 'Boston, Massachusetts',
    rating: 5,
    date: 'April 2026',
    text: 'Harold was incredible! Our cruise ship docked in Freeport for only 7 hours. He was standing right at the gate with a sign. He drove us to Gold Rock Beach, waited for us, and had us back at the port in luxury comfort with plenty of time to spare. Hands down the highlight of our Bahamas trip.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    source: 'CruiseCritic'
  },
  {
    id: 'rev-2',
    name: 'The Robertson Family Group (9 Pax)',
    location: 'Houston, Texas',
    rating: 5,
    date: 'May 2026',
    text: 'We booked the private high-roof van for a customizable 5-hour sightseeing island tour. Harold knew every secret spot, got us the best fresh conch salad on the beach, and shared the rich history of the Adderley family in Freeport. Standard of transport is immaculate, highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200',
    source: 'TripAdvisor'
  },
  {
    id: 'rev-3',
    name: 'Marcus Vance',
    location: 'Atlanta, Georgia (Frequent VIP Nest Guest)',
    rating: 5,
    date: 'March 2026',
    text: 'Traveling for VIP private resort events in Freeport can sometimes be stressful. First Class Tours makes it seamless. Available 24/7, high executive vehicle standard, always exactly on time. Harold is the ultimate gentleman. I wouldn\'t use anyone else in Grand Bahama.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    source: 'Google'
  }
];

// FAQs
export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    question: 'How do we meet our driver at the Freeport Cruise Port?',
    answer: 'For cruise day-trippers, Harold or our designated driver will be waiting just outside the main security gate with a bold "First Class Tours" board and your name. We monitor ship schedules in real-time, so we are synchronized with your specific docking times.'
  },
  {
    question: 'What if our flight to Freeport Airport (FPO) is delayed?',
    answer: 'No worries at all. We are open 24/7. We track all incoming flights to FPO. Even if your flight is delayed by hours, we guarantee your private SUV or Tour Van will be patiently waiting for you when you step out of customs.'
  },
  {
    question: 'How does payment work? Do you accept credit cards?',
    answer: 'Yes! We accept all major Credit Cards, digital cards, and cash. You can complete your deposit/booking outline through our real-time website booking pipeline, and finalize the payment safely with Harold directly upon arrival or at the end of your trip.'
  },
  {
    question: 'Can we completely customize our sightseeing tour itinerary?',
    answer: 'Absolutely. That is what makes us First Class. You can use our interactive Tour Builder here online to select stops, or you can simply chat with Harold upon boarding to adjust the stops. We adjust entirely to your mood, pace, and interests.'
  },
  {
    question: 'Is Harold Adderley actually our driver?',
    answer: 'Harold owns, operates, and personally drives the majority of our customers! In cases of multiple overlapping private shuttle block bookings, you will be driven by one of Harold\'s carefully vetted, certified Bahamian professional drivers who share the exact same First Class service standard.'
  }
];
