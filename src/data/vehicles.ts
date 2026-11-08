import whiteCarCutoutImg from '../assets/behance/crops/white_car_cutout.png';
import roadsterCutoutImg from '../assets/behance/crops/roadster_cutout.png';
import interiorLeftImg from '../assets/behance/crops/interior_left.jpg';
import interiorRightImg from '../assets/behance/crops/interior_right.jpg';

import brandMercedesImg from '../assets/behance/crops/brand_mercedes.jpg';
import brandBentleyImg from '../assets/behance/crops/brand_bentley.jpg';
import brandJaguarImg from '../assets/behance/crops/brand_jaguar.jpg';
import brandAudiImg from '../assets/behance/crops/brand_audi.jpg';
import brandAstonImg from '../assets/behance/crops/brand_aston.jpg';
import brandBmwImg from '../assets/behance/crops/brand_bmw.jpg';
import brandLamborghiniImg from '../assets/behance/crops/brand_lamborghini.jpg';
import brandPorscheImg from '../assets/behance/crops/brand_porsche.jpg';

import car1MercedesImg from '../assets/behance/crops/car_1_mercedes.jpg';
import car2BentleyImg from '../assets/behance/crops/car_2_bentley.jpg';
import car3JaguarImg from '../assets/behance/crops/car_3_jaguar.jpg';
import car4AudiImg from '../assets/behance/crops/car_4_audi.jpg';
import car5AstonImg from '../assets/behance/crops/car_5_aston.jpg';
import car6BmwImg from '../assets/behance/crops/car_6_bmw.jpg';

import stayInTouchVideoImg from '../assets/behance/crops/stay_in_touch_video.jpg';

// Generated studio EV, Coupe, Sedan & Patrol SUV images
import evSedanImg from '../assets/images/car_model_s_plaid_1793977088490.jpg';
import evCoupeImg from '../assets/images/car_cyber_gt_coupe_1793977089392.jpg';
import patrolSuvWhiteImg from '../assets/images/car_performance_suv_1793977090818.jpg';
import interiorCockpitYokeImg from '../assets/images/interior_cockpit_yoke_1793977091458.jpg';

// Client Handover & Delivery Photography at Tse Addo High Street, Accra
import clientHandoverPatrolImg from '../assets/images/client_handover_patrol_1794069106123.jpg';
import clientHandoverEvImg from '../assets/images/client_handover_ev_1794069108183.jpg';
import clientHandoverHybridImg from '../assets/images/client_handover_hybrid_1794069109664.jpg';
import clientHandoverBentleyImg from '../assets/images/client_handover_bentley_1794069176819.jpg';

// Car Backside, Workplace Slideshow & Leadership Portraits
import carRearBacksideImg from '../assets/images/car_rear_backside_view_1794077652051.jpg';
import workplaceShowroomFloorImg from '../assets/images/workplace_showroom_floor_1794077654053.jpg';
import workplaceServiceLoungeImg from '../assets/images/workplace_service_lounge_1794077655477.jpg';
import leadershipCeoImg from '../assets/images/leadership_ceo_portrait_1794077654063.jpg';
import leadershipMdImg from '../assets/images/leadership_md_portrait_1794077676974.jpg';

// Retouched RY WHEELS Workplace Photos & Advert-Style Visuals
import ryWorkplaceNightRetouchedImg from '../assets/images/ry_workplace_night_retouched_1794081076603.jpg';
import ryWorkplaceVipCarpetRetouchedImg from '../assets/images/ry_workplace_vip_carpet_retouched_1794081078945.jpg';
import ryWorkplaceFleetLineupRetouchedImg from '../assets/images/ry_workplace_fleet_lineup_retouched_1794081081042.jpg';
import ryWorkplaceAdvertBillboardImg from '../assets/images/ry_workplace_advert_billboard_1794081084139.jpg';
import ryWorkplaceAdvertNightCampaignImg from '../assets/images/ry_workplace_advert_night_campaign_1794081086100.jpg';

