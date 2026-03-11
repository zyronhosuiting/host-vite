export interface Listing {
  id: number;
  imgClass: string;
  cats: string;
  loc: string;
  mapLoc: string;
  lat: number;
  lng: number;
  badge: string;
  badgeMod: string;
  name: string;
  sub: string;
  dates: string;
  listedDate: string;
  updatedDate: string;
  price: number;
  rating: number;
  reviews: number;
  dots: number;
  saved: boolean;
  color: string;
  photos?: string[];
  coverIndex?: number;
}

export interface Category {
  key: string;
  label: string;
  icon: string;
}

export interface ListingExtra {
  area: number;
  beds: number;
  baths: number;
  desc: string;
  features: string[];
  propertyType?: string;
  leaseTerm?: string;
  ownerPhone?: string;
  amenities?: string[];
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
  bedroomType: number;         // 0 = any, 1+ = min bedrooms
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
  district: string;   // matches listing.loc substring for filtering
  building: string;
  cats: string;       // space-separated cat keys matching Listing.cats
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
  address: string;
  about: string;
}
