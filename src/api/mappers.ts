import type { Listing, ListingExtra, RentalTransaction, Conversation, Message } from '../types';

// ─── Backend response types ─────────────────────────────

export interface BackendListing {
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
  coverIndex: number | null;
  area: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  propertyType: string | null;
  leaseTerm: string | null;
  ownerPhone: string | null;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BackendConversation {
  id: number;
  userId: number;
  participantName: string;
  property: string;
  listingId: number | null;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    text: string;
    createdAt: string;
    senderId: number;
  } | null;
}

export interface BackendMessage {
  id: number;
  conversationId: number;
  senderId: number;
  text: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface BackendRentalTransaction {
  id: number;
  date: string;
  district: string;
  building: string;
  categories: string[];
  unitType: string;
  area: number;
  monthlyRent: number;
}

// ─── Mappers ────────────────────────────────────────────

/** Map backend listing → frontend Listing + ListingExtra */
export function mapListing(b: BackendListing): { listing: Listing; extra: ListingExtra } {
  const listing: Listing = {
    id: b.id,
    imgClass: '',                               // no longer used for real photos
    cats: b.categories.join(' ') || 'all',
    loc: b.location,
    mapLoc: b.mapLocation,
    lat: Number(b.latitude),
    lng: Number(b.longitude),
    badge: b.badge ?? '',
    badgeMod: '',                                // removed from backend
    name: b.name,
    sub: b.subtitle,
    dates: b.availableDates,
    listedDate: b.listedDate,
    updatedDate: b.updatedDate,
    price: b.price,
    rating: Number(b.rating),
    reviews: b.reviews,
    dots: b.photos?.length ?? 0,
    saved: false,                                // computed from favorites separately
    color: '#5c6bc0',                            // default, no longer from backend
    photos: b.photos ?? [],
    coverIndex: b.coverIndex ?? undefined,
  };

  const extra: ListingExtra = {
    area: b.area,
    beds: b.bedrooms,
    baths: b.bathrooms,
    desc: b.description ?? '',
    features: b.features ?? [],
    propertyType: b.propertyType ?? undefined,
    leaseTerm: b.leaseTerm ?? undefined,
    ownerPhone: b.ownerPhone ?? undefined,
    amenities: b.amenities ?? [],
  };

  return { listing, extra };
}

/** Map frontend Listing + ListingExtra → backend create/update DTO */
export function toBackendListing(l: Listing, e: ListingExtra): Partial<BackendListing> {
  return {
    name: l.name,
    categories: l.cats.split(' ').filter(Boolean),
    location: l.loc,
    mapLocation: l.mapLoc,
    latitude: l.lat,
    longitude: l.lng,
    badge: l.badge,
    subtitle: l.sub,
    availableDates: l.dates,
    listedDate: l.listedDate,
    updatedDate: l.updatedDate,
    price: l.price,
    rating: l.rating,
    reviews: l.reviews,
    photos: l.photos ?? [],
    coverIndex: l.coverIndex ?? null,
    area: e.area,
    bedrooms: e.beds,
    bathrooms: e.baths,
    description: e.desc,
    features: e.features,
    propertyType: e.propertyType ?? null,
    leaseTerm: e.leaseTerm ?? null,
    ownerPhone: e.ownerPhone ?? null,
    amenities: e.amenities ?? [],
  };
}

/** Map backend rental transaction → frontend RentalTransaction */
export function mapRentalTransaction(b: BackendRentalTransaction): RentalTransaction {
  return {
    date: b.date,
    district: b.district,
    building: b.building,
    cats: b.categories.join(' '),
    unitType: b.unitType,
    area: b.area,
    monthlyRent: b.monthlyRent,
  };
}

/** Format a date string for display (relative time) */
function relativeTime(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '剛才';
  if (mins < 60) return `${mins}分鐘前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}小時前`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return '昨天';
  return `${days}天前`;
}

/** Map backend conversation → frontend Conversation */
export function mapConversation(b: BackendConversation, currentUserId: number): Conversation {
  return {
    id: b.id,
    name: b.participantName,
    property: b.property,
    lastMessage: b.lastMessage?.text ?? '',
    time: b.lastMessage ? relativeTime(b.lastMessage.createdAt) : relativeTime(b.createdAt),
    unread: 0,
    avatar: b.avatar || '💬',
    messages: [],
    listingId: b.listingId ?? undefined,
  };
}

/** Map backend message → frontend Message */
export function mapMessage(b: BackendMessage, currentUserId: number): Message {
  return {
    from: b.senderId === currentUserId ? 'me' : 'them',
    text: b.text,
    time: new Date(b.createdAt).toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' }),
    imageUrl: b.imageUrl ?? undefined,
  };
}