export {
  whiteCarCutoutImg,
  roadsterCutoutImg,
  interiorLeftImg,
  interiorRightImg,
  stayInTouchVideoImg,
  evSedanImg,
  evCoupeImg,
  patrolSuvWhiteImg,
  interiorCockpitYokeImg,
  clientHandoverPatrolImg,
  clientHandoverEvImg,
  clientHandoverHybridImg,
  clientHandoverBentleyImg,
  carRearBacksideImg,
  workplaceShowroomFloorImg,
  workplaceServiceLoungeImg,
  leadershipCeoImg,
  leadershipMdImg,
  ryWorkplaceNightRetouchedImg,
  ryWorkplaceVipCarpetRetouchedImg,
  ryWorkplaceFleetLineupRetouchedImg,
  ryWorkplaceAdvertBillboardImg,
  ryWorkplaceAdvertNightCampaignImg,
};

export interface WorkplaceSlide {
  id: string;
  title: string;
  tag: string;
  caption: string;
  imageUrl: string;
}

export const WORKPLACE_SLIDES: WorkplaceSlide[] = [
  {
    id: 'wp-vip-carpet',
    title: 'RY WHEELS VIP RED CARPET SHOWCASE',
    tag: 'Tse Addo High Street · 0593207377',
    caption: 'Brand-new BYD EV SUVs displayed on our red carpet forecourt in Accra.',
    imageUrl: ryWorkplaceVipCarpetRetouchedImg,
  },
  {
    id: 'wp-advert-sunset',
    title: 'RY WHEELS GOLDEN HOUR ADVERT',
    tag: 'Official Showroom Campaign · Accra',
    caption: 'Executive EV & Hybrid fleet ready for immediate inspection and handover.',
    imageUrl: ryWorkplaceAdvertBillboardImg,
  },
  {
    id: 'wp-night-forecourt',
    title: 'RY WHEELS ILLUMINATED NIGHT FORECOURT',
    tag: 'Tse Addo High Street · 0593207377',
    caption: 'Evening view of our illuminated showroom canopy and white EV fleet lineup.',
    imageUrl: ryWorkplaceNightRetouchedImg,
  },
  {
    id: 'wp-daytime-lineup',
    title: 'RY WHEELS FULL EV FLEET LINEUP',
    tag: 'Tse Addo Showroom Courtyard',
    caption: 'Row of duty-paid 2026 electric and hybrid crossovers lined up at Tse Addo.',
    imageUrl: ryWorkplaceFleetLineupRetouchedImg,
  },
  {
    id: 'wp-advert-night',
    title: 'RY WHEELS NIGHT EDITION COMMERCIAL',
    tag: 'VIP Fleet Showcase · Accra',
    caption: 'Nighttime commercial showcase of our Tse Addo dealership headquarters.',
    imageUrl: ryWorkplaceAdvertNightCampaignImg,
  },
];

export interface ExecutiveLeader {
  id: string;
  name: string;
  role: string;
  note: string;
  imageUrl: string;
}

export const LEADERSHIP_TEAM: ExecutiveLeader[] = [
  {
    id: 'boss-ceo',
    name: 'R. Y. Mensah',
    role: 'Founder & Chief Executive Officer (CEO)',
    note: 'Leads RY WHEELS fleet curation and executive client partnerships in Ghana.',
    imageUrl: leadershipCeoImg,
  },
  {
    id: 'boss-md',
    name: 'Nana Ama Ofori',
    role: 'Co-Founder & Managing Director',
    note: 'Oversees Tema Port customs clearance, bank financing, and Tse Addo showroom operations.',
    imageUrl: leadershipMdImg,
  },
  {
    id: 'boss-ops',
    name: 'Engr. Kwesi Danquah',
    role: 'Head of EV & V8 Technical Operations',
    note: 'Directs vehicle inspection, 22kW home charger setup, and aftersales care.',
    imageUrl: workplaceServiceLoungeImg,
  },
];

export interface ClientGalleryPhoto {
  id: string;
  clientName: string;
  vehicleTitle: string;
  powertrain: 'EV' | 'Hybrid' | 'Patrol / Petrol';
  caption: string;
  imageUrl: string;
  locationTag: string;
  deliveredDate: string;
  visibility?: 'public' | 'hidden';
}

export interface ClientReviewRecord {
  id: string;
  authorId?: string;
  clientName: string;
  clientLocation: string;
  vehicleOwned: string;
  powertrain: 'EV' | 'Hybrid' | 'Patrol / Petrol';
  rating: number;
  comment: string;
  clientPhotoUrl: string;
  createdAtLabel: string;
  visibility?: 'public' | 'hidden';
}

