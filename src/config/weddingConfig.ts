import venueGardenImg from '../assets/venue-garden.jpg';
import gallery1Img from '../assets/gallery-1.jpg';
import gallery2Img from '../assets/gallery-2.jpg';
import gallery3Img from '../assets/gallery-3.jpg';

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  dressCode?: string;
  mapUrl?: string;
}

export interface DressCodeSwatch {
  name: string;
  hex: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  aspect: 'portrait' | 'landscape';
}

export interface WeddingConfig {
  coupleNames: {
    partner1: string;
    partner2: string;
    initials: string;
  };
  familyIntro: string;
  invitationLine: string;
  weddingDate: string; // ISO string for countdown
  displayDate: {
    dayOfWeek: string;
    dateText: string;
    timeText: string;
  };
  blessingQuote: {
    text: string;
    source: string;
  };
  theme: 'terracotta';
  venue: {
    name: string;
    addressLines: string[];
    dateTimeLabel: string;
    mapUrl: string;
    image: string;
  };
  events: WeddingEvent[];
  dressCode: {
    title: string;
    description: string;
    swatches: DressCodeSwatch[];
  };
  gallery: GalleryItem[];
  rsvp: {
    deadline: string;
    contactEmail: string;
    contactPhone: string;
    mealOptions: string[];
    /**
     * Optional webhook or backend endpoint (e.g. Supabase Edge Function, Formspree, custom API).
     * When empty, submissions are persisted locally in localStorage as a development fallback.
     */
    endpointUrl: string;
  };
  music: {
    title: string;
    /** Optional external MP3/OGG URL. If omitted, a gentle built-in piano synthesizer plays. */
    audioUrl?: string;
  };
  closingMessage: {
    headline: string;
    subtext: string;
  };
}

export const weddingConfig: WeddingConfig = {
  coupleNames: {
    partner1: 'Alicia',
    partner2: 'David',
    initials: 'A | D',
  },
  familyIntro: 'TOGETHER WITH THEIR FAMILIES',
  invitationLine: 'REQUEST THE PLEASURE OF YOUR COMPANY',
  weddingDate: '2027-05-21T16:00:00',
  displayDate: {
    dayOfWeek: 'Saturday',
    dateText: '21 May 2027',
    timeText: 'At 4:00 PM',
  },
  blessingQuote: {
    text: '“Two souls with but a single thought, two hearts that beat as one.”',
    source: 'CELEBRATING LOVE & FAMILY',
  },
  theme: 'terracotta',
  venue: {
    name: 'Villa Venezia',
    addressLines: [
      '1234 Cypress Grove Lane',
      'Grass Valley, California',
      'United States',
    ],
    dateTimeLabel: 'Saturday, 21 May 2027 · 4:00 PM',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Venezia+Grass+Valley+CA',
    image: venueGardenImg,
  },
  events: [
    {
      id: 'mehndi',
      name: 'Mehndi',
      date: 'Thursday, 19 May 2027',
      time: '6:00 PM',
      venue: 'The Courtyard Pavilion',
      description: 'An evening of henna artistry, acoustic melodies, and warm spiced tea under the lanterns.',
      dressCode: 'Warm Ochre, Peach & Champagne',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Venezia+Grass+Valley+CA',
    },
    {
      id: 'nikah',
      name: 'Nikah Ceremony',
      date: 'Friday, 20 May 2027',
      time: '4:30 PM',
      venue: 'Olive Grove Terrace',
      description: 'Sacred vows exchanged amidst sunlit olive trees, followed by rosewater refreshments.',
      dressCode: 'Ivory, Champagne & Antique Gold',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Venezia+Grass+Valley+CA',
    },
    {
      id: 'baraat',
      name: 'Baraat & Reception',
      date: 'Saturday, 21 May 2027',
      time: '5:30 PM',
      venue: 'Villa Venezia Gardens',
      description: 'Joyful procession, garden aperitifs, and candlelit dinner beneath the pergola.',
      dressCode: 'Terracotta, Dusty Rose & Formal',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Venezia+Grass+Valley+CA',
    },
    {
      id: 'walima',
      name: 'Walima Dinner',
      date: 'Sunday, 22 May 2027',
      time: '7:00 PM',
      venue: 'The Grand Conservatory',
      description: 'A heartfelt closing feast of gratitude, toasts, and celebration with loved ones.',
      dressCode: 'Soft Ivory & Earth Tones',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Venezia+Grass+Valley+CA',
    },
  ],
  dressCode: {
    title: 'Warm Editorial Palette',
    description:
      'We’d love to see you in warm, elegant tones inspired by terracotta, sunlit champagne, and soft ivory.',
    swatches: [
      { name: 'Deep Rust', hex: '#963C23' },
      { name: 'Terracotta', hex: '#B84F2B' },
      { name: 'Dusty Rose', hex: '#C98F86' },
      { name: 'Champagne', hex: '#D5C0A0' },
      { name: 'Warm Cream', hex: '#F6EBDD' },
    ],
  },
  gallery: [
    {
      id: 'courtyard-walk',
      src: gallery1Img,
      alt: 'Alicia and David walking hand in hand through a sunlit stone villa courtyard',
      caption: 'Golden hour at the stone courtyard',
      aspect: 'portrait',
    },
    {
      id: 'garden-bouquet',
      src: gallery2Img,
      alt: 'Alicia and David laughing together in the garden with a peach and rust floral bouquet',
      caption: 'Amongst the olive trees & garden roses',
      aspect: 'portrait',
    },
    {
      id: 'rings-stationery',
      src: gallery3Img,
      alt: 'Antique gold wedding bands resting on handmade cotton paper beside a terracotta wax seal',
      caption: 'Heirloom details & handwritten vows',
      aspect: 'portrait',
    },
    {
      id: 'reception-table',
      src: venueGardenImg,
      alt: 'Candlelit outdoor villa reception table with white roses and linen',
      caption: 'Where we will gather & dine together',
      aspect: 'landscape',
    },
  ],
  rsvp: {
    deadline: 'By May 1, 2027',
    contactEmail: 'wedding@aliciaanddavid.com',
    contactPhone: '(732) 555-0111',
    mealOptions: [
      'Herb-Crusted Sea Bass',
      'Slow-Braised Beef Short Rib',
      'Wild Mushroom Risotto (Vegetarian)',
      'Roasted Harvest Plate (Vegan)',
    ],
    endpointUrl: '',
  },
  music: {
    title: 'Serenade in F (Piano)',
  },
  closingMessage: {
    headline: 'WE CAN’T WAIT TO CELEBRATE WITH YOU',
    subtext: 'Your presence is the greatest gift we could ever ask for.',
  },
};
