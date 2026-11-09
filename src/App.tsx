/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRight,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  MapPin,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Phone,
  SlidersHorizontal,
  Car,
  Camera,
} from 'lucide-react';
import {
  whiteCarCutoutImg,
  MENU_CATEGORY_PILLS,
  RY_SHOWROOM_LOCATION,
  PROMO_SLIDES,
  RYWHEELS_ARC_FEATURES,
  BRAND_ITEMS,
  SHOWCASE_CARS,
  DEALERSHIP_EXTRAS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_CLIENT_REVIEWS,
  PowertrainCategory,
  ShowcaseCar,
  ClientGalleryPhoto,
  ClientReviewRecord,
  PromoSlide,
  ShowroomLocation,
} from './data/vehicles';
import { ResilientImage } from './components/ResilientImage';
import { GallerySection } from './components/GallerySection';
import { NewsItemRecord } from './components/AdminControlSection';
import { WORKPLACE_SLIDES } from './data/vehicles';

const AdminPlatform = React.lazy(() =>
  import('./components/AdminPlatform').then((m) => ({ default: m.AdminPlatform }))
);

const RY_LOGO_TRANSPARENT = '/assets/aistudio/_Logo_e05207a4.png';

const formatGhs = (amount: number) => `GH₵ ${amount.toLocaleString()}`;

export interface CartItem {
  cartItemId: string;
  car: ShowcaseCar;
  selectedTrimId: string;
  selectedTrimLabel: string;
  selectedTrimDelta: number;
  selectedExtras: string[];
  extrasTotal: number;
  unitPrice: number;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  items: CartItem[];
  totalAmount: number;
  locationName: string;
  deliveryMode: 'pickup' | 'delivery';
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  createdAt: string;
  status: string;
}

const GHANA_NEWS_HIGHLIGHTS = [
  {
    id: 'news-1',
    tag: 'SHOWROOM',
    date: '2026',
    title: '2026 Patrol V8 & EV Fleet in Stock',
    summary: 'Now available for viewing at Tse Addo High Street, Accra.',
    actionLabel: 'Browse Showroom',
    targetCategory: 'all' as PowertrainCategory,
  },
  {
    id: 'news-2',
    tag: 'CHARGING',
    date: 'ACCRA',
    title: 'Free 22kW Home Charger Setup',
    summary: 'Included with every EV and Hybrid purchase in Accra.',
    actionLabel: 'Explore EV Fleet',
    targetCategory: 'EV' as PowertrainCategory,
  },
  {
    id: 'news-3',
    tag: 'FINANCING',
    date: 'GHANA',
    title: 'Flexible Ghana Bank Financing',
    summary: 'Cedi payment plans with 5-year service cover.',
    actionLabel: 'View Deals',
    targetCategory: 'Packages' as PowertrainCategory,
  },
];

/**
 * Custom Architectural Garage Stall Icon (Used in Header & Garage Bay)
 */
function GarageStallIcon({
  className = 'w-6 h-6',
  isOpen = false,
}: {
  className?: string;
  isOpen?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Architectural Garage Roof & Stall Pillars */}
      <path d="M2.5 11L14 3.5L25.5 11" />
      <path d="M4.5 10.5V23.5H23.5V10.5" />
      {/* Garage Overhead Header Beam */}
      <line x1="4.5" y1="13" x2="23.5" y2="13" />
      {isOpen ? (
        /* Car Front Silhouette Visible Inside Open Stall */
        <>
          <path d="M8.5 21.5V17.5L10.2 15.2H17.8L19.5 17.5V21.5" />
          <circle cx="10.8" cy="19" r="1" fill="currentColor" />
          <circle cx="17.2" cy="19" r="1" fill="currentColor" />
        </>
      ) : (
        /* Ribbed Garage Door Shutters */
        <>
          <line x1="7.5" y1="16" x2="20.5" y2="16" />
          <line x1="7.5" y1="19" x2="20.5" y2="19" />
          <line x1="11" y1="22" x2="17" y2="22" />
        </>
      )}
    </svg>
  );
}

/**
 * Clean Instagram Icon for @ry_wheels Social Link
 */
function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * Clean WhatsApp Icon for Direct Dealership Inquiries & Garage Dispatch
 */
function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
  );
}

/**
 * Normalizes any Ghana or international phone string (e.g. '0593207377' or '+233 59 320 7377')
 * into a clean wa.me number ('233593207377').
 */
function toWhatsAppDigits(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }
  if (digits.startsWith('233')) {
    return digits;
  }
  return digits || '233593207377';
}