export const INITIAL_GALLERY_PHOTOS: ClientGalleryPhoto[] = [
  {
    id: 'gal-patrol-accra',
    clientName: 'Nana Kwame Osei',
    vehicleTitle: '2026 Patrol V8 Platinum',
    powertrain: 'Patrol / Petrol',
    caption: 'Handover at Tse Addo High Street, Accra.',
    imageUrl: clientHandoverPatrolImg,
    locationTag: 'Tse Addo, Accra',
    deliveredDate: '2026',
    visibility: 'public',
  },
  {
    id: 'gal-ev-accra',
    clientName: 'Abena Boateng',
    vehicleTitle: '800V Electric GT Coupe',
    powertrain: 'EV',
    caption: 'Delivered with 22kW home charger in Cantonments.',
    imageUrl: clientHandoverEvImg,
    locationTag: 'Cantonments, Accra',
    deliveredDate: '2026',
    visibility: 'public',
  },
  {
    id: 'gal-hybrid-couple',
    clientName: 'Mr. & Mrs. Tetteh',
    vehicleTitle: 'Plug-In Hybrid Saloon',
    powertrain: 'Hybrid',
    caption: 'Key handover at Tse Addo Showroom.',
    imageUrl: clientHandoverHybridImg,
    locationTag: 'Tse Addo, Accra',
    deliveredDate: '2026',
    visibility: 'public',
  },
  {
    id: 'gal-bentley-chief',
    clientName: 'Alhaji Ibrahim Mensah',
    vehicleTitle: 'Grand Tourer Hybrid V8',
    powertrain: 'Hybrid',
    caption: 'Duty paid & delivered at Tse Addo.',
    imageUrl: clientHandoverBentleyImg,
    locationTag: 'Airport Residential',
    deliveredDate: '2026',
    visibility: 'public',
  },
];

export const INITIAL_CLIENT_REVIEWS: ClientReviewRecord[] = [
  {
    id: 'rev-1',
    clientName: 'Nana Kwame Osei',
    clientLocation: 'East Legon, Accra',
    vehicleOwned: 'PATROL V8 PLATINUM',
    powertrain: 'Patrol / Petrol',
    rating: 5,
    comment: 'Smooth pickup at Tse Addo with DVLA plates ready.',
    clientPhotoUrl: clientHandoverPatrolImg,
    createdAtLabel: 'Tse Addo',
    visibility: 'public',
  },
  {
    id: 'rev-2',
    clientName: 'Abena Boateng',
    clientLocation: 'Cantonments, Accra',
    vehicleOwned: 'PORSCHE TAYCAN EV',
    powertrain: 'EV',
    rating: 5,
    comment: 'Fast home charger setup in Cantonments and great service.',
    clientPhotoUrl: clientHandoverEvImg,
    createdAtLabel: 'Tse Addo',
    visibility: 'public',
  },
  {
    id: 'rev-3',
    clientName: 'Kofi & Ama Tetteh',
    clientLocation: 'Tse Addo, Accra',
    vehicleOwned: 'MERCEDES S580e HYBRID',
    powertrain: 'Hybrid',
    rating: 5,
    comment: 'Quiet electric drive in Accra traffic and effortless power.',
    clientPhotoUrl: clientHandoverHybridImg,
    createdAtLabel: 'Tse Addo',
    visibility: 'public',
  },
];

export type PowertrainCategory = 'all' | 'EV' | 'Hybrid' | 'Patrol / Petrol' | 'Packages';

export interface MenuCategoryPill {
  id: PowertrainCategory;
  name: string;
  subtitle: string;
  image: string;
  badgeCount: number;
}

export const MENU_CATEGORY_PILLS: MenuCategoryPill[] = [
  {
    id: 'all',
    name: 'All Vehicles',
    subtitle: 'EV · Hybrid · Patrol',
    image: whiteCarCutoutImg,
    badgeCount: 9,
  },
  {
    id: 'EV',
    name: 'EV Electric',
    subtitle: '800V Electric',
    image: evCoupeImg,
    badgeCount: 3,
  },
  {
    id: 'Hybrid',
    name: 'Hybrid Cars',
    subtitle: 'Plug-In V8 & V6',
    image: car2BentleyImg,
    badgeCount: 3,
  },
  {
    id: 'Patrol / Petrol',
    name: 'Patrol & Petrol',
    subtitle: 'V8 SUVs & Coupes',
    image: patrolSuvWhiteImg,
    badgeCount: 3,
  },
  {
    id: 'Packages',
    name: 'Executive Deals',
    subtitle: 'Duty-Paid Fleet',
    image: car1MercedesImg,
    badgeCount: 3,
  },
];

