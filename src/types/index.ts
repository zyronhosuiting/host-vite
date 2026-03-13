export interface Listing {
  id: number;
  name: string;
  categories: string[];
  location: string;
  mapLocation: string;
  latitude: number;
  longitude: number;
  badge: string;
  subtitle: string;
  availableDates: string;
  listedDate: string;
  updatedDate: string;
  price: number;
  rating: number;
  reviews: number;
  photos: string[];
  coverIndex?: number;
  // Detail fields (merged from former ListingExtra)
  area: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  propertyType?: string;
  leaseTerm?: string;
  ownerPhone?: string;
  amenities: string[];
}

export interface Category {
  key: string;
  label: string;
  icon: string;
}

export interface Conversation {
  id: number;
  name: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  messages: Message[];
  listingId?: number;
}

export interface Message {
  from: 'me' | 'them';
  text: string;
  time: string;
  imageUrl?: string;
}

export interface FilterState {
  propertyType: Set<string>;   // apartment | studio | room | village | serviced
  minPrice: number;            // HKD/month, 0 = no min
  maxPrice: number;            // HKD/month, 0 = no max
  districts: Set<string>;      // HK 18 districts (Chinese names)
  bedrooms: number;            // Renamed from bedroomType, 0 = any, 1+ = min bedrooms
  bathrooms: number;           // 0 = any
  areaRange: string;           // '' | '200-400' | '400-600' | '600-800' | '800+'
  floorLevel: Set<string>;     // low | mid | high
  buildingAge: string;         // '' | '0-10' | '10-20' | '20-30' | '30+'
  mtrDistance: string;         // '' | '<5' | '5-10' | '10-15'
  moveIn: string;              // '' | 'immediate' | '1month' | '3months'
  leaseTerm: Set<string>;      // 12months | flexible | shortterm
  amenities: Set<string>;
  minPricePerSqft: number;     // HKD/sqft, 0 = no min
  maxPricePerSqft: number;     // HKD/sqft, 0 = no max
}

export interface RentalTransaction {
  date: string;
  district: string;
  building: string;
  categories: string[];
  unitType: string;
  area: number;
  monthlyRent: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  about: string;
  avatarUrl?: string;
}