export default function App() {
  // --- Multi-Page Navigation State ('welcome' | 'showroom' | 'gallery' | 'history' | 'admin') ---
  const [activePage, setActivePage] = useState<
    'welcome' | 'showroom' | 'gallery' | 'history' | 'admin'
  >('welcome');

  // --- Admin-Controlled Dynamic Store State (Persisted in LocalStorage + Cloud) ---
  const [carsList, setCarsList] = useState<ShowcaseCar[]>(() => {
    try {
      const saved = localStorage.getItem('ry_cms_cars_v3');
      return saved ? JSON.parse(saved) : SHOWCASE_CARS;
    } catch {
      return SHOWCASE_CARS;
    }
  });
  const [galleryPhotos, setGalleryPhotos] = useState<ClientGalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('ry_cms_gallery_v4');
      return saved ? JSON.parse(saved) : INITIAL_GALLERY_PHOTOS;
    } catch {
      return INITIAL_GALLERY_PHOTOS;
    }
  });
  const [clientReviews, setClientReviews] = useState<ClientReviewRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ry_cms_reviews_v2');
      return saved ? JSON.parse(saved) : INITIAL_CLIENT_REVIEWS;
    } catch {
      return INITIAL_CLIENT_REVIEWS;
    }
  });
  const [newsList, setNewsList] = useState<NewsItemRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ry_cms_news_v2');
      return saved ? JSON.parse(saved) : GHANA_NEWS_HIGHLIGHTS;
    } catch {
      return GHANA_NEWS_HIGHLIGHTS;
    }
  });
  const [promoSlides, setPromoSlides] = useState<PromoSlide[]>(() => {
    try {
      const saved = localStorage.getItem('ry_cms_slides_v4');
      return saved ? JSON.parse(saved) : PROMO_SLIDES;
    } catch {
      return PROMO_SLIDES;
    }
  });
  const [showroomInfo, setShowroomInfo] = useState<ShowroomLocation>(() => {
    try {
      const saved = localStorage.getItem('ry_cms_showroom_v3');
      return saved ? JSON.parse(saved) : RY_SHOWROOM_LOCATION;
    } catch {
      return RY_SHOWROOM_LOCATION;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ry_cms_cars_v3', JSON.stringify(carsList));
    } catch {
      // Ignore quota errors
    }
  }, [carsList]);

  useEffect(() => {
    try {
      localStorage.setItem('ry_cms_gallery_v4', JSON.stringify(galleryPhotos));
    } catch {
      // Ignore quota errors
    }
  }, [galleryPhotos]);

  useEffect(() => {
    try {
      localStorage.setItem('ry_cms_reviews_v2', JSON.stringify(clientReviews));
    } catch {
      // Ignore quota errors
    }
  }, [clientReviews]);

  useEffect(() => {
    try {
      localStorage.setItem('ry_cms_news_v2', JSON.stringify(newsList));
    } catch {
      // Ignore quota errors
    }
  }, [newsList]);

  useEffect(() => {
    try {
      localStorage.setItem('ry_cms_slides_v4', JSON.stringify(promoSlides));
    } catch {
      // Ignore quota errors
    }
  }, [promoSlides]);

  useEffect(() => {
    try {
      localStorage.setItem('ry_cms_showroom_v3', JSON.stringify(showroomInfo));
    } catch {
      // Ignore quota errors
    }
  }, [showroomInfo]);

  // --- Animated Garage Door (Cart) State ---
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [garageDoorPhase, setGarageDoorPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');

  // --- Single Showroom Location Modal & Delivery Mode State ---
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // --- Interactive Hero Car Motion State ---
  const [carDriveOffset, setCarDriveOffset] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const speedIntervalRef = useRef<number | null>(null);
  const sharedAudioCtxRef = useRef<AudioContext | null>(null);

  // --- Responsive Viewport Tracker (Mobile / Tablet / Desktop) ---
  const mainScrollRef = useRef<HTMLElement | null>(null);
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      const next = window.innerWidth >= 1024;
      setIsDesktopViewport((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Instant scroll reset on page switch (no laggy smooth-scroll delay across tabs)
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [activePage]);

  // Pre-warm key slideshow and showroom images during browser idle time for 0ms tab switches
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const urlsToWarm = [
        ...promoSlides.map((s) => s.image),
        ...SHOWCASE_CARS.slice(0, 6).map((c) => c.image),
        ...WORKPLACE_SLIDES.slice(0, 2).map((w) => w.imageUrl),
      ];
      urlsToWarm.forEach((url) => {
        if (url) {
          const img = new Image();
          img.decoding = 'async';
          img.src = url;
        }
      });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [promoSlides]);

  // --- Curved Speedometer / Cycle Arc State (01 - 05) ---
  const [activeArcIndex, setActiveArcIndex] = useState<number>(2);

  // --- Category & Brand Filtering State ---
  const [activeCategory, setActiveCategory] = useState<PowertrainCategory>('all');
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [activeCardTouchId, setActiveCardTouchId] = useState<string | null>(null);
  const [activePromoIndex, setActivePromoIndex] = useState(0);

  // --- Auto-advance the 2026 Flagship Arrival Slideshow ---
  useEffect(() => {
    if (activePage !== 'welcome') return;
    const timer = window.setInterval(() => {
      setActivePromoIndex((prev) => (prev + 1) % promoSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [promoSlides.length, activePage]);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- Vehicle Configurator / Detail Card Modal State ---
  const [exploredCar, setExploredCar] = useState<ShowcaseCar | null>(null);
  const [exploredCarPhotoIndex, setExploredCarPhotoIndex] = useState<number>(0);
  const [configTrimId, setConfigTrimId] = useState<string>('');
  const [configExtras, setConfigExtras] = useState<string[]>([]);
  const [carInquiryTopic, setCarInquiryTopic] = useState<string>('Check Availability & Price');
  const [carInquiryPhone, setCarInquiryPhone] = useState<string>('');

  // --- Garage Stall (Cart) & Direct WhatsApp Dispatch State (No Personal Account Needed) ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'financing' | 'bank' | 'viewing'>('viewing');
  const [orderSuccessCode, setOrderSuccessCode] = useState<string | null>(null);

  // --- Admin Inquiry / Reservation Log State ---
  const [orderHistory, setOrderHistory] = useState<OrderRecord[]>([
    {
      id: 'RY-GH-8841',
      items: [
        {
          cartItemId: 'hist-1',
          car: SHOWCASE_CARS[0],
          selectedTrimId: SHOWCASE_CARS[0].trims[1].id,
          selectedTrimLabel: SHOWCASE_CARS[0].trims[1].label,
          selectedTrimDelta: SHOWCASE_CARS[0].trims[1].priceDelta,
          selectedExtras: [],
          extrasTotal: 0,
          unitPrice: SHOWCASE_CARS[0].priceNumeric + SHOWCASE_CARS[0].trims[1].priceDelta,
          quantity: 1,
        },
      ],
      totalAmount: SHOWCASE_CARS[0].priceNumeric + SHOWCASE_CARS[0].trims[1].priceDelta,
      locationName: RY_SHOWROOM_LOCATION.fullAddress,
      deliveryMode: 'pickup',
      buyerName: 'Kwame Mensah',
      buyerEmail: 'WhatsApp Inquiry',
      buyerPhone: '+233 59 320 7377',
      createdAt: 'DVLA Registered & Customs Cleared',
      status: 'Sent via WhatsApp · Tse Addo',
    },
  ]);

  // --- Navigation Menu Modal ---
  const [activeNavModal, setActiveNavModal] = useState<'menu' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // --- Add Client Review (Gallery Section) ---
  const handleAddClientReview = (
    newReview: Omit<ClientReviewRecord, 'id' | 'createdAtLabel'>
  ) => {
    const revId = `rev-${Date.now()}`;
    const localRecord: ClientReviewRecord = {
      ...newReview,
      id: revId,
      createdAtLabel: 'Just shared · Tse Addo Gallery',
    };
    setClientReviews((prev) => [localRecord, ...prev]);
    playLaunchSound();
    showToast(`Thank you, ${newReview.clientName}! Your review is live.`);
  };

  // --- Admin Control Handlers ---
  const handleAdminAddCar = (newCar: ShowcaseCar) => {
    setCarsList((prev) => [newCar, ...prev]);
    showToast(`Added ${newCar.titleLine1} to Showroom`);
  };

  const handleAdminUpdateCar = (carId: string, updated: Partial<ShowcaseCar>) => {
    setCarsList((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, ...updated } : c))
    );
  };

  const handleAdminUpdateCarPrice = (carId: string, newPriceNumeric: number) => {
    setCarsList((prev) =>
      prev.map((c) =>
        c.id === carId
          ? {
              ...c,
              priceNumeric: newPriceNumeric,
              priceText: `GH₵ ${newPriceNumeric.toLocaleString()}`,
            }
          : c
      )
    );
    showToast(`Updated price to GH₵ ${newPriceNumeric.toLocaleString()}`);
  };

  const handleAdminDeleteCar = (carId: string) => {
    setCarsList((prev) => prev.filter((c) => c.id !== carId));
    showToast('Vehicle removed from Showroom');
  };

  const handleAdminResetCars = () => {
    setCarsList(SHOWCASE_CARS);
    localStorage.removeItem('ry_cms_cars_v3');
    showToast('Showroom fleet restored to default');
  };

  const handleAdminAddGalleryPhoto = (photo: Omit<ClientGalleryPhoto, 'id'>) => {
    const galId = `gal-${Date.now()}`;
    const created: ClientGalleryPhoto = { ...photo, id: galId };
    setGalleryPhotos((prev) => [created, ...prev]);
    showToast(`Added ${photo.clientName} to Client Gallery`);
  };

  const handleAdminUpdateGalleryPhoto = (
    id: string,
    updated: Partial<ClientGalleryPhoto>
  ) => {
    setGalleryPhotos((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
  };

  const handleAdminDeleteGalleryPhoto = (id: string) => {
    setGalleryPhotos((prev) => prev.filter((g) => g.id !== id));
    showToast('Gallery photo removed');
  };

  const handleAdminToggleReviewVisibility = (id: string) => {
    setClientReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, visibility: r.visibility === 'hidden' ? 'public' : 'hidden' }
          : r
      )
    );
    showToast('Updated review visibility');
  };

  const handleAdminDeleteReview = (id: string) => {
    setClientReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Client review removed');
  };

  const handleAdminAddNews = (news: Omit<NewsItemRecord, 'id'>) => {
    const newItem: NewsItemRecord = { ...news, id: `news-${Date.now()}` };
    setNewsList((prev) => [newItem, ...prev]);
    showToast('Published news update to Welcome & News');
  };

  const handleAdminDeleteNews = (id: string) => {
    setNewsList((prev) => prev.filter((n) => n.id !== id));
    showToast('News card removed');
  };

  const handleAdminUpdatePromoSlide = (
    slideId: string,
    title: string,
    highlightPill: string,
    image?: string
  ) => {
    setPromoSlides((prev) =>
      prev.map((s) =>
        s.id === slideId
          ? { ...s, title, highlightPill, ...(image ? { image } : {}) }
          : s
      )
    );
  };

  const handleAdminUpdateReservationStatus = (orderId: string, newStatus: string) => {
    setOrderHistory((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} status updated`);
  };

  const handleAdminDeleteReservation = (orderId: string) => {
    setOrderHistory((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} removed`);
  };

  const handleAdminUpdateShowroomInfo = (updated: ShowroomLocation) => {
    setShowroomInfo(updated);
    showToast('Showroom address & contact info updated');
  };

  const getSharedAudioContext = (): AudioContext | null => {
    try {
      if (!sharedAudioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return null;
        sharedAudioCtxRef.current = new AudioCtx();
      }
      if (sharedAudioCtxRef.current.state === 'suspended') {
        sharedAudioCtxRef.current.resume().catch(() => {});
      }
      return sharedAudioCtxRef.current;
    } catch {
      return null;
    }
  };

  // --- Web Audio Synthesizer for Vehicle Acceleration Sound ---
  const playLaunchSound = () => {
    try {
      const ctx = getSharedAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.055, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.82);
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  };

  // --- Web Audio Synthesizer for Motorized Garage Door Roll-Up / Roll-Down ---
  const playGarageDoorSound = (direction: 'open' | 'close') => {
    try {
      const ctx = getSharedAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      if (direction === 'open') {
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.linearRampToValueAtTime(115, now + 0.45);
        osc.frequency.setValueAtTime(140, now + 0.5);
      } else {
        osc.frequency.setValueAtTime(115, now);
        osc.frequency.linearRampToValueAtTime(58, now + 0.45);
      }
      gain.gain.setValueAtTime(0.008, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.58);
    } catch {
      // Ignore audio errors
    }
  };

  // --- Open Garage Door (Opens and leaves completely so it never covers space) ---
  const handleOpenGarage = () => {
    setIsGarageOpen(true);
    setGarageDoorPhase('opening');
    playGarageDoorSound('open');
    window.setTimeout(() => {
      setGarageDoorPhase('open');
    }, 450);
  };

  // --- Close Garage Door ---
  const handleCloseGarage = () => {
    setIsGarageOpen(false);
    setGarageDoorPhase('closed');
  };

  // --- Navigate to Dedicated Showroom Page ---
  const enterShowroom = (category?: PowertrainCategory, brandId?: string | null) => {
    if (category) setActiveCategory(category);
    if (brandId !== undefined) setSelectedBrandId(brandId);
    setActivePage('showroom');
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  // --- Triggered when user touches or clicks the Hero Car ---
  const handleTouchOrClickHeroCar = () => {
    setIsLaunching(true);
    playLaunchSound();

    setActiveArcIndex((prev) => (prev + 1) % RYWHEELS_ARC_FEATURES.length);
    setCarDriveOffset((prev) => (prev === 0 ? 52 : prev > 0 ? -34 : 0));

    if (speedIntervalRef.current) window.clearInterval(speedIntervalRef.current);

    window.setTimeout(() => {
      setIsLaunching(false);
      setCarDriveOffset(0);
    }, 750);
  };

  // --- Open Vehicle Detail Card & Configurator Modal ---
  const openCarConfigurator = (car: ShowcaseCar) => {
    setExploredCar(car);
    setExploredCarPhotoIndex(0);
    setConfigTrimId(car.trims[0]?.id || '');
    setConfigExtras([]);
    setOrderSuccessCode(null);
  };

  // --- Park Vehicle in Garage (Add to Cart) ---
  const addCarToGarage = (
    car: ShowcaseCar,
    trimId?: string,
    extraIds: string[] = [],
    openDoorImmediately = false
  ) => {
    const chosenTrim =
      car.trims.find((t) => t.id === trimId) || car.trims[0] || {
        id: 'std',
        label: 'Standard Spec',
        sublabel: '',
        priceDelta: 0,
      };
    const extrasSum = extraIds.reduce((sum, eid) => {
      const found = DEALERSHIP_EXTRAS.find((x) => x.id === eid);
      return sum + (found ? found.price : 0);
    }, 0);
    const unitPrice = car.priceNumeric + chosenTrim.priceDelta + extrasSum;
    const key = `${car.id}__${chosenTrim.id}__${extraIds.slice().sort().join(',')}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.cartItemId === key);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === key ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          cartItemId: key,
          car,
          selectedTrimId: chosenTrim.id,
          selectedTrimLabel: chosenTrim.label,
          selectedTrimDelta: chosenTrim.priceDelta,
          selectedExtras: extraIds,
          extrasTotal: extrasSum,
          unitPrice,
          quantity: 1,
        },
      ];
    });

    playLaunchSound();
    showToast(`Parked ${car.titleLine1} in your Garage`);
    if (openDoorImmediately) {
      handleOpenGarage();
    }
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearGarage = () => {
    setCartItems([]);
    showToast('All Garage Stalls Cleared');
  };

  // --- Garage Totals ---
  const cartSubTotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [cartItems]
  );
  const deliveryFee = cartItems.length > 0 ? (deliveryMode === 'delivery' ? 3500 : 0) : 0;
  const cartGrandTotal = cartSubTotal + deliveryFee;
  const totalCartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  // --- Filtered Vehicles for Showroom ---
  const displayedCars = useMemo(() => {
    let list = [...carsList];

    if (activeCategory === 'Packages') {
      list = list.filter((car) => car.isPackage);
    } else if (activeCategory !== 'all') {
      list = list.filter((car) => car.powertrain === activeCategory);
    }

    if (selectedBrandId) {
      const brandFiltered = list.filter((c) => c.brandId === selectedBrandId);
      list =
        brandFiltered.length > 0
          ? brandFiltered
          : carsList.filter((c) => c.brandId === selectedBrandId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = carsList.filter(
        (c) =>
          c.titleLine1.toLowerCase().includes(q) ||
          c.titleLine2.toLowerCase().includes(q) ||
          c.powertrain.toLowerCase().includes(q) ||
          c.typeText.toLowerCase().includes(q) ||
          c.engineText.toLowerCase().includes(q)
      );
    }

    return list;
  }, [carsList, activeCategory, selectedBrandId, searchQuery]);

  // --- WhatsApp URL Builders (No Personal Account Needed) ---
  const whatsAppDigits = toWhatsAppDigits(showroomInfo.phone);

  const buildGeneralWhatsAppUrl = (customText?: string) => {
    const msg =
      customText ||
      `Hello RY WHEELS (${showroomInfo.fullAddress}), I would like to make an inquiry about your available vehicles.`;
    return `https://wa.me/${whatsAppDigits}?text=${encodeURIComponent(msg)}`;
  };

  const buildSingleCarWhatsAppUrl = (
    car: ShowcaseCar,
    trimLabel?: string,
    extraIds: string[] = [],
    unitTotal?: number,
    topic?: string,
    customerPhone?: string
  ) => {
    const chosenTrim = trimLabel || car.trims[0]?.label || 'Standard Spec';
    const extraNames = extraIds
      .map((id) => DEALERSHIP_EXTRAS.find((x) => x.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    const priceStr = unitTotal ? formatGhs(unitTotal) : car.priceText;
    const cond = car.condition || 'Brand New (0 km) · Duty Paid';

    const lines = [
      `Hello *RY WHEELS* (${showroomInfo.fullAddress}),`,
      `I am interested in this vehicle from your Showroom:`,
      ``,
      `• *Vehicle:* ${car.titleLine1} — ${car.titleLine2} (${car.powertrain})`,
      `• *Condition:* ${cond}`,
      `• *Selected Trim:* ${chosenTrim}`,
      extraNames ? `• *Extras:* ${extraNames}` : null,
      `• *Listed Price:* ${priceStr}`,
      topic ? `• *Inquiry:* ${topic}` : null,
      customerPhone?.trim() ? `• *My Phone / WhatsApp:* ${customerPhone.trim()}` : null,
      ``,
      `Please share availability and next steps.`,
    ]
      .filter(Boolean)
      .join('\n');

    return `https://wa.me/${whatsAppDigits}?text=${encodeURIComponent(lines)}`;
  };

  const buildGarageWhatsAppText = () => {
    const prefLabel =
      paymentMethod === 'viewing'
        ? 'Showroom Viewing & Direct Purchase'
        : paymentMethod === 'financing'
          ? 'Ghana Bank Auto Financing'
          : 'Direct Bank Transfer / Cash';
    const modeLabel =
      deliveryMode === 'delivery'
        ? 'Accra Home Delivery'
        : 'Pickup / Viewing at Tse Addo High Street, Accra';

    const itemLines = cartItems.map(
      (item, idx) =>
        `${idx + 1}. *${item.car.titleLine1} ${item.car.titleLine2}* (${item.car.powertrain})\n   Trim: ${item.selectedTrimLabel} | Qty: ${item.quantity} | ${formatGhs(item.unitPrice * item.quantity)}`
    );

    return [
      `Hello *RY WHEELS* (${showroomInfo.fullAddress}),`,
      `I have added the following vehicle(s) to my Garage and would like to proceed:`,
      ``,
      ...itemLines,
      ``,
      `• *Total Amount:* ${formatGhs(cartGrandTotal)}`,
      `• *Handover Preference:* ${modeLabel}`,
      `• *Payment / Inquiry Plan:* ${prefLabel}`,
      buyerName.trim() ? `• *Name:* ${buyerName.trim()}` : null,
      buyerPhone.trim() ? `• *My Phone / WhatsApp:* ${buyerPhone.trim()}` : null,
      ``,
      `Please contact me so we can continue on WhatsApp.`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const buildGarageWhatsAppUrl = () => {
    return `https://wa.me/${whatsAppDigits}?text=${encodeURIComponent(
      buildGarageWhatsAppText()
    )}`;
  };

  const handleLogGarageWhatsAppInquiry = () => {
    if (cartItems.length === 0) return;
    const code = `RY-WA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      id: code,
      items: [...cartItems],
      totalAmount: cartGrandTotal,
      locationName: showroomInfo.fullAddress,
      deliveryMode,
      buyerName: buyerName.trim() || 'Showroom Visitor',
      buyerEmail: 'WhatsApp Dispatch',
      buyerPhone: buyerPhone.trim() || 'Sent via WhatsApp',
      createdAt: 'Just now',
      status: 'WhatsApp Inquiry Dispatched',
    };
    setOrderHistory((prev) => [newOrder, ...prev]);
    setOrderSuccessCode(code);
    playLaunchSound();
    showToast('Opening WhatsApp with your Garage vehicles...');
  };

  // --- Custom SVG Icon renderer for the 5 Curved Speedometer Arc Segments (01 - 05) ---
  const renderArcIcon = (index: number, isActive: boolean) => {
    const colorClass = isActive
      ? 'text-[#111111]'
      : 'text-[#666666] group-hover:text-[#111111]';
    switch (index) {
      case 0:
        return (
          <svg
            viewBox="0 0 48 48"
            className={`w-7 h-7 ${colorClass} fill-none stroke-current transition-colors`}
            strokeWidth="2.4"
          >
            <rect x="6" y="10" width="8" height="12" rx="2" />
            <rect x="34" y="10" width="8" height="12" rx="2" />
            <rect x="6" y="26" width="8" height="12" rx="2" />
            <rect x="34" y="26" width="8" height="12" rx="2" />
            <path d="M14 16h20M14 32h20M24 16v16" />
            <circle cx="24" cy="24" r="5" />
          </svg>
        );
      case 1:
        return (
          <svg
            viewBox="0 0 48 48"
            className={`w-7 h-7 ${colorClass} fill-none stroke-current transition-colors`}
            strokeWidth="2.4"
          >
            <path d="M16 8L6 40M32 8l10 32" strokeLinecap="round" />
            <path d="M24 10v6M24 21v6M24 32v6" strokeLinecap="round" />
          </svg>
        );
      case 2:
        return (
          <svg
            viewBox="0 0 48 48"
            className={`w-8 h-8 ${colorClass} fill-none stroke-current transition-colors`}
            strokeWidth="2.6"
          >
            <path d="M8 34a16 16 0 1 1 32 0" strokeLinecap="round" />
            <path d="M24 30l8-12" strokeLinecap="round" strokeWidth="3" />
            <circle cx="24" cy="30" r="3" fill="currentColor" />
          </svg>
        );
      case 3:
        return (
          <svg
            viewBox="0 0 48 48"
            className={`w-7 h-7 ${colorClass} fill-none stroke-current transition-colors`}
            strokeWidth="2.4"
          >
            <path d="M12 28v-8M20 26V14M28 24V12" strokeLinecap="round" strokeWidth="3" />
            <path d="M10 36l26-12M30 22l6 2-2 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      default:
        return (
          <GarageStallIcon
            className={`w-7 h-7 ${colorClass} transition-colors`}
            isOpen={isActive}
          />
        );
    }
  };

  const arcTransforms = [
    { rotate: -20, translateY: -46 },
    { rotate: -10, translateY: -12 },
    { rotate: 0, translateY: 2 },
    { rotate: 10, translateY: -12 },
    { rotate: 20, translateY: -46 },
  ];

  // Calculate live price inside Configurator Modal
  const modalTrim = useMemo(() => {
    if (!exploredCar) return null;
    return (
      exploredCar.trims.find((t) => t.id === configTrimId) ||
      exploredCar.trims[0] ||
      null
    );
  }, [exploredCar, configTrimId]);

  const modalExtrasSum = useMemo(() => {
    return configExtras.reduce((acc, id) => {
      const ex = DEALERSHIP_EXTRAS.find((item) => item.id === id);
      return acc + (ex ? ex.price : 0);
    }, 0);
  }, [configExtras]);

  const modalUnitTotal = exploredCar
    ? exploredCar.priceNumeric + (modalTrim ? modalTrim.priceDelta : 0) + modalExtrasSum
    : 0;

  // =========================================================================
  // SEPARATE STANDALONE ADMIN BACK-OFFICE PLATFORM
  // Completely independent platform that manages the public dealership site
  // =========================================================================
  if (activePage === 'admin') {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen w-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold">
            Loading RY WHEELS Admin...
          </div>
        }
      >
        <AdminPlatform
          onExitToStorefront={() => {
            setActivePage('welcome');
            window.scrollTo(0, 0);
          }}
          cars={carsList}
          onAddCar={handleAdminAddCar}
          onUpdateCar={handleAdminUpdateCar}
          onUpdateCarPrice={handleAdminUpdateCarPrice}
          onDeleteCar={handleAdminDeleteCar}
          onResetCars={handleAdminResetCars}
          galleryPhotos={galleryPhotos}
          onAddGalleryPhoto={handleAdminAddGalleryPhoto}
          onUpdateGalleryPhoto={handleAdminUpdateGalleryPhoto}
          onDeleteGalleryPhoto={handleAdminDeleteGalleryPhoto}
          reviews={clientReviews}
          onToggleReviewVisibility={handleAdminToggleReviewVisibility}
          onDeleteReview={handleAdminDeleteReview}
          newsList={newsList}
          onAddNews={handleAdminAddNews}
          onDeleteNews={handleAdminDeleteNews}
          promoSlides={promoSlides}
          onUpdatePromoSlide={handleAdminUpdatePromoSlide}
          reservations={orderHistory.map((o) => ({
            id: o.id,
            buyerName: o.buyerName,
            buyerEmail: o.buyerEmail,
            buyerPhone: o.buyerPhone,
            totalAmount: o.totalAmount,
            locationName: o.locationName,
            deliveryMode: o.deliveryMode,
            createdAt: o.createdAt,
            status: o.status,
            vehicleSummary: o.items
              .map((i) => `${i.car.titleLine1} (x${i.quantity})`)
              .join(', '),
          }))}
          onUpdateReservationStatus={handleAdminUpdateReservationStatus}
          onDeleteReservation={handleAdminDeleteReservation}
          showroomInfo={showroomInfo}
          onUpdateShowroomInfo={handleAdminUpdateShowroomInfo}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="h-screen h-[100dvh] max-h-[100dvh] w-full bg-white text-[#111111] flex flex-col selection:bg-[#111111] selection:text-white overflow-hidden">
      {/* =====================================================================
          FLOATING NOTIFICATION PILL
         ===================================================================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[950] bg-[#111111] text-white rounded-[30px] shadow-xl px-4 py-2.5 flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          TOP LOCKED NAVIGATION BAR (RESPONSIVE MOBILE, TABLET & DESKTOP)
          Left: RY WHEELS Logo
          Center (lg+): Welcome & News | Showroom | Gallery | Reservations
          Right: Garage Stall Button + Full Tse Addo Location Badge + User + Menu
         ===================================================================== */}
      <header className="shrink-0 w-full bg-white/95 backdrop-blur-md z-[300] border-b border-[#e5e5e5] flex flex-col justify-center">
        <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-5 xl:px-8 h-[64px] sm:h-[76px] lg:h-[84px] flex items-center justify-between gap-2">
          {/* Left: Transparent RY WHEELS Logo */}
          <a
            href="#welcome"
            onClick={(e) => {
              e.preventDefault();
              setActivePage('welcome');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 cursor-pointer shrink-0"
            aria-label="RY WHEELS Welcome"
          >
            <img
              src={RY_LOGO_TRANSPARENT}
              alt="RY WHEELS"
              className="h-[32px] sm:h-[38px] xl:h-[44px] w-auto object-contain select-none"
            />
          </a>

          {/* Right: GARAGE STALL BUTTON + Full Tse Addo High Street, Accra Badge + User + Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* GARAGE STALL BUTTON */}
            <button
              type="button"
              onClick={() => (isGarageOpen ? handleCloseGarage() : handleOpenGarage())}
              className="group relative flex items-center gap-2 sm:gap-2.5 bg-[#111111] hover:bg-[#242424] text-white rounded-[30px] px-3 sm:px-4 py-2 transition-all cursor-pointer shadow-sm shrink-0"
              title="Open Garage Door (Your Parked Vehicles)"
            >
              <GarageStallIcon
                className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform group-hover:scale-105 shrink-0"
                isOpen={isGarageOpen}
              />
              <div className="flex flex-col items-start leading-none">
                <span className="hidden sm:block text-[9px] uppercase tracking-wider text-white/75 font-bold">
                  Garage
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold text-white sm:mt-0.5 whitespace-nowrap">
                  {totalCartCount === 0 ? 'Open Stall' : `${totalCartCount} Parked`}
                </span>
              </div>
              <span
                className={`min-w-[20px] h-[20px] px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                  totalCartCount > 0
                    ? 'bg-white text-[#111111]'
                    : 'bg-white/15 text-white'
                }`}
              >
                {totalCartCount}
              </span>
            </button>

            {/* Full Location Badge on Small Screens & Up (sm+) */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen((o) => !o)}
              className="hidden sm:flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#111111] border border-[#d4d4d4] rounded-[30px] px-3.5 py-2 transition-all cursor-pointer shrink-0"
              title={`Showroom Location: ${showroomInfo.fullAddress}`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#111111] shrink-0" />
              <span className="text-xs font-bold text-[#111111] whitespace-nowrap">
                {showroomInfo.fullAddress}
              </span>
            </button>

            {/* Direct WhatsApp Showroom Desk Button (Replaces Personal Account Login) */}
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with RY WHEELS on WhatsApp"
              className="flex items-center gap-1.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[30px] px-3 sm:px-3.5 py-2 transition-colors cursor-pointer shrink-0"
              title="Inquire Directly on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline text-xs font-extrabold whitespace-nowrap">
                WhatsApp
              </span>
            </a>

            <button
              type="button"
              onClick={() => setActiveNavModal('menu')}
              aria-label="Quick Menu"
              className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 rounded-full border border-[#d4d4d4] bg-white hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Location Sub-Bar (< 640px) so full Tse Addo High Street, Accra address is always visible on phones */}
        <div className="sm:hidden w-full bg-[#f8f8f8] border-t border-[#ececec] px-3 py-1.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsLocationModalOpen((o) => !o)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] truncate cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#111111] shrink-0" />
            <span className="truncate">{showroomInfo.fullAddress}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLocationModalOpen((o) => !o)}
            className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] underline shrink-0 cursor-pointer"
          >
            Hours &amp; Contact
          </button>
        </div>
      </header>

      {/* =====================================================================
          FULL-SIZED MOTORIZED GARAGE BAY OVERLAY (THE GARAGE CART)
          Expansive architectural garage bay with full roll-up shutter door
         ===================================================================== */}
      <AnimatePresence>
        {isGarageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[850] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="RY WHEELS Private Garage Bay"
          >
            {/* Large Full-Viewport Architectural Garage Frame */}
            <motion.div
              initial={{ scale: 0.97, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[98vw] max-w-[1380px] h-[90vh] sm:h-[92vh] rounded-[32px] bg-[#141414] border-4 border-[#2b2b2b] shadow-[0_30px_100px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col"
            >
              {/* Compact Garage Header Bar */}
              <div className="relative z-30 bg-[#111111] border-b border-[#2e2e2e] px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#111111] flex items-center justify-center shrink-0">
                    <GarageStallIcon className="w-5 h-5" isOpen />
                  </div>
                  <div>
                    <span className="font-sans font-extrabold text-sm sm:text-base tracking-wide uppercase block leading-tight">
                      RY WHEELS GARAGE ({totalCartCount})
                    </span>
                    <span className="text-[11px] text-white/70 block">
                      {RY_SHOWROOM_LOCATION.fullAddress}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseGarage}
                  className="px-4 py-2 rounded-full bg-white text-[#111111] hover:bg-[#e5e5e5] text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Close</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* =============================================================
                  GARAGE GATE / DOOR: Opens upward and leaves completely
                  so it never covers or blocks any space inside the Garage
                 ============================================================= */}
              <AnimatePresence>
                {garageDoorPhase === 'opening' && (
                  <motion.div
                    key="garage-shutter-gate"
                    initial={{ y: '0%', opacity: 1 }}
                    animate={{ y: '-115%', opacity: 0 }}
                    exit={{ y: '-115%', opacity: 0 }}
                    transition={{
                      duration: 0.52,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 z-40 bg-[#181818] flex flex-col justify-between pointer-events-none"
                  >
                    {[1, 2, 3, 4].map((slat) => (
                      <div
                        key={slat}
                        className="flex-1 w-full border-b border-[#0d0d0d] bg-gradient-to-b from-[#2b2b2b] to-[#161616] flex items-center justify-center px-6"
                      >
                        {slat === 2 && (
                          <div className="px-6 py-2.5 rounded-2xl bg-white text-[#111111] font-sans font-black text-xs sm:text-sm tracking-widest uppercase shadow-lg flex items-center gap-3">
                            <img
                              src={RY_LOGO_TRANSPARENT}
                              alt="RY WHEELS"
                              className="h-6 w-auto object-contain"
                            />
                            <span>RY WHEELS GARAGE</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* =============================================================
                  INSIDE THE SPACIOUS GARAGE BAY (Parked Vehicles & Checkout)
                 ============================================================= */}
              <div className="relative z-10 flex-1 bg-[#f6f6f6] text-[#111111] p-6 sm:p-8 lg:p-10 overflow-y-auto no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full min-h-[420px] rounded-[30px] border-2 border-dashed border-[#d4d4d4] bg-white p-8 flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-[#f4f4f4] border border-[#e5e5e5] flex items-center justify-center text-[#111111]">
                      <GarageStallIcon className="w-11 h-11" isOpen />
                    </div>
                    <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-[#111111]">
                      Garage Bay Empty
                    </h3>
                    <p className="text-sm text-[#666666] max-w-sm">
                      Select any vehicle from the showroom to park here.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseGarage();
                        window.setTimeout(() => enterShowroom('all'), 420);
                      }}
                      className="mt-2 px-7 py-3.5 rounded-[30px] bg-[#111111] hover:bg-[#262626] text-white text-sm font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <span>Go to Showroom</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left 8 Cols: Wide Numbered Garage Stalls */}
                    <div className="lg:col-span-8 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#555555]">
                          Parked Vehicles in Garage ({totalCartCount})
                        </span>
                        <button
                          type="button"
                          onClick={clearGarage}
                          className="text-xs sm:text-sm font-bold text-[#111111] hover:underline cursor-pointer"
                        >
                          Clear All Stalls
                        </button>
                      </div>

                      {cartItems.map((item, idx) => (
                        <div
                          key={item.cartItemId}
                          className="rounded-[26px] border border-[#d4d4d4] bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xs"
                        >
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-[140px] sm:w-[165px] h-[105px] sm:h-[115px] rounded-[20px] bg-[#f8f8f8] border border-[#e5e5e5] overflow-hidden relative shrink-0">
                              <ResilientImage
                                src={item.car.image}
                                alt={item.car.titleLine1}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#111111] text-white text-[10px] font-extrabold">
                                STALL 0{idx + 1}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                                {item.car.powertrain}
                              </span>
                              <h4 className="font-bold text-base sm:text-lg text-[#111111]">
                                {item.car.titleLine1} · {item.car.titleLine2}
                              </h4>
                              <p className="text-xs sm:text-sm text-[#666666]">
                                {item.selectedTrimLabel}
                              </p>
                              <div className="pt-1">
                                <span className="inline-block bg-[#111111] text-white rounded-[30px] px-3.5 py-1 text-xs sm:text-sm font-bold">
                                  {formatGhs(item.unitPrice * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#eeeeee]">
                            <div className="flex items-center gap-2 bg-[#f4f4f4] rounded-full px-2.5 py-1.5">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.cartItemId, -1)}
                                className="w-8 h-8 rounded-full bg-white text-[#111111] border border-[#d4d4d4] flex items-center justify-center cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-sm font-bold px-2 text-[#111111]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.cartItemId, 1)}
                                className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeCartItem(item.cartItemId)}
                              aria-label="Remove from garage"
                              className="w-10 h-10 rounded-full bg-[#f4f4f4] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right 4 Cols: Direct Phone Input & Send Garage to WhatsApp (No Account Needed) */}
                    <div className="lg:col-span-4 rounded-[28px] border border-[#d4d4d4] bg-white p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
                      <div className="border-b border-[#e5e5e5] pb-3">
                        <h4 className="font-sans font-extrabold text-base text-[#111111] uppercase">
                          Purchase / Inquire on WhatsApp
                        </h4>
                        <p className="text-xs text-[#666666] mt-0.5">
                          No account needed · Add your number &amp; send your Garage list directly to RY WHEELS WhatsApp.
                        </p>
                      </div>

                      {/* Handover Mode: Tse Addo Pickup vs Home Delivery */}
                      <div className="grid grid-cols-2 gap-2 p-1 rounded-[30px] bg-[#f2f2f2]">
                        <button
                          type="button"
                          onClick={() => setDeliveryMode('pickup')}
                          className={`py-2 px-3 rounded-[30px] text-xs font-bold transition-all cursor-pointer ${
                            deliveryMode === 'pickup'
                              ? 'bg-[#111111] text-white'
                              : 'text-[#555555]'
                          }`}
                        >
                          Tse Addo Viewing
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMode('delivery')}
                          className={`py-2 px-3 rounded-[30px] text-xs font-bold transition-all cursor-pointer ${
                            deliveryMode === 'delivery'
                              ? 'bg-[#111111] text-white'
                              : 'text-[#555555]'
                          }`}
                        >
                          Home Delivery
                        </button>
                      </div>

                      {/* Customer Phone Number & Optional Name Input */}
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[11px] font-extrabold uppercase tracking-wider text-[#111111] block mb-1">
                            Your Phone / WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            value={buyerPhone}
                            onChange={(e) => setBuyerPhone(e.target.value)}
                            placeholder="e.g. 024 000 0000 or +233..."
                            className="w-full px-4 py-2.5 rounded-[50px] border border-[#d4d4d4] focus:border-[#111111] text-xs sm:text-sm text-[#111111] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#666666] block mb-1">
                            Your Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            placeholder="e.g. Kwame Mensah"
                            className="w-full px-4 py-2.5 rounded-[50px] border border-[#d4d4d4] focus:border-[#111111] text-xs sm:text-sm text-[#111111] focus:outline-none"
                          />
                        </div>

                        {/* Payment / Inquiry Plan Selector */}
                        <div className="rounded-[18px] border border-[#e5e5e5] bg-[#f8f8f8] p-3 space-y-1.5">
                          {(
                            [
                              {
                                id: 'viewing',
                                label: 'Inspect at Tse Addo & Finalize Purchase',
                              },
                              {
                                id: 'bank',
                                label: 'Direct Purchase (Bank Transfer / Cash)',
                              },
                              {
                                id: 'financing',
                                label: 'Ghana Bank Auto Financing Plan',
                              },
                            ] as const
                          ).map((opt) => (
                            <label
                              key={opt.id}
                              className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#222222]"
                            >
                              <input
                                type="radio"
                                name="garagePaymentPlan"
                                checked={paymentMethod === opt.id}
                                onChange={() => setPaymentMethod(opt.id)}
                                className="accent-[#111111]"
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Totals */}
                      <div className="space-y-2 text-xs sm:text-sm border-t border-[#e5e5e5] pt-3">
                        <div className="flex items-center justify-between text-[#555555]">
                          <span>Vehicles ({totalCartCount})</span>
                          <span className="font-semibold text-[#111111]">
                            {formatGhs(cartSubTotal)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#555555]">
                          <span>
                            {deliveryMode === 'pickup'
                              ? 'Tse Addo Showroom Viewing'
                              : 'Home Delivery (Accra)'}
                          </span>
                          <span className="font-semibold text-[#111111]">
                            {deliveryFee === 0 ? 'Free' : formatGhs(deliveryFee)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[#e5e5e5] text-base sm:text-lg font-black text-[#111111]">
                          <span>Total</span>
                          <span>{formatGhs(cartGrandTotal)}</span>
                        </div>
                      </div>

                      {/* Primary Action: Send All Parked Garage Cars to WhatsApp */}
                      <a
                        href={buildGarageWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLogGarageWhatsAppInquiry}
                        className="w-full py-3.5 px-5 rounded-[30px] bg-[#111111] hover:bg-[#262626] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                      >
                        <WhatsAppIcon className="w-4 h-4 shrink-0" />
                        <span>Send Garage List to WhatsApp</span>
                      </a>

                      {/* Secondary Quick Actions: Copy Summary or Call Showroom */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(buildGarageWhatsAppText());
                            showToast('Copied Garage inquiry list!');
                          }}
                          className="py-2.5 px-3 rounded-[30px] border border-[#d4d4d4] hover:border-[#111111] text-xs font-bold text-[#111111] cursor-pointer"
                        >
                          Copy List
                        </button>
                        <a
                          href={`tel:${showroomInfo.phone.replace(/\s+/g, '')}`}
                          className="py-2.5 px-3 rounded-[30px] border border-[#d4d4d4] hover:border-[#111111] text-xs font-bold text-[#111111] flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Us</span>
                        </a>
                      </div>

                      {orderSuccessCode && (
                        <div className="rounded-[16px] bg-[#f4f4f4] border border-[#d4d4d4] p-3 text-center space-y-1">
                          <div className="text-xs font-extrabold text-[#111111]">
                            Inquiry #{orderSuccessCode} Ready on WhatsApp
                          </div>
                          <p className="text-[11px] text-[#555555]">
                            Continue chatting with RY WHEELS ({showroomInfo.phone}) on WhatsApp.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          TSE ADDO HIGH STREET, ACCRA SHOWROOM LOCATION INFO MODAL
         ===================================================================== */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed right-4 sm:right-8 top-[88px] z-[500] w-[92vw] max-w-[360px] rounded-[30px] bg-white border border-[#d4d4d4] p-5 shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
              <span className="font-bold text-sm text-[#111111]">
                Showroom Location
              </span>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[#111111] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-[22px] bg-[#f8f8f8] border border-[#e5e5e5] space-y-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#111111]">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{RY_SHOWROOM_LOCATION.fullAddress}</span>
              </div>
              <p className="text-xs text-[#555555] leading-relaxed">
                {RY_SHOWROOM_LOCATION.hours}
              </p>
              <p className="text-xs font-semibold text-[#111111]">
                Phone: {RY_SHOWROOM_LOCATION.phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${RY_SHOWROOM_LOCATION.phone.replace(/\s+/g, '')}`}
                className="flex-1 py-2.5 px-3 rounded-[30px] bg-[#111111] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Showroom</span>
              </a>
              <a
                href={RY_SHOWROOM_LOCATION.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-[30px] border border-[#111111] text-[#111111] text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@ry_wheels</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MAIN SCROLLABLE CONTENT AREA
         ===================================================================== */}
      <main
        ref={mainScrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        {/* ===================================================================
            PAGE 1: RELAXED WELCOME & NEWS PAGE
            Calm, un-crowded layout strictly focused on Welcome & News
           =================================================================== */}
        {activePage === 'welcome' && (
          <>
            {/* 1A. Calm White & Black Welcome Hero + Interactive Car + Speedometer Dial */}
            <section
              id="welcome"
              className="relative w-full max-w-[1920px] mx-auto bg-white overflow-hidden"
            >
              <div
                className="relative w-full pt-4 sm:pt-6 pb-10 sm:pb-16 lg:pb-22"
                style={{
                  background:
                    'radial-gradient(ellipse 80% 70% at 50% 18%, #FFFFFF 0%, #FAFAFA 50%, #EFEFEF 100%)',
                }}
              >
                <div className="relative max-w-[1260px] mx-auto px-3 sm:px-6 lg:px-8">
                  <div className="relative w-full py-6 sm:py-10 px-4 sm:px-10 rounded-[26px] sm:rounded-[30px] border border-[#e5e5e5] bg-gradient-to-b from-white to-[#f5f5f5] flex flex-col items-center">
                    <div className="w-[170px] sm:w-[270px] lg:w-[360px] flex items-center justify-center pb-8 sm:pb-14 lg:pb-24">
                      <img
                        src={RY_LOGO_TRANSPARENT}
                        alt="RY WHEELS"
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-auto object-contain select-none pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Interactive Moving Pearl White Car (Touch, Click, or Drag to Move) */}
                  <div className="relative z-20 -mt-10 sm:-mt-20 lg:-mt-32 mx-auto max-w-[940px] px-1 sm:px-6 select-none">
                    <motion.div
                      drag
                      dragConstraints={{ left: -60, right: 60, top: -12, bottom: 12 }}
                      dragElastic={0.25}
                      onTap={handleTouchOrClickHeroCar}
                      animate={{
                        x: isLaunching ? [0, 68, -16, 0] : carDriveOffset,
                        scale: isLaunching ? [1, 1.04, 1] : 1,
                        rotateZ: isLaunching ? [0, -1.1, 0.3, 0] : 0,
                      }}
                      transition={{
                        duration: isLaunching ? 0.65 : 0.28,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      className="relative cursor-grab active:cursor-grabbing group"
                      role="button"
                      tabIndex={0}
                      aria-label="Touch or drag car to move"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTouchOrClickHeroCar();
                        }
                      }}
                    >
                      <div
                        className={`absolute inset-x-[6%] bottom-[6%] top-[14%] rounded-[46%] bg-black/35 blur-2xl transition-all duration-300 -z-10 ${
                          isLaunching ? 'scale-105 opacity-75' : 'opacity-50'
                        }`}
                      />
                      <ResilientImage
                        src={whiteCarCutoutImg}
                        alt="RY WHEELS Pearl White Supercar"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_22px_30px_rgba(0,0,0,0.32)]"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* --- CURVED SPEEDOMETER / CYCLE-STYLE 01-05 ARC DIAL --- */}
              <div className="relative z-20 -mt-6 sm:-mt-12 lg:-mt-16">
                <svg
                  viewBox="0 0 1920 180"
                  className="w-full h-8 sm:h-14 lg:h-20 block overflow-visible pointer-events-none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="speedoArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d4d4d4" />
                      <stop offset="50%" stopColor="#111111" />
                      <stop offset="100%" stopColor="#d4d4d4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,10 Q 960,195 1920,10 L 1920,180 L 0,180 Z"
                    fill="#F6F6F6"
                  />
                  <path
                    d="M 0,10 Q 960,195 1920,10"
                    fill="none"
                    stroke="url(#speedoArcGrad)"
                    strokeWidth="4.5"
                  />
                </svg>

                <div className="bg-[#F6F6F6] border-b border-[#e5e5e5] pb-8 sm:pb-9 pt-1">
                  <div className="max-w-[1320px] mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                      {RYWHEELS_ARC_FEATURES.map((feat, idx) => {
                        const isSelected = activeArcIndex === idx;
                        const curve = arcTransforms[idx] || { rotate: 0, translateY: 0 };
                        const isLastItem = idx === RYWHEELS_ARC_FEATURES.length - 1;

                        return (
                          <button
                            key={feat.id}
                            type="button"
                            onClick={() => {
                              setActiveArcIndex(idx);
                              if (feat.actionType === 'open-garage') {
                                handleOpenGarage();
                              } else {
                                playLaunchSound();
                                enterShowroom(feat.powertrainFilter, null);
                              }
                            }}
                            style={{
                              transform: isDesktopViewport
                                ? `translateY(${curve.translateY * 0.36}px) rotate(${curve.rotate * 0.36}deg)`
                                : undefined,
                            }}
                            className={`group relative py-3.5 sm:py-4 px-3 rounded-[20px] sm:rounded-[22px] flex flex-col items-center text-center transition-all cursor-pointer border ${
                              isLastItem ? 'col-span-2 sm:col-span-1' : ''
                            } ${
                              isSelected
                                ? 'bg-white border-[#111111] shadow-sm text-[#111111]'
                                : 'bg-white/85 hover:bg-white hover:border-[#111111] border-[#e5e5e5] text-[#555555]'
                            }`}
                          >
                            <span
                              className={`font-speedo text-xs sm:text-sm font-bold tracking-wider mb-1 ${
                                isSelected ? 'text-[#111111]' : 'text-[#666666]'
                              }`}
                            >
                              {feat.number}
                            </span>
                            <div className="mb-1">{renderArcIcon(idx, isSelected)}</div>
                            <span className="font-extrabold text-[11px] sm:text-xs tracking-wide uppercase text-[#111111]">
                              {feat.title}
                            </span>
                            <span className="text-[10px] font-semibold text-[#666666] group-hover:text-[#111111] mt-1">
                              {feat.actionType === 'open-garage' && totalCartCount > 0
                                ? `${totalCartCount} Parked · Open →`
                                : feat.shortTitle}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 1B. CALM WELCOME & NEWS SECTION (Slideshow + News Cards Only) */}
            <section className="max-w-[1240px] w-[94%] sm:w-[92%] mx-auto py-8 sm:py-14 flex flex-col gap-8 sm:gap-12">
              {/* Responsive 2026 Flagship Arrival Slideshow */}
              <div className="w-full flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="font-sans font-extrabold not-italic tracking-tight text-xl sm:text-2xl text-[#111111]">
                      Welcome &amp; News
                    </h1>
                    <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
                      RY WHEELS · {showroomInfo.fullAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => enterShowroom('all')}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-[30px] bg-[#111111] hover:bg-[#262626] text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <span>Visit Car Showroom</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full rounded-[24px] sm:rounded-[30px] overflow-hidden relative min-h-[320px] sm:min-h-[420px] md:min-h-[450px] lg:min-h-[490px] xl:min-h-[520px] bg-[#111111] border border-[#d4d4d4] shadow-sm flex flex-col">
                  <AnimatePresence mode="wait">
                    {promoSlides.map((slide, sIdx) => {
                      if (sIdx !== activePromoIndex) return null;
                      return (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className="relative w-full flex-1 flex flex-col justify-between min-h-[320px] sm:min-h-[420px] md:min-h-[450px] lg:min-h-[490px] xl:min-h-[520px]"
                        >
                          <ResilientImage
                            src={slide.image}
                            alt={slide.title}
                            loading="eager"
                            fetchPriority="high"
                            className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
                          />
                          <div className="relative z-10 flex-1 bg-gradient-to-t from-black/85 via-black/30 to-black/15 p-5 sm:p-8 md:p-10 flex flex-col justify-between gap-4 min-h-[320px] sm:min-h-[420px] md:min-h-[450px] lg:min-h-[490px] xl:min-h-[520px]">
                            {/* Top Row: Simple Slide Counter */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                                {slide.badge}
                              </span>
                              <span className="text-xs font-bold text-white/80">
                                0{sIdx + 1} / 0{promoSlides.length}
                              </span>
                            </div>

                            {/* Center: Clean Straight Title & 1-Line Subtitle */}
                            <div className="max-w-xl space-y-2 my-auto py-1">
                              <h2 className="font-sans font-extrabold not-italic tracking-tight text-xl sm:text-3xl md:text-4xl text-white uppercase leading-tight">
                                {slide.title}
                              </h2>
                              <p className="text-xs sm:text-sm text-white/85 font-medium line-clamp-1">
                                {slide.subtitle}
                              </p>
                            </div>

                            {/* Bottom Row: Enter Showroom CTA + Slide Controls */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <button
                                type="button"
                                onClick={() => enterShowroom(slide.filterTarget)}
                                className="px-5 py-2.5 rounded-[30px] bg-white hover:bg-[#f2f2f2] text-[#111111] text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all cursor-pointer flex items-center gap-2"
                              >
                                <span>{slide.ctaLabel}</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>

                              <div className="flex items-center gap-2 ml-auto">
                                <div className="flex items-center gap-1.5 mr-1">
                                  {promoSlides.map((s, dotI) => (
                                    <button
                                      key={s.id}
                                      type="button"
                                      onClick={() => setActivePromoIndex(dotI)}
                                      aria-label={`Slide ${dotI + 1}`}
                                      className={`h-2 rounded-full transition-all cursor-pointer ${
                                        dotI === activePromoIndex
                                          ? 'w-7 sm:w-8 bg-white'
                                          : 'w-2 bg-white/40 hover:bg-white/70'
                                      }`}
                                    />
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setActivePromoIndex(
                                      (prev) =>
                                        (prev - 1 + promoSlides.length) % promoSlides.length
                                    )
                                  }
                                  aria-label="Previous slide"
                                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#111111] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActivePromoIndex(
                                      (prev) => (prev + 1) % promoSlides.length
                                    )
                                  }
                                  aria-label="Next slide"
                                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white hover:text-[#111111] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* 1C. CONCISE NEWS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {newsList.map((news) => (
                  <div
                    key={news.id}
                    className="rounded-[24px] border border-[#e5e5e5] bg-white hover:border-[#111111] p-5 flex flex-col justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#737373]">
                        {news.tag} · {news.date}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-[#111111] leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-xs text-[#666666] line-clamp-2">
                        {news.summary}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => enterShowroom(news.targetCategory)}
                      className="w-fit text-xs font-extrabold text-[#111111] flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{news.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ===================================================================
            DEDICATED GALLERY & CLIENT REVIEWS PAGE
           =================================================================== */}
        {activePage === 'gallery' && (
          <GallerySection
            galleryPhotos={galleryPhotos}
            reviews={clientReviews}
            whatsappPhone={showroomInfo.phone}
            onAddReview={handleAddClientReview}
            onDeleteReview={handleAdminDeleteReview}
            onEnterShowroom={(cat) => enterShowroom(cat)}
          />
        )}

        {/* ===================================================================
            PAGE 2: DEDICATED CAR SHOWROOM
            Where visitors inspect, filter, configure, and park cars in the Garage
           =================================================================== */}
        {activePage === 'showroom' && (
          <section className="max-w-[1360px] w-[94%] mx-auto pt-6 sm:pt-8 pb-16 flex flex-col gap-6">
            {/* Showroom Header Bar */}
            <div className="rounded-[28px] border border-[#e5e5e5] bg-[#f8f8f8] p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="font-sans font-extrabold text-xl sm:text-2xl text-[#111111]">
                  RY WHEELS SHOWROOM
                </h1>
                <p className="text-xs sm:text-sm text-[#666666] mt-0.5">
                  EV, Hybrid &amp; Patrol V8 · {RY_SHOWROOM_LOCATION.fullAddress}
                </p>
              </div>

              {/* Search Input Inside Showroom */}
              <div className="w-full md:w-[340px] relative h-[46px] rounded-[60px] border border-[#d4d4d4] focus-within:border-[#111111] bg-white flex items-center px-4">
                <Search className="w-4 h-4 text-[#737373] mr-2.5 shrink-0" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Patrol, Taycan, Bentley, EV..."
                  className="w-full h-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#111111] placeholder:text-[#737373]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="w-5 h-5 rounded-full bg-[#e5e5e5] text-[#111111] flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* 1. Powertrain Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {MENU_CATEGORY_PILLS.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`h-[56px] min-w-[155px] px-4 py-2 rounded-[16px] flex items-center gap-3 border transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#111111] border-[#111111] text-white shadow-xs'
                        : 'bg-white hover:bg-[#f6f6f6] border-[#d4d4d4] text-[#111111]'
                    }`}
                  >
                    <div
                      className={`w-[38px] h-[38px] rounded-xl overflow-hidden flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/15' : 'bg-[#f2f2f2]'
                      }`}
                    >
                      <ResilientImage
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-bold text-sm whitespace-nowrap leading-tight ${
                          isSelected ? 'text-white' : 'text-[#111111]'
                        }`}
                      >
                        {cat.name}
                      </div>
                      <div
                        className={`text-[10px] font-medium whitespace-nowrap ${
                          isSelected ? 'text-white/75' : 'text-[#737373]'
                        }`}
                      >
                        {cat.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2. Brand Filter Chips */}
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar border-b border-[#e5e5e5] pb-3.5">
              <button
                type="button"
                onClick={() => setSelectedBrandId(null)}
                className={`h-[40px] px-4 rounded-[60px] flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  selectedBrandId === null
                    ? 'bg-[#111111] text-white font-bold'
                    : 'border border-[#d4d4d4] bg-white text-[#222222] hover:bg-[#f2f2f2]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>All Brands</span>
              </button>

              {BRAND_ITEMS.map((brand) => {
                const isSelected = selectedBrandId === brand.id;
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() =>
                      setSelectedBrandId((prev) => (prev === brand.id ? null : brand.id))
                    }
                    className={`h-[40px] p-[5px_15px_5px_5px] rounded-[60px] flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#111111] text-white font-bold'
                        : 'border border-[#d4d4d4] bg-white text-[#222222] hover:bg-[#f2f2f2] font-semibold'
                    }`}
                  >
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden bg-[#111111] shrink-0">
                      <ResilientImage
                        src={brand.image}
                        alt={brand.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap">{brand.name}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. Full-Width 3-Column Showroom Vehicle Grid (Tap any car to open its multi-photo detail card) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedCars.map((car) => {
                const photoCount =
                  car.galleryImages && car.galleryImages.length > 0
                    ? car.galleryImages.length
                    : 1;
                const carCondition =
                  car.condition || 'Brand New (0 km) · Duty Paid';

                return (
                  <article
                    key={car.id}
                    onClick={() => openCarConfigurator(car)}
                    className="group rounded-[26px] border border-[#e5e5e5] hover:border-[#111111] bg-white overflow-hidden flex flex-col justify-between transition-all cursor-pointer shadow-2xs hover:shadow-md"
                  >
                    {/* Top Vehicle Studio Image (Tapping opens the Car Detail Card with multiple photos) */}
                    <div
                      title="Tap to inspect photos & condition"
                      className="h-[205px] w-full bg-[#f8f8f8] border-b border-[#e5e5e5] relative overflow-hidden"
                    >
                      <ResilientImage
                        src={car.image}
                        alt={`${car.titleLine1} ${car.titleLine2}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111111]/90 text-white">
                        {car.powertrain}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-white flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        <span>{photoCount} Photos</span>
                      </span>
                    </div>

                    {/* Vehicle Specs, Condition & Actions */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="font-bold text-sm sm:text-base text-[#111111] leading-snug">
                          {car.titleLine1} · {car.titleLine2}
                        </h3>
                        <p className="text-xs text-[#666666] line-clamp-1">
                          {car.engineText}
                        </p>
                        <p className="text-[11px] font-bold text-[#111111] bg-[#f5f5f5] border border-[#e5e5e5] rounded-lg px-2.5 py-1 line-clamp-1">
                          Condition: {carCondition}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-[#f0f0f0] flex items-center justify-between gap-2">
                        <span className="bg-[#111111] text-white rounded-[30px] px-3 py-1.5 text-xs font-extrabold">
                          {car.priceText}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={buildSingleCarWhatsAppUrl(car)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={`Ask about ${car.titleLine1} on WhatsApp`}
                            className="px-2.5 py-1.5 rounded-full border border-[#d4d4d4] hover:border-[#111111] hover:bg-[#111111] hover:text-white text-xs font-bold text-[#111111] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Inquire</span>
                          </a>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              addCarToGarage(car);
                            }}
                            aria-label={`Park ${car.titleLine1} in Garage`}
                            className="px-3 py-1.5 rounded-full bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                          >
                            <GarageStallIcon className="w-3.5 h-3.5" />
                            <span>Park</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ===================================================================
            PAGE 3: RESERVATIONS / ORDER HISTORY VIEW
           =================================================================== */}
        {activePage === 'history' && (
          <section className="max-w-[1080px] mx-auto px-4 sm:px-8 pt-8 pb-20">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-extrabold text-xl text-[#111111]">
                  Vehicle Reservations &amp; History
                </h1>
                <p className="text-xs text-[#666666] mt-0.5">
                  {RY_SHOWROOM_LOCATION.fullAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('showroom')}
                className="px-4 py-2.5 rounded-[30px] bg-[#111111] text-white text-xs font-bold cursor-pointer"
              >
                ← Visit Showroom
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="rounded-[26px] border border-[#d4d4d4] bg-white p-5 flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
                    <div>
                      <div className="text-sm font-black text-[#111111]">
                        #{order.id}
                      </div>
                      <div className="text-[11px] text-[#666666]">
                        {order.locationName} · {order.createdAt}
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-[30px] bg-[#111111] text-white text-xs font-bold">
                      {order.status}
                    </span>
                  </div>

                  {order.items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center gap-3.5">
                      <div className="w-[110px] h-[85px] rounded-[18px] border border-[#d4d4d4] overflow-hidden bg-[#f8f8f8] shrink-0">
                        <ResilientImage
                          src={item.car.image}
                          alt={item.car.titleLine1}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-[#111111]">
                          {item.car.titleLine1} {item.car.titleLine2}
                        </div>
                        <div className="text-xs text-[#666666] mt-0.5">
                          {item.selectedTrimLabel} · Qty: {item.quantity}
                        </div>
                        <div className="mt-1.5 inline-block bg-[#111111] text-white rounded-[30px] px-3 py-0.5 text-xs font-bold">
                          {formatGhs(item.unitPrice * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================
            CLEAN TSE ADDO HIGH STREET, ACCRA CONTACT & INSTAGRAM FOOTER
           =================================================================== */}
        <footer className="px-4 pb-12 pt-4">
          <div className="max-w-[980px] mx-auto rounded-[30px] border border-[#d4d4d4] bg-white p-6 sm:p-7 flex flex-col gap-4">
            <div className="w-full flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={RY_LOGO_TRANSPARENT}
                  alt="RY WHEELS"
                  className="h-[38px] sm:h-[44px] w-auto object-contain select-none"
                />
                <div>
                  <div className="text-sm font-extrabold text-[#111111]">
                    {showroomInfo.name}
                  </div>
                  <div className="text-xs text-[#666666]">
                    {showroomInfo.fullAddress}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={showroomInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-[30px] border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>{showroomInfo.instagramHandle}</span>
                </a>

                <a
                  href={`tel:${showroomInfo.phone.replace(/\s+/g, '')}`}
                  className="px-4 py-2 rounded-[30px] bg-[#111111] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#262626] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{showroomInfo.phone}</span>
                </a>
              </div>
            </div>

            {/* Concise Contact Details for Tse Addo High Street, Accra */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#555555]">
              <span>{showroomInfo.hours}</span>
              <span>{showroomInfo.email} · Duty Paid &amp; DVLA Registered</span>
            </div>

            <div className="w-full border-t border-[#e5e5e5] pt-3">
              <details className="chrisb-accordion w-full text-[#444444]">
                <summary className="font-bold text-sm text-[#111111] pr-6 cursor-pointer">
                  Quick Links
                </summary>
                <div className="pt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-medium text-[#222222]">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('welcome');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    Welcome &amp; News
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => enterShowroom('all')}
                    className="hover:underline cursor-pointer"
                  >
                    Showroom
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('gallery');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    Client Gallery &amp; Reviews
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => enterShowroom('EV')}
                    className="hover:underline cursor-pointer"
                  >
                    EV Electric
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => enterShowroom('Hybrid')}
                    className="hover:underline cursor-pointer"
                  >
                    Hybrid Cars
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => enterShowroom('Patrol / Petrol')}
                    className="hover:underline cursor-pointer"
                  >
                    Patrol &amp; Petrol
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={handleOpenGarage}
                    className="hover:underline cursor-pointer"
                  >
                    Open Garage ({totalCartCount})
                  </button>
                  <span>|</span>
                  <a
                    href={showroomInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold"
                  >
                    Instagram {showroomInfo.instagramHandle}
                  </a>
                </div>
              </details>
            </div>
          </div>

          {/* HIDDEN LINK DIRECTLY BELOW THE FOOTER CARD THAT LAUNCHES THE SEPARATE ADMIN PLATFORM */}
          <div className="max-w-[980px] mx-auto mt-3 px-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setActivePage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#b5b5b5] hover:text-[#111111] transition-colors cursor-pointer select-none py-1"
            >
              <span>RY WHEELS · Tse Addo High Street</span>
              <span>·</span>
              <span className="underline decoration-dotted">Admin</span>
            </button>
          </div>
        </footer>
      </main>

      {/* =====================================================================
          PERMANENTLY LOCKED / FIXED BOTTOM NAVIGATION DOCK (4 Clean Public Tabs)
          Always locked at the bottom of the screen (no personal account needed)
         ===================================================================== */}
      <nav
        aria-label="Bottom Navigation"
        className="shrink-0 w-full z-[400] bg-white/95 backdrop-blur-xl border-t border-[#d4d4d4] shadow-[0_-4px_24px_0_rgba(0,0,0,0.08)] px-2 sm:px-4 py-1.5"
      >
        <div className="w-full max-w-[620px] mx-auto grid grid-cols-4 gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              setActivePage('welcome');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-1 sm:px-3 rounded-[18px] transition-all cursor-pointer ${
              activePage === 'welcome'
                ? 'bg-[#111111] text-white'
                : 'text-[#222222] hover:bg-[#f2f2f2]'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-tight truncate">
              Welcome
            </span>
          </button>

          <button
            type="button"
            onClick={() => enterShowroom()}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-1 sm:px-3 rounded-[18px] transition-all cursor-pointer ${
              activePage === 'showroom'
                ? 'bg-[#111111] text-white'
                : 'text-[#222222] hover:bg-[#f2f2f2]'
            }`}
          >
            <Car className="w-4 h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-tight truncate">
              Showroom
            </span>
            <span
              className={`hidden md:inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activePage === 'showroom'
                  ? 'bg-white text-[#111111]'
                  : 'bg-[#efefef] text-[#222222]'
              }`}
            >
              {carsList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePage('gallery');
            }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-1 sm:px-3 rounded-[18px] transition-all cursor-pointer ${
              activePage === 'gallery'
                ? 'bg-[#111111] text-white'
                : 'text-[#222222] hover:bg-[#f2f2f2]'
            }`}
          >
            <Camera className="w-4 h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-tight truncate">
              Gallery
            </span>
            <span
              className={`hidden md:inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                activePage === 'gallery'
                  ? 'bg-white text-[#111111]'
                  : 'bg-[#efefef] text-[#222222]'
              }`}
            >
              {galleryPhotos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenGarage}
            className="relative flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 py-2 px-1 sm:px-3 rounded-[18px] text-[#222222] hover:bg-[#f2f2f2] cursor-pointer"
          >
            {totalCartCount > 0 && (
              <span className="sm:hidden absolute top-1 right-2.5 w-4 h-4 rounded-full bg-[#111111] text-white text-[9px] font-bold flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
            <GarageStallIcon className="w-4 h-4 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold leading-tight truncate">
              Garage
            </span>
            {totalCartCount > 0 && (
              <span className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded-full font-extrabold bg-[#111111] text-white">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* =====================================================================
          VEHICLE DETAIL CARD & MULTI-PHOTO MODAL (Front, Backside, Interior & Condition)
         ===================================================================== */}
      <AnimatePresence>
        {exploredCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExploredCar(null)}
            className="fixed inset-0 z-[900] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[700px] max-h-[92vh] rounded-t-[30px] sm:rounded-[30px] bg-white border border-[#d4d4d4] p-5 sm:p-6 overflow-y-auto no-scrollbar text-[#111111] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setExploredCar(null)}
                aria-label="Close"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-[#111111] hover:text-white text-[#111111] border border-[#d4d4d4] flex items-center justify-center cursor-pointer z-30 shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>

              {(() => {
                const carPhotos =
                  exploredCar.galleryImages && exploredCar.galleryImages.length > 0
                    ? exploredCar.galleryImages
                    : [{ label: 'Front Exterior', url: exploredCar.image }];
                const safePhotoIdx =
                  exploredCarPhotoIndex < carPhotos.length ? exploredCarPhotoIndex : 0;
                const currentPhoto = carPhotos[safePhotoIdx] || {
                  label: 'Front Exterior',
                  url: exploredCar.image,
                };
                const conditionText =
                  exploredCar.condition ||
                  'Brand New (0 km) · Factory Sealed · Accident-Free';

                return (
                  <div className="flex flex-col gap-4 pb-4 border-b border-[#e5e5e5]">
                    {/* Active Vehicle Photo Viewer (Front, Backside/Rear, Interior, Cockpit) */}
                    <div className="relative w-full h-[220px] sm:h-[290px] rounded-[22px] overflow-hidden bg-[#f8f8f8] border border-[#d4d4d4]">
                      <ResilientImage
                        src={currentPhoto.url}
                        alt={`${exploredCar.titleLine1} - ${currentPhoto.label}`}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-[11px] font-bold">
                          {exploredCar.powertrain}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/90 text-[#111111] text-[11px] font-extrabold border border-[#d4d4d4]">
                          {currentPhoto.label}
                        </span>
                      </div>

                      {carPhotos.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setExploredCarPhotoIndex(
                                (prev) => (prev - 1 + carPhotos.length) % carPhotos.length
                              )
                            }
                            aria-label="Previous car photo"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExploredCarPhotoIndex(
                                (prev) => (prev + 1) % carPhotos.length
                              )
                            }
                            aria-label="Next car photo"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Multi-Angle Thumbnails (Front Exterior, Backside / Rear, Interior Cabin, Cockpit) */}
                    {carPhotos.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {carPhotos.map((photo, idx) => {
                          const isSelectedPhoto = idx === safePhotoIdx;
                          return (
                            <button
                              key={`${photo.label}-${idx}`}
                              type="button"
                              onClick={() => setExploredCarPhotoIndex(idx)}
                              className={`rounded-[14px] overflow-hidden border text-left transition-all cursor-pointer ${
                                isSelectedPhoto
                                  ? 'border-2 border-[#111111] ring-1 ring-[#111111]'
                                  : 'border-[#d4d4d4] opacity-75 hover:opacity-100'
                              }`}
                            >
                              <div className="h-[52px] sm:h-[62px] w-full bg-[#f4f4f4]">
                                <ResilientImage
                                  src={photo.url}
                                  alt={photo.label}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="px-1.5 py-1 bg-white text-[10px] font-bold text-[#111111] truncate text-center">
                                {photo.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Title, Vehicle Condition & Key Specs */}
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-base sm:text-xl font-black text-[#111111] leading-tight">
                          {exploredCar.titleLine1} — {exploredCar.titleLine2}
                        </h2>
                        <span className="text-sm font-black text-[#111111]">
                          {exploredCar.priceText}
                        </span>
                      </div>

                      {/* Vehicle Condition Box */}
                      <div className="rounded-[16px] bg-[#f8f8f8] border border-[#e5e5e5] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#111111] shrink-0" />
                          <span className="text-xs font-extrabold text-[#111111]">
                            Condition: {conditionText}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#555555]">
                          0–60: {exploredCar.zeroToSixty} · {exploredCar.horsepower}
                        </span>
                      </div>

                      <p className="text-xs text-[#555555]">
                        {exploredCar.description} · {exploredCar.engineText}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-4">
                <h3 className="text-sm font-extrabold text-[#111111] mb-2.5">
                  Select Trim
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {exploredCar.trims.map((trim) => {
                    const isSelected = configTrimId === trim.id;
                    return (
                      <button
                        key={trim.id}
                        type="button"
                        onClick={() => setConfigTrimId(trim.id)}
                        className={`p-3 rounded-[20px] text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#111111] text-white font-bold'
                            : 'border border-[#d4d4d4] bg-white text-[#222222] font-semibold hover:bg-[#f6f6f6]'
                        }`}
                      >
                        <div className="text-xs leading-snug">{trim.label}</div>
                        <div className="text-xs font-extrabold mt-2">
                          {trim.priceDelta === 0
                            ? 'Included'
                            : `+${formatGhs(trim.priceDelta)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-sm font-bold text-[#111111] mb-2.5">
                  Optional Showroom Extras
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEALERSHIP_EXTRAS.map((extra) => {
                    const isAdded = configExtras.includes(extra.id);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        onClick={() =>
                          setConfigExtras((prev) =>
                            prev.includes(extra.id)
                              ? prev.filter((id) => id !== extra.id)
                              : [...prev, extra.id]
                          )
                        }
                        className={`p-3 rounded-[18px] border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isAdded
                            ? 'border-[#111111] bg-[#f2f2f2]'
                            : 'border-[#e5e5e5] bg-white hover:border-[#111111]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#111111] truncate">
                            {extra.name}
                          </div>
                          <div className="text-xs text-[#555555]">
                            +{formatGhs(extra.price)}
                          </div>
                        </div>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            isAdded ? 'bg-[#111111] text-white' : 'bg-[#f2f2f2] text-[#111111]'
                          }`}
                        >
                          {isAdded ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct WhatsApp Inquiry Section inside Car Detail Card */}
              <div className="mt-5 rounded-[22px] bg-[#f8f8f8] border border-[#e5e5e5] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
                    Direct WhatsApp Inquiry ({showroomInfo.phone})
                  </span>
                  <span className="text-[11px] font-semibold text-[#666666]">
                    No account needed · Continue on WhatsApp
                  </span>
                </div>

                {/* Quick Inquiry Topic Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Check Availability & Price',
                    'Book Viewing at Tse Addo',
                    'Ask About Financing',
                    'Ready to Purchase',
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setCarInquiryTopic(topic)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        carInquiryTopic === topic
                          ? 'bg-[#111111] text-white'
                          : 'bg-white border border-[#d4d4d4] text-[#222222] hover:border-[#111111]'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                {/* Optional Customer Number */}
                <input
                  type="tel"
                  value={carInquiryPhone}
                  onChange={(e) => setCarInquiryPhone(e.target.value)}
                  placeholder="Your Phone / WhatsApp Number (optional, e.g. 024...)"
                  className="w-full px-4 py-2.5 rounded-[50px] border border-[#d4d4d4] bg-white text-xs sm:text-sm text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-[#e5e5e5] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-medium text-[#737373] block">
                    Total Price (Duty Paid)
                  </span>
                  <span className="text-lg font-black text-[#111111]">
                    {formatGhs(modalUnitTotal)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addCarToGarage(exploredCar, configTrimId, configExtras, false);
                      setExploredCar(null);
                    }}
                    className="px-4 py-3 rounded-[30px] border border-[#111111] bg-white hover:bg-[#f2f2f2] text-[#111111] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <GarageStallIcon className="w-4 h-4" />
                    <span>Add to Garage</span>
                  </button>

                  <a
                    href={buildSingleCarWhatsAppUrl(
                      exploredCar,
                      modalTrim?.label,
                      configExtras,
                      modalUnitTotal,
                      carInquiryTopic,
                      carInquiryPhone
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      showToast(`Opening WhatsApp for ${exploredCar.titleLine1}...`);
                    }}
                    className="px-5 py-3 rounded-[30px] bg-[#111111] hover:bg-[#2a2a2a] text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 shrink-0" />
                    <span>Inquire on WhatsApp →</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          QUICK MENU MODAL (No Personal Account Needed)
         ===================================================================== */}
      {activeNavModal === 'menu' && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-[30px] bg-white border border-[#d4d4d4] p-6 space-y-4 text-[#111111] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-3">
                <img
                  src={RY_LOGO_TRANSPARENT}
                  alt="RY WHEELS"
                  className="h-[32px] w-auto object-contain select-none shrink-0"
                />
                <h3 className="font-sans font-extrabold text-sm text-[#111111]">
                  Quick Menu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveNavModal(null)}
                className="w-8 h-8 rounded-full bg-[#f2f2f2] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-bold">
              {[
                { label: 'Welcome & News', action: () => setActivePage('welcome') },
                { label: 'Car Showroom (Tse Addo)', action: () => enterShowroom('all') },
                { label: 'EV Electric Showroom', action: () => enterShowroom('EV') },
                { label: 'Hybrid Cars Showroom', action: () => enterShowroom('Hybrid') },
                { label: 'Patrol & Petrol V8 Showroom', action: () => enterShowroom('Patrol / Petrol') },
                { label: 'Client Gallery & Workplaces', action: () => setActivePage('gallery') },
                { label: `Open Garage (${totalCartCount})`, action: () => handleOpenGarage() },
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveNavModal(null);
                    item.action();
                  }}
                  className="w-full text-left p-3 rounded-[18px] bg-[#f6f6f6] hover:bg-[#111111] hover:text-white text-[#111111] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={buildGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-[18px] bg-[#111111] text-white flex items-center justify-between transition-colors"
              >
                <span>Inquire on WhatsApp ({showroomInfo.phone})</span>
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={showroomInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-[18px] border border-[#d4d4d4] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-between transition-colors"
              >
                <span>Follow {showroomInfo.instagramHandle} on Instagram</span>
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