export interface ShowroomLocation {
  name: string;
  street: string;
  city: string;
  fullAddress: string;
  phone: string;
  email: string;
  hours: string;
  instagramHandle: string;
  instagramUrl: string;
  deliveryEta: string;
}

export const RY_SHOWROOM_LOCATION: ShowroomLocation = {
  name: 'RY WHEELS · Tse Addo',
  street: 'Tse Addo High Street',
  city: 'Tse Addo, Accra',
  fullAddress: 'Tse Addo High Street, Accra, Ghana',
  phone: '+233 59 320 7377',
  email: 'sales@rywheels.com.gh',
  hours: 'Mon – Sat · 8:30 AM – 6:30 PM',
  instagramHandle: '@ry_wheels',
  instagramUrl: 'https://www.instagram.com/ry_wheels',
  deliveryEta: 'Tse Addo Pickup or Accra Delivery',
};

export interface PromoSlide {
  id: string;
  badge: string;
  yearTag: string;
  title: string;
  subtitle: string;
  highlightPill: string;
  ctaLabel: string;
  filterTarget: PowertrainCategory;
  image: string;
  accentColor: string;
}

export const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-patrol-white',
    badge: '2026 ARRIVAL',
    yearTag: 'TSE ADDO, ACCRA',
    title: 'PATROL V8 PLATINUM',
    subtitle: '425 HP V8 · Duty Paid · From GH₵ 1,650,000',
    highlightPill: 'From GH₵ 1,650,000',
    ctaLabel: 'View Patrol & Petrol',
    filterTarget: 'Patrol / Petrol',
    image: patrolSuvWhiteImg,
    accentColor: '#111111',
  },
  {
    id: 'promo-ev-hyper',
    badge: '800V ELECTRIC',
    yearTag: 'TSE ADDO, ACCRA',
    title: 'ALL-ELECTRIC EV FLEET',
    subtitle: 'Up to 620 km Range · Free 22kW Home Charger',
    highlightPill: 'Up to 620 km Range',
    ctaLabel: 'Explore EV Electric',
    filterTarget: 'EV',
    image: evCoupeImg,
    accentColor: '#111111',
  },
  {
    id: 'promo-hybrid-gt',
    badge: 'PLUG-IN HYBRID',
    yearTag: 'TSE ADDO, ACCRA',
    title: 'EXECUTIVE HYBRID SERIES',
    subtitle: 'Silent City EV Mode + Twin-Turbo V8 Power',
    highlightPill: 'Dual Powertrain',
    ctaLabel: 'Explore Hybrids',
    filterTarget: 'Hybrid',
    image: interiorCockpitYokeImg,
    accentColor: '#111111',
  },
];

export interface ArcFeature {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  metric: string;
  actionType: 'showroom-ev' | 'showroom-hybrid' | 'showroom-all' | 'showroom-patrol' | 'open-garage';
  powertrainFilter: 'all' | 'EV' | 'Hybrid' | 'Patrol / Petrol';
  description: string;
}

export const RYWHEELS_ARC_FEATURES: ArcFeature[] = [
  {
    id: 'pure-ev',
    number: '01',
    title: 'EV ELECTRIC',
    shortTitle: '800V Electric →',
    metric: '620 km Range',
    actionType: 'showroom-ev',
    powertrainFilter: 'EV',
    description: 'All-electric vehicles with home charger included.',
  },
  {
    id: 'hybrid-synergy',
    number: '02',
    title: 'HYBRID CARS',
    shortTitle: 'Plug-In Hybrids →',
    metric: '771 HP Combined',
    actionType: 'showroom-hybrid',
    powertrainFilter: 'Hybrid',
    description: 'Electric city commuting plus V8 highway power.',
  },
  {
    id: 'enter-showroom',
    number: '03',
    title: 'SHOWROOM',
    shortTitle: 'All 9 Vehicles →',
    metric: 'Tse Addo, Accra',
    actionType: 'showroom-all',
    powertrainFilter: 'all',
    description: 'Browse all vehicles at Tse Addo High Street.',
  },
  {
    id: 'patrol-petrol',
    number: '04',
    title: 'PATROL & V8',
    shortTitle: 'V8 SUVs & Coupes →',
    metric: '5.6L V8 Petrol',
    actionType: 'showroom-patrol',
    powertrainFilter: 'Patrol / Petrol',
    description: 'Patrol V8 4x4 SUVs and luxury petrol coupes.',
  },
  {
    id: 'open-garage-bay',
    number: '05',
    title: 'GARAGE BAY',
    shortTitle: 'Parked Cars →',
    metric: 'Garage Stall',
    actionType: 'open-garage',
    powertrainFilter: 'all',
    description: 'View your parked vehicles and checkout.',
  },
];

export interface BrandItem {
  id: string;
  name: string;
  image: string;
  vehicleType: 'EV' | 'Hybrid' | 'Patrol / Petrol';
  specialty: string;
}

export const BRAND_ITEMS: BrandItem[] = [
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    image: brandMercedesImg,
    vehicleType: 'Hybrid',
    specialty: 'EQ & Hybrid',
  },
  {
    id: 'bentley',
    name: 'Bentley',
    image: brandBentleyImg,
    vehicleType: 'Hybrid',
    specialty: 'Hybrid V8',
  },
  {
    id: 'jaguar',
    name: 'Patrol & Jaguar',
    image: brandJaguarImg,
    vehicleType: 'Patrol / Petrol',
    specialty: 'Patrol V8 & Coupe',
  },
  {
    id: 'audi',
    name: 'Audi',
    image: brandAudiImg,
    vehicleType: 'EV',
    specialty: 'e-tron GT EV',
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin',
    image: brandAstonImg,
    vehicleType: 'Patrol / Petrol',
    specialty: 'V8 Super Tourer',
  },
  {
    id: 'bmw',
    name: 'BMW',
    image: brandBmwImg,
    vehicleType: 'Hybrid',
    specialty: 'M Hybrid V8',
  },
  {
    id: 'lamborghini',
    name: 'Lamborghini',
    image: brandLamborghiniImg,
    vehicleType: 'Hybrid',
    specialty: 'Hybrid V8',
  },
  {
    id: 'porsche',
    name: 'Porsche',
    image: brandPorscheImg,
    vehicleType: 'EV',
    specialty: 'Taycan EV',
  },
];

export interface CarTrimOption {
  id: string;
  label: string;
  sublabel: string;
  priceDelta: number;
}

export interface CarExtraOption {
  id: string;
  name: string;
  price: number;
  category: string;
}

export const DEALERSHIP_EXTRAS: CarExtraOption[] = [
  {
    id: 'extra-dvla-vip',
    name: 'Express DVLA Plate',
    price: 12000,
    category: 'Registration',
  },
  {
    id: 'extra-wall-charger',
    name: '22kW Home Wall Charger',
    price: 25000,
    category: 'EV / Hybrid',
  },
  {
    id: 'extra-ceramic-coat',
    name: '9H Ceramic Paint Shield',
    price: 18000,
    category: 'Protection',
  },
  {
    id: 'extra-vip-warranty',
    name: '5-Year Ghana Service Plan',
    price: 35000,
    category: 'Warranty',
  },
];

export interface CarPhotoAngle {
  label: string;
  url: string;
}

export interface ShowcaseCar {
  id: string;
  brandId: string;
  titleLine1: string;
  titleLine2: string;
  powertrain: 'EV' | 'Hybrid' | 'Patrol / Petrol';
  condition?: string;
  galleryImages?: CarPhotoAngle[];
  isPackage?: boolean;
  priceText: string;
  priceNumeric: number;
  typeText: string;
  engineText: string;
  fuelEconomyOrRange: string;
  thresholdOffer: string;
  image: string;
  tagCategory: ('popular' | 'featured' | 'latest')[];
  zeroToSixty: string;
  topSpeed: string;
  horsepower: string;
  transmission: string;
  description: string;
  trims: CarTrimOption[];
}

export const SHOWCASE_CARS: ShowcaseCar[] = [
  {
    id: 'nissan-patrol-v8-platinum',
    brandId: 'jaguar',
    titleLine1: 'PATROL V8 PLATINUM',
    titleLine2: 'PEARL WHITE 2026',
    powertrain: 'Patrol / Petrol',
    condition: 'Brand New (0 km) · Factory Sealed · Accident-Free',
    galleryImages: [
      { label: 'Front Exterior', url: patrolSuvWhiteImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Interior Cabin', url: interiorLeftImg },
      { label: 'Cockpit & Dash', url: interiorCockpitYokeImg },
    ],
    isPackage: true,
    priceText: 'GH₵ 1,650,000',
    priceNumeric: 1650000,
    typeText: 'Luxury 4x4 SUV',
    engineText: '5.6L V8 Petrol · 425 HP · Duty Paid',
    fuelEconomyOrRange: '4x4 Hydraulic Suspension',
    thresholdOffer: 'Tse Addo Showroom',
    image: patrolSuvWhiteImg,
    tagCategory: ['popular', 'latest', 'featured'],
    zeroToSixty: '5.6s',
    topSpeed: '225 km/h',
    horsepower: '425 hp',
    transmission: '9-Speed Auto 4WD',
    description: '7-seater V8 SUV with hydraulic suspension, duty paid.',
    trims: [
      { id: 'patrol-se', label: 'Platinum City V8', sublabel: '400 HP', priceDelta: 0 },
      { id: 'patrol-le', label: 'Platinum Reserve', sublabel: '425 HP', priceDelta: 120000 },
      { id: 'patrol-nismo', label: 'NISMO Edition', sublabel: '450 HP', priceDelta: 240000 },
    ],
  },
  {
    id: 'porsche-taycan-turbo-gt-ev',
    brandId: 'porsche',
    titleLine1: 'PORSCHE TAYCAN EV',
    titleLine2: 'TURBO S GT 2026',
    powertrain: 'EV',
    condition: 'Brand New (0 km) · 100% Battery Health · Duty Paid',
    galleryImages: [
      { label: 'Front Exterior', url: evCoupeImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Cockpit & Steering', url: interiorCockpitYokeImg },
      { label: 'Interior Cabin', url: interiorRightImg },
    ],
    isPackage: true,
    priceText: 'GH₵ 2,950,000',
    priceNumeric: 2950000,
    typeText: 'All-Electric GT',
    engineText: '800V Dual-Motor · 610 km Range',
    fuelEconomyOrRange: 'Free Home Charger Included',
    thresholdOffer: 'Free Accra Charger Setup',
    image: evCoupeImg,
    tagCategory: ['popular', 'featured', 'latest'],
    zeroToSixty: '2.1s',
    topSpeed: '305 km/h',
    horsepower: '938 hp',
    transmission: '2-Speed EV Drive',
    description: '800V electric sports GT with home charger included.',
    trims: [
      { id: 'taycan-4s', label: 'Taycan 4S', sublabel: '590 HP', priceDelta: 0 },
      { id: 'taycan-turbo-s', label: 'Turbo S Pack', sublabel: '938 HP', priceDelta: 195000 },
      { id: 'taycan-weissach', label: 'Turbo GT Spec', sublabel: '1,019 HP', priceDelta: 380000 },
    ],
  },
  {
    id: 'bentley-continental-gt-hybrid',
    brandId: 'bentley',
    titleLine1: 'BENTLEY CONTINENTAL',
    titleLine2: 'GT SPEED HYBRID',
    powertrain: 'Hybrid',
    condition: 'Brand New (0 km) · Mulliner Inspected · Duty Paid',
    galleryImages: [
      { label: 'Front Exterior', url: car2BentleyImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Interior Cabin', url: interiorLeftImg },
      { label: 'Cockpit & Dash', url: interiorRightImg },
    ],
    isPackage: true,
    priceText: 'GH₵ 4,100,000',
    priceNumeric: 4100000,
    typeText: 'Hybrid Grand Tourer',
    engineText: 'Twin-Turbo V8 Hybrid · 771 HP',
    fuelEconomyOrRange: '850 km Combined Range',
    thresholdOffer: 'Tse Addo Showroom',
    image: car2BentleyImg,
    tagCategory: ['popular', 'featured', 'latest'],
    zeroToSixty: '3.1s',
    topSpeed: '335 km/h',
    horsepower: '771 hp',
    transmission: '8-Speed AWD',
    description: 'Twin-turbo V8 plug-in hybrid grand tourer.',
    trims: [
      { id: 'bentley-azure', label: 'Azure Hybrid', sublabel: '680 HP', priceDelta: 0 },
      { id: 'bentley-speed', label: 'GT Speed Hybrid', sublabel: '771 HP', priceDelta: 260000 },
      { id: 'bentley-mulliner', label: 'Mulliner Bespoke', sublabel: '771 HP', priceDelta: 480000 },
    ],
  },
  {
    id: 'mercedes-s580e-hybrid-2025',
    brandId: 'mercedes-benz',
    titleLine1: 'MERCEDES-BENZ',
    titleLine2: 'S580e HYBRID',
    powertrain: 'Hybrid',
    condition: 'Foreign Used (Mint Grade A) · 3,400 km · Accident-Free',
    galleryImages: [
      { label: 'Front Exterior', url: car1MercedesImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Executive Cabin', url: interiorRightImg },
      { label: 'Cockpit & Dash', url: interiorCockpitYokeImg },
    ],
    priceText: 'GH₵ 1,920,000',
    priceNumeric: 1920000,
    typeText: 'Plug-In Hybrid Saloon',
    engineText: '510 HP Hybrid · 100 km EV Range',
    fuelEconomyOrRange: '100 km Electric Range',
    thresholdOffer: 'Bank Financing Available',
    image: car1MercedesImg,
    tagCategory: ['popular', 'latest', 'featured'],
    zeroToSixty: '4.4s',
    topSpeed: '250 km/h',
    horsepower: '510 hp',
    transmission: '9G-TRONIC Hybrid',
    description: 'Executive plug-in hybrid saloon with 100 km EV range.',
    trims: [
      { id: 's580e-luxury', label: 'Luxury Line', sublabel: '510 HP', priceDelta: 0 },
      { id: 's580e-amg', label: 'AMG Line', sublabel: '510 HP', priceDelta: 135000 },
      { id: 's580e-executive', label: 'Executive Suite', sublabel: 'Chauffeur Pack', priceDelta: 250000 },
    ],
  },
  {
    id: 'jaguar-f-type-white-petrol',
    brandId: 'jaguar',
    titleLine1: 'JAGUAR F-TYPE R',
    titleLine2: 'PETROL V8 COUPE',
    powertrain: 'Patrol / Petrol',
    condition: 'Foreign Used (Mint Grade A) · 4,800 km · Original Paint',
    galleryImages: [
      { label: 'Front Exterior', url: car3JaguarImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Interior Cabin', url: interiorLeftImg },
      { label: 'Cockpit & Dash', url: interiorRightImg },
    ],
    priceText: 'GH₵ 1,680,000',
    priceNumeric: 1680000,
    typeText: 'Petrol Sports Coupe',
    engineText: '5.0L Supercharged V8 · 575 HP',
    fuelEconomyOrRange: 'Torque-on-Demand AWD',
    thresholdOffer: 'Duty Paid',
    image: car3JaguarImg,
    tagCategory: ['popular', 'featured'],
    zeroToSixty: '3.5s',
    topSpeed: '299 km/h',
    horsepower: '575 hp',
    transmission: '8-Speed Quickshift',
    description: '575 HP supercharged V8 coupe with AWD.',
    trims: [
      { id: 'ftype-r-dynamic', label: 'R-Dynamic P450', sublabel: '444 HP', priceDelta: 0 },
      { id: 'ftype-r-75', label: 'F-Type R 75', sublabel: '575 HP', priceDelta: 165000 },
    ],
  },
  {
    id: 'lucid-plaid-ev-flagship',
    brandId: 'audi',
    titleLine1: 'RY APEX EV SEDAN',
    titleLine2: 'TRI-MOTOR 2026',
    powertrain: 'EV',
    condition: 'Brand New (0 km) · 100% Battery Health · Duty Paid',
    galleryImages: [
      { label: 'Front Exterior', url: evSedanImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Cockpit & Yoke', url: interiorCockpitYokeImg },
      { label: 'Interior Cabin', url: interiorLeftImg },
    ],
    priceText: 'GH₵ 1,780,000',
    priceNumeric: 1780000,
    typeText: 'All-Electric Saloon',
    engineText: 'Tri-Motor AWD · 830 km Range',
    fuelEconomyOrRange: 'Home Charger Included',
    thresholdOffer: 'Free Accra Charger Setup',
    image: evSedanImg,
    tagCategory: ['popular', 'latest', 'featured'],
    zeroToSixty: '1.99s',
    topSpeed: '320 km/h',
    horsepower: '1,050 hp',
    transmission: 'Direct EV Drive',
    description: 'Long-range electric saloon with 830 km range.',
    trims: [
      { id: 'apex-touring', label: 'Grand Touring', sublabel: '819 HP', priceDelta: 0 },
      { id: 'apex-sapphire', label: 'Tri-Motor Flagship', sublabel: '1,050 HP', priceDelta: 290000 },
    ],
  },
  {
    id: 'audi-r8-v10-ev-convertible',
    brandId: 'audi',
    titleLine1: 'AUDI E-TRON GT',
    titleLine2: 'QUATTRO ROADSTER',
    powertrain: 'EV',
    condition: 'Brand New (0 km) · Factory Warranty · Duty Paid',
    galleryImages: [
      { label: 'Front Exterior', url: car4AudiImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Interior Cabin', url: interiorRightImg },
      { label: 'Cockpit & Dash', url: interiorCockpitYokeImg },
    ],
    priceText: 'GH₵ 2,380,000',
    priceNumeric: 2380000,
    typeText: 'Electric Roadster',
    engineText: 'Dual-Motor e-quattro · 545 km Range',
    fuelEconomyOrRange: 'Adaptive Air Suspension',
    thresholdOffer: 'DVLA Registered',
    image: car4AudiImg,
    tagCategory: ['latest', 'featured'],
    zeroToSixty: '2.9s',
    topSpeed: '308 km/h',
    horsepower: '637 hp',
    transmission: '2-Speed e-quattro',
    description: 'All-electric quattro roadster with air suspension.',
    trims: [
      { id: 'audi-quattro', label: 'quattro Prestige', sublabel: '637 HP', priceDelta: 0 },
      { id: 'audi-rs-carbon', label: 'RS Carbon Spec', sublabel: '690 HP', priceDelta: 210000 },
    ],
  },
  {
    id: 'aston-martin-db12-petrol-v8',
    brandId: 'aston-martin',
    titleLine1: 'ASTON MARTIN DB12',
    titleLine2: 'V8 SUPER TOURER',
    powertrain: 'Patrol / Petrol',
    condition: 'Brand New (0 km) · Bespoke Spec · Duty Paid',
    galleryImages: [
      { label: 'Front Exterior', url: car5AstonImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Interior Cabin', url: interiorLeftImg },
      { label: 'Cockpit & Dash', url: interiorRightImg },
    ],
    priceText: 'GH₵ 3,650,000',
    priceNumeric: 3650000,
    typeText: 'Petrol Super Tourer',
    engineText: '4.0L Twin-Turbo V8 · 671 HP',
    fuelEconomyOrRange: 'Electronic Differential',
    thresholdOffer: '5-Yr Ghana Service',
    image: car5AstonImg,
    tagCategory: ['popular', 'featured'],
    zeroToSixty: '3.5s',
    topSpeed: '325 km/h',
    horsepower: '671 hp',
    transmission: '8-Speed Automatic',
    description: 'Hand-built twin-turbo V8 super tourer.',
    trims: [
      { id: 'db12-coupe', label: 'DB12 V8 Coupe', sublabel: '671 HP', priceDelta: 0 },
      { id: 'db12-volante', label: 'DB12 Q Spec', sublabel: '671 HP', priceDelta: 320000 },
    ],
  },
  {
    id: 'bmw-m8-hybrid-competition',
    brandId: 'bmw',
    titleLine1: 'BMW M HYBRID V8',
    titleLine2: 'GRAN COUPE',
    powertrain: 'Hybrid',
    condition: 'Foreign Used (Mint Grade A) · 2,900 km · Accident-Free',
    galleryImages: [
      { label: 'Front Exterior', url: car6BmwImg },
      { label: 'Backside / Rear', url: carRearBacksideImg },
      { label: 'Interior Cabin', url: interiorRightImg },
      { label: 'Cockpit & Dash', url: interiorCockpitYokeImg },
    ],
    priceText: 'GH₵ 2,080,000',
    priceNumeric: 2080000,
    typeText: 'M Plug-In Hybrid',
    engineText: '4.4L M V8 Hybrid · 738 HP',
    fuelEconomyOrRange: 'M xDrive AWD',
    thresholdOffer: 'DVLA Registered',
    image: car6BmwImg,
    tagCategory: ['latest', 'popular'],
    zeroToSixty: '3.0s',
    topSpeed: '305 km/h',
    horsepower: '738 hp',
    transmission: '8-Speed M Hybrid',
    description: '738 HP M V8 plug-in hybrid gran coupe.',
    trims: [
      { id: 'bmw-m-comp', label: 'M Competition', sublabel: '653 HP', priceDelta: 0 },
      { id: 'bmw-m-label', label: 'M Label Edition', sublabel: '738 HP', priceDelta: 265000 },
    ],
  },
];
