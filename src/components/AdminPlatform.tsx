import React, { useState, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  Car,
  Camera,
  MessageSquare,
  Newspaper,
  ClipboardList,
  Settings,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  LogIn,
  LogOut,
  ExternalLink,
  Search,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ShowcaseCar,
  CarPhotoAngle,
  ClientGalleryPhoto,
  ClientReviewRecord,
  PromoSlide,
  ShowRoomLocationType,
  PowertrainCategory,
  patrolSuvWhiteImg,
  evCoupeImg,
  evSedanImg,
  carRearBacksideImg,
  interiorLeftImg,
  interiorCockpitYokeImg,
  clientHandoverPatrolImg,
  clientHandoverEvImg,
  clientHandoverHybridImg,
  clientHandoverBentleyImg,
} from './adminTypes';
import { NewsItemRecord, ReservationAdminItem } from './AdminControlSection';
import { ResilientImage } from './ResilientImage';
import { uploadAdminImageFile } from '../firebase';

const RY_LOGO_TRANSPARENT = '/assets/aistudio/_Logo_e05207a4.png';

interface AdminPlatformProps {
  onExitToStorefront: () => void;

  cars: ShowcaseCar[];
  onAddCar: (car: ShowcaseCar) => void;
  onUpdateCar: (carId: string, updated: Partial<ShowcaseCar>) => void;
  onUpdateCarPrice: (carId: string, newPriceNumeric: number) => void;
  onDeleteCar: (carId: string) => void;
  onResetCars: () => void;

  galleryPhotos: ClientGalleryPhoto[];
  onAddGalleryPhoto: (photo: Omit<ClientGalleryPhoto, 'id'>) => void;
  onUpdateGalleryPhoto?: (id: string, updated: Partial<ClientGalleryPhoto>) => void;
  onDeleteGalleryPhoto: (id: string) => void;

  reviews: ClientReviewRecord[];
  onToggleReviewVisibility: (id: string) => void;
  onDeleteReview: (id: string) => void;

  newsList: NewsItemRecord[];
  onAddNews: (news: Omit<NewsItemRecord, 'id'>) => void;
  onDeleteNews: (id: string) => void;

  promoSlides: PromoSlide[];
  onUpdatePromoSlide: (
    slideId: string,
    title: string,
    highlightPill: string,
    image?: string
  ) => void;

  reservations: ReservationAdminItem[];
  onUpdateReservationStatus: (orderId: string, newStatus: string) => void;
  onDeleteReservation: (orderId: string) => void;

  showroomInfo: ShowRoomLocationType;
  onUpdateShowroomInfo: (updated: ShowRoomLocationType) => void;

  adminUserEmail: string | null;
  onGoogleAdminSignIn: () => void;
  onAdminSignOut: () => void;
}

type AdminSectionId =
  | 'overview'
  | 'vehicles'
  | 'gallery'
  | 'reviews'
  | 'news'
  | 'reservations'
  | 'settings';

const VEHICLE_STUDIO_PRESETS = [
  { label: 'Patrol V8 SUV (White)', url: patrolSuvWhiteImg },
  { label: 'EV GT Coupe (White)', url: evCoupeImg },
  { label: 'EV Flagship Sedan', url: evSedanImg },
];

const GALLERY_HANDOVER_PRESETS = [
  { label: 'Patrol V8 Handover', url: clientHandoverPatrolImg },
  { label: 'EV Coupe Handover', url: clientHandoverEvImg },
  { label: 'Hybrid Sedan Delivery', url: clientHandoverHybridImg },
  { label: 'Executive GT Delivery', url: clientHandoverBentleyImg },
];

export function AdminPlatform({
  onExitToStorefront,
  cars,
  onAddCar,
  onUpdateCar,
  onUpdateCarPrice,
  onDeleteCar,
  onResetCars,
  galleryPhotos,
  onAddGalleryPhoto,
  onUpdateGalleryPhoto,
  onDeleteGalleryPhoto,
  reviews,
  onToggleReviewVisibility,
  onDeleteReview,
  newsList,
  onAddNews,
  onDeleteNews,
  promoSlides,
  onUpdatePromoSlide,
  reservations,
  onUpdateReservationStatus,
  onDeleteReservation,
  showroomInfo,
  onUpdateShowroomInfo,
  adminUserEmail,
  onGoogleAdminSignIn,
  onAdminSignOut,
}: AdminPlatformProps) {
  const [isPortalUnlocked, setIsPortalUnlocked] = useState<boolean>(true);
  const [adminUsernameInput, setAdminUsernameInput] = useState('admin@rywheels.com.gh');
  const [adminPinInput, setAdminPinInput] = useState('');

  const [activeSection, setActiveSection] = useState<AdminSectionId>('overview');
  const [fleetSearch, setFleetSearch] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [uploadingTargetId, setUploadingTargetId] = useState<string | null>(null);

  const vehicleFileInputRef = useRef<HTMLInputElement | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const notifyAdmin = (msg: string) => {
    setStatusNotice(msg);
    window.setTimeout(() => {
      setStatusNotice((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // --- Easy Vehicle Creation State (Direct Local Images + Condition + Multi-Angle Photos) ---
  const [newCarTitle1, setNewCarTitle1] = useState('');
  const [newCarTitle2, setNewCarTitle2] = useState('PEARL WHITE 2026');
  const [newCarPowertrain, setNewCarPowertrain] = useState<'EV' | 'Hybrid' | 'Patrol / Petrol'>('Patrol / Petrol');
  const [newCarCondition, setNewCarCondition] = useState('Brand New (0 km) · Factory Sealed · Accident-Free');
  const [newCarPrice, setNewCarPrice] = useState('1850000');
  const [newCarImage, setNewCarImage] = useState(patrolSuvWhiteImg);
  const [newCarBacksideImg, setNewCarBacksideImg] = useState(carRearBacksideImg);
  const [newCarInteriorImg, setNewCarInteriorImg] = useState(interiorLeftImg);
  const [newCarCockpitImg, setNewCarCockpitImg] = useState(interiorCockpitYokeImg);
  const [newCarUploadedBadge, setNewCarUploadedBadge] = useState<string | null>(null);
  const [showAdvancedCarSpecs, setShowAdvancedCarSpecs] = useState(false);
  const [newCarHp, setNewCarHp] = useState('520 hp');
  const [newCarZeroSixty, setNewCarZeroSixty] = useState('3.8s');
  const [newCarEngine, setNewCarEngine] = useState('Twin-Turbo V8 · Duty Paid');
  const [editingPriceMap, setEditingPriceMap] = useState<Record<string, string>>({});

  // --- Easy Gallery Creation State ---
  const [galClientName, setGalClientName] = useState('');
  const [galVehicleTitle, setGalVehicleTitle] = useState('');
  const [galPowertrain, setGalPowertrain] = useState<'EV' | 'Hybrid' | 'Patrol / Petrol'>('Patrol / Petrol');
  const [galLocation, setGalLocation] = useState('Tse Addo, Accra');
  const [galCaption, setGalCaption] = useState('');
  const [galImage, setGalImage] = useState(clientHandoverPatrolImg);
  const [galUploadedBadge, setGalUploadedBadge] = useState<string | null>(null);

  // --- News Form State ---
  const [newsTag, setNewsTag] = useState('SHOWROOM');
  const [newsDate, setNewsDate] = useState('2026');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsCategory, setNewsCategory] = useState<PowertrainCategory>('all');

  // --- Settings Form State ---
  const [locName, setLocName] = useState(showroomInfo.name);
  const [locAddress, setLocAddress] = useState(showroomInfo.fullAddress);
  const [locPhone, setLocPhone] = useState(showroomInfo.phone);
  const [locEmail, setLocEmail] = useState(showroomInfo.email);
  const [locHours, setLocHours] = useState(showroomInfo.hours);
  const [locIgHandle, setLocIgHandle] = useState(showroomInfo.instagramHandle);
  const [locIgUrl, setLocIgUrl] = useState(showroomInfo.instagramUrl);

  // --- KPIs ---
  const totalFleetValue = useMemo(
    () => cars.reduce((sum, c) => sum + c.priceNumeric, 0),
    [cars]
  );
  const publicReviewsCount = useMemo(
    () => reviews.filter((r) => r.visibility !== 'hidden').length,
    [reviews]
  );

  const filteredCars = useMemo(() => {
    if (!fleetSearch.trim()) return cars;
    const q = fleetSearch.toLowerCase();
    return cars.filter(
      (c) =>
        c.titleLine1.toLowerCase().includes(q) ||
        c.titleLine2.toLowerCase().includes(q) ||
        c.powertrain.toLowerCase().includes(q)
    );
  }, [cars, fleetSearch]);

  // =========================================================================
  // DIRECT LOCAL FILE UPLOAD HANDLERS (NO EXTERNAL STORAGE BUCKET)
  // =========================================================================
  const handleSelectLocalVehiclePhoto = async (
    slot: 'front' | 'backside' | 'interior' | 'cockpit',
    file?: File | null
  ) => {
    if (!file) return;
    setUploadingTargetId(`new-car-${slot}`);
    try {
      const localImg = await uploadAdminImageFile(file);
      if (slot === 'front') {
        setNewCarImage(localImg.url);
        setNewCarUploadedBadge(localImg.name);
      } else if (slot === 'backside') {
        setNewCarBacksideImg(localImg.url);
      } else if (slot === 'interior') {
        setNewCarInteriorImg(localImg.url);
      } else if (slot === 'cockpit') {
        setNewCarCockpitImg(localImg.url);
      }
      notifyAdmin(`Loaded ${slot} photo from your device`);
    } catch {
      notifyAdmin('Could not read image file.');
    } finally {
      setUploadingTargetId(null);
    }
  };

  const handleSelectPhotoForExistingCar = async (
    car: ShowcaseCar,
    angleIndex: number | 'main',
    file?: File | null
  ) => {
    if (!file) return;
    setUploadingTargetId(`car-${car.id}-${angleIndex}`);
    try {
      const localImg = await uploadAdminImageFile(file);
      const currentGallery: CarPhotoAngle[] =
        car.galleryImages && car.galleryImages.length >= 3
          ? [...car.galleryImages]
          : [
              { label: 'Front Exterior', url: car.image },
              { label: 'Backside / Rear', url: carRearBacksideImg },
              { label: 'Interior Cabin', url: interiorLeftImg },
              { label: 'Cockpit & Dash', url: interiorCockpitYokeImg },
            ];

      if (angleIndex === 'main' || angleIndex === 0) {
        currentGallery[0] = { label: 'Front Exterior', url: localImg.url };
        onUpdateCar(car.id, { image: localImg.url, galleryImages: currentGallery });
      } else {
        currentGallery[angleIndex] = {
          label: currentGallery[angleIndex]?.label || `View ${angleIndex + 1}`,
          url: localImg.url,
        };
        onUpdateCar(car.id, { galleryImages: currentGallery });
      }
      notifyAdmin(`Updated photo for ${car.titleLine1}`);
    } catch {
      notifyAdmin('Could not read vehicle photo.');
    } finally {
      setUploadingTargetId(null);
    }
  };

  const handleUploadForNewGallery = async (file?: File | null) => {
    if (!file) return;
    setUploadingTargetId('new-gallery');
    try {
      const localImg = await uploadAdminImageFile(file);
      setGalImage(localImg.url);
      setGalUploadedBadge(localImg.name);
      notifyAdmin(`Loaded "${localImg.name}" from device`);
    } catch {
      notifyAdmin('Could not read gallery photo.');
    } finally {
      setUploadingTargetId(null);
    }
  };

  const handleUploadForExistingGallery = async (
    item: ClientGalleryPhoto,
    file?: File | null
  ) => {
    if (!file || !onUpdateGalleryPhoto) return;
    setUploadingTargetId(`gal-${item.id}`);
    try {
      const localImg = await uploadAdminImageFile(file);
      onUpdateGalleryPhoto(item.id, { imageUrl: localImg.url });
      notifyAdmin(`Updated photo for ${item.clientName}`);
    } catch {
      notifyAdmin('Could not update gallery photo.');
    } finally {
      setUploadingTargetId(null);
    }
  };

  const handleUploadForPromoSlide = async (slide: PromoSlide, file?: File | null) => {
    if (!file) return;
    setUploadingTargetId(`slide-${slide.id}`);
    try {
      const localImg = await uploadAdminImageFile(file);
      onUpdatePromoSlide(slide.id, slide.title, slide.highlightPill, localImg.url);
      notifyAdmin(`Updated banner photo for "${slide.title}"`);
    } catch {
      notifyAdmin('Could not read banner image.');
    } finally {
      setUploadingTargetId(null);
    }
  };

  // =========================================================================
  // FORM SUBMISSION HANDLERS
  // =========================================================================
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarTitle1.trim()) return;
    const numeric = Math.max(1000, Number(newCarPrice.replace(/[^0-9]/g, '')) || 1650000);
    const created: ShowcaseCar = {
      id: `ry-custom-${Date.now()}`,
      brandId: 'jaguar',
      titleLine1: newCarTitle1.trim().toUpperCase(),
      titleLine2: newCarTitle2.trim().toUpperCase() || '2026 EDITION',
      powertrain: newCarPowertrain,
      condition: newCarCondition.trim() || 'Brand New (0 km) · Duty Paid',
      galleryImages: [
        { label: 'Front Exterior', url: newCarImage || patrolSuvWhiteImg },
        { label: 'Backside / Rear', url: newCarBacksideImg || carRearBacksideImg },
        { label: 'Interior Cabin', url: newCarInteriorImg || interiorLeftImg },
        { label: 'Cockpit & Dash', url: newCarCockpitImg || interiorCockpitYokeImg },
      ],
      isPackage: true,
      priceText: `GH₵ ${numeric.toLocaleString()}`,
      priceNumeric: numeric,
      typeText: `${newCarPowertrain} Luxury Vehicle`,
      engineText: newCarEngine.trim(),
      fuelEconomyOrRange: 'Tse Addo Showroom',
      thresholdOffer: 'Tse Addo High Street · Duty Paid',
      image: newCarImage || patrolSuvWhiteImg,
      tagCategory: ['latest', 'featured'],
      zeroToSixty: newCarZeroSixty.trim() || '3.9s',
      topSpeed: '260 km/h',
      horsepower: newCarHp.trim() || '500 hp',
      transmission: 'Automatic AWD',
      description: `${newCarTitle1.trim()} · ${newCarCondition.trim()}`,
      trims: [
        { id: 'std-spec', label: 'Standard Spec', sublabel: newCarHp, priceDelta: 0 },
        { id: 'vip-spec', label: 'Executive Reserve', sublabel: 'Bespoke Trim', priceDelta: 140000 },
      ],
    };
    onAddCar(created);
    setNewCarTitle1('');
    setNewCarUploadedBadge(null);
    notifyAdmin(`Published "${created.titleLine1}" to Showroom!`);
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galClientName.trim() || !galVehicleTitle.trim()) return;
    onAddGalleryPhoto({
      clientName: galClientName.trim(),
      vehicleTitle: galVehicleTitle.trim(),
      powertrain: galPowertrain,
      locationTag: galLocation.trim() || 'Tse Addo, Accra',
      deliveredDate: '2026',
      caption:
        galCaption.trim() || `Handover at Tse Addo High Street, Accra.`,
      imageUrl: galImage || clientHandoverPatrolImg,
      visibility: 'public',
    });
    setGalClientName('');
    setGalVehicleTitle('');
    setGalCaption('');
    setGalUploadedBadge(null);
    notifyAdmin(`Published ${galClientName.trim()} to Gallery!`);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;
    onAddNews({
      tag: newsTag.trim() || 'SHOWROOM',
      date: newsDate.trim() || '2026',
      title: newsTitle.trim(),
      summary: newsSummary.trim(),
      actionLabel: 'Browse Showroom',
      targetCategory: newsCategory,
    });
    setNewsTitle('');
    setNewsSummary('');
    notifyAdmin('Published news update!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShowroomInfo({
      ...showroomInfo,
      name: locName.trim() || showroomInfo.name,
      fullAddress: locAddress.trim() || showroomInfo.fullAddress,
      phone: locPhone.trim() || showroomInfo.phone,
      email: locEmail.trim() || showroomInfo.email,
      hours: locHours.trim() || showroomInfo.hours,
      instagramHandle: locIgHandle.trim() || showroomInfo.instagramHandle,
      instagramUrl: locIgUrl.trim() || showroomInfo.instagramUrl,
    });
    notifyAdmin('Showroom settings updated!');
  };

  if (!isPortalUnlocked) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center p-4 selection:bg-white selection:text-[#111111]">
        <div className="w-full max-w-[420px] rounded-[32px] bg-[#161616] border border-white/15 p-7 sm:p-9 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-[#111111] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-sans font-extrabold text-lg tracking-wide uppercase text-white">
                  RY WHEELS ADMIN
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={onExitToStorefront}
              className="px-3.5 py-1.5 rounded-full border border-white/20 hover:bg-white hover:text-[#111111] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              ← Storefront
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsPortalUnlocked(true);
              notifyAdmin('Admin Console Unlocked');
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/75">
                Admin Email
              </label>
              <input
                type="text"
                value={adminUsernameInput}
                onChange={(e) => setAdminUsernameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#0d0d0d] border border-white/20 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-white/75">
                Passcode (Optional)
              </label>
              <input
                type="password"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                placeholder="Click Unlock below to enter"
                className="w-full px-4 py-3 rounded-2xl bg-[#0d0d0d] border border-white/20 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-[#e5e5e5] text-[#111111] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Unlock Admin Workspace →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN STANDALONE BACK-OFFICE MANAGEMENT PLATFORM (NO SEPARATE STORAGE TAB)
  // =========================================================================
  const navItems: {
    id: AdminSectionId;
    label: string;
    subtitle: string;
    count?: number;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'overview',
      label: 'Quick Overview',
      subtitle: '1-Click Shortcuts',
      icon: LayoutDashboard,
    },
    {
      id: 'vehicles',
      label: 'Showroom Cars',
      subtitle: 'Photos, Condition & Prices',
      count: cars.length,
      icon: Car,
    },
    {
      id: 'gallery',
      label: 'Client Gallery',
      subtitle: 'Handover Photos',
      count: galleryPhotos.length,
      icon: Camera,
    },
    {
      id: 'reviews',
      label: 'Client Reviews',
      subtitle: 'Moderate Feedback',
      count: reviews.length,
      icon: MessageSquare,
    },
    {
      id: 'news',
      label: 'Banners & News',
      subtitle: 'Hero Slideshow',
      count: newsList.length,
      icon: Newspaper,
    },
    {
      id: 'reservations',
      label: 'Orders & Bookings',
      subtitle: 'Customer Pickups',
      count: reservations.length,
      icon: ClipboardList,
    },
    {
      id: 'settings',
      label: 'Showroom Info',
      subtitle: 'Tse Addo Contact',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col lg:flex-row selection:bg-white selection:text-[#111111]">
      {/* Floating Status Toast */}
      {statusNotice && (
        <div className="fixed top-5 right-5 z-[999] bg-[#111111] text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-2.5 border-2 border-white">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="text-xs font-extrabold">{statusNotice}</span>
        </div>
      )}

      {/* =====================================================================
          LEFT SIDEBAR — DEDICATED ADMIN CMS NAVIGATION
         ===================================================================== */}
      <aside className="w-full lg:w-[275px] bg-[#0b0b0b] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between shrink-0">
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                <img
                  src={RY_LOGO_TRANSPARENT}
                  alt="RY WHEELS"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-sans font-extrabold text-sm tracking-wider uppercase text-white">
                  RY WHEELS ADMIN
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                  MANAGEMENT CONSOLE
                </div>
              </div>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white text-[#111111] shadow-md'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold whitespace-nowrap">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] hidden lg:block truncate ${
                          isActive ? 'text-[#555555]' : 'text-white/45'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-[#111111] text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5 sm:p-6 border-t border-white/10 space-y-3 bg-[#080808]">
          {adminUserEmail ? (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-xs font-bold text-white truncate block">
                  {adminUserEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={onAdminSignOut}
                className="p-2 rounded-xl bg-white/10 hover:bg-white hover:text-[#111111] text-white transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onGoogleAdminSignIn}
              className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Admin Sign-In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onExitToStorefront}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-[#e5e5e5] text-[#111111] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
          >
            <span>Back to Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* =====================================================================
          RIGHT MAIN WORKSPACE — EASY BACK-OFFICE CMS CONTENT
         ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f4f4] text-[#111111]">
        <header className="min-h-[68px] bg-white border-b border-[#e5e5e5] px-6 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="font-sans font-extrabold text-base sm:text-lg text-[#111111] uppercase">
              {navItems.find((n) => n.id === activeSection)?.label}
            </h1>
            <p className="text-xs text-[#666666]">
              {showroomInfo.fullAddress}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPortalUnlocked(false)}
              className="px-3 py-2 rounded-xl border border-[#d4d4d4] bg-white hover:bg-[#f2f2f2] text-xs font-bold text-[#111111] flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock</span>
            </button>
            <button
              type="button"
              onClick={onExitToStorefront}
              className="px-4 py-2 rounded-xl bg-[#111111] hover:bg-[#262626] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 overflow-y-auto space-y-6 max-w-[1400px] w-full mx-auto">
          {/* =================================================================
              SECTION 1: EASY QUICK-START OVERVIEW
             ================================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-[#111111] text-white p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                  <h2 className="font-sans font-extrabold text-xl sm:text-2xl uppercase">
                    RY WHEELS Management Console
                  </h2>
                  <p className="text-xs sm:text-sm text-white/75">
                    Select photos directly from your local device to add vehicles, update multi-angle views (front, backside, interior), set car condition, or post client handovers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveSection('vehicles')}
                    className="px-5 py-3 rounded-2xl bg-white text-[#111111] hover:bg-[#e5e5e5] text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add or Edit Cars</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('gallery')}
                    className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Add Client Photo</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveSection('vehicles')}
                  className="rounded-2xl bg-white border border-[#e5e5e5] hover:border-[#111111] p-5 space-y-1 transition-all cursor-pointer"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                    Showroom Inventory
                  </span>
                  <div className="font-sans font-extrabold text-2xl text-[#111111]">
                    {cars.length} Vehicles
                  </div>
                  <p className="text-xs text-[#555555]">
                    Total: GH₵ {totalFleetValue.toLocaleString()}
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection('gallery')}
                  className="rounded-2xl bg-white border border-[#e5e5e5] hover:border-[#111111] p-5 space-y-1 transition-all cursor-pointer"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                    Client Gallery
                  </span>
                  <div className="font-sans font-extrabold text-2xl text-[#111111]">
                    {galleryPhotos.length} Photos
                  </div>
                  <p className="text-xs text-[#555555]">
                    Tse Addo Deliveries
                  </p>
                </div>

                <div
                  onClick={() => setActiveSection('reservations')}
                  className="rounded-2xl bg-white border border-[#e5e5e5] hover:border-[#111111] p-5 space-y-1 transition-all cursor-pointer"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                    Customer Bookings
                  </span>
                  <div className="font-sans font-extrabold text-2xl text-[#111111]">
                    {reservations.length} Orders
                  </div>
                  <p className="text-xs text-[#555555]">
                    {publicReviewsCount} Public Reviews
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 2: SHOWROOM FLEET CMS (DIRECT LOCAL PHOTOS + CONDITION)
             ================================================================= */}
          {activeSection === 'vehicles' && (
            <div className="space-y-6">
              <form
                onSubmit={handleCreateVehicle}
                className="rounded-3xl bg-white border-2 border-[#111111] p-6 sm:p-7 space-y-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5e5] pb-4">
                  <div>
                    <h2 className="font-sans font-extrabold text-base sm:text-lg uppercase text-[#111111]">
                      Add a Vehicle to Showroom
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Select photos directly from your local device (Front, Backside, Interior &amp; Cockpit) and set the vehicle condition.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onResetCars();
                      notifyAdmin('Default showroom fleet restored');
                    }}
                    className="px-3.5 py-2 rounded-xl border border-[#d4d4d4] hover:border-[#111111] text-xs font-bold text-[#111111] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Defaults</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* LEFT: DIRECT LOCAL PHOTO PICKERS (FRONT, BACKSIDE, INTERIOR, COCKPIT) */}
                  <div className="lg:col-span-5 space-y-3">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#111111] block">
                      1 · Select Vehicle Photos from Local Device
                    </label>

                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const droppedFile = e.dataTransfer.files?.[0];
                        if (droppedFile) handleSelectLocalVehiclePhoto('front', droppedFile);
                      }}
                      onClick={() => vehicleFileInputRef.current?.click()}
                      className="relative rounded-2xl border-2 border-dashed border-[#111111] bg-[#f8f8f8] hover:bg-[#f0f0f0] p-4 flex flex-col items-center justify-center gap-2.5 text-center transition-all cursor-pointer"
                    >
                      <input
                        ref={vehicleFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSelectLocalVehiclePhoto('front', file);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />

                      <div className="w-full h-28 rounded-xl bg-white border border-[#e5e5e5] overflow-hidden flex items-center justify-center">
                        <ResilientImage
                          src={newCarImage}
                          alt="Front Exterior Preview"
                          className="w-full h-full object-contain p-1.5"
                        />
                      </div>

                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-extrabold">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingTargetId === 'new-car-front'
                            ? 'Reading...'
                            : 'Select Main Front Photo from Device'}
                        </span>
                      </div>

                      {newCarUploadedBadge && (
                        <span className="text-[11px] font-bold text-[#111111]">
                          ✓ {newCarUploadedBadge}
                        </span>
                      )}
                    </div>

                    {/* Additional Angles: Backside / Rear, Interior, Cockpit */}
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { slot: 'backside', label: 'Backside / Rear', img: newCarBacksideImg },
                          { slot: 'interior', label: 'Interior Cabin', img: newCarInteriorImg },
                          { slot: 'cockpit', label: 'Cockpit View', img: newCarCockpitImg },
                        ] as const
                      ).map((angle) => (
                        <label
                          key={angle.slot}
                          className="rounded-xl border border-[#d4d4d4] hover:border-[#111111] bg-white p-2 flex flex-col items-center gap-1.5 cursor-pointer text-center"
                        >
                          <div className="w-full h-14 rounded-lg overflow-hidden bg-[#f4f4f4]">
                            <ResilientImage
                              src={angle.img}
                              alt={angle.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[10px] font-extrabold text-[#111111] leading-tight">
                            + {angle.label}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleSelectLocalVehiclePhoto(angle.slot, f);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>

                    {/* Quick Studio Presets */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {VEHICLE_STUDIO_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setNewCarImage(preset.url);
                            setNewCarUploadedBadge(null);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            newCarImage === preset.url
                              ? 'border-[#111111] bg-[#111111] text-white'
                              : 'border-[#d4d4d4] bg-white text-[#111111]'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-6 h-4 object-cover rounded"
                          />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: VEHICLE NAME, CONDITION & PRICE */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#555555]">
                          Vehicle Model Name *
                        </span>
                        <input
                          type="text"
                          required
                          value={newCarTitle1}
                          onChange={(e) => setNewCarTitle1(e.target.value)}
                          placeholder="e.g. NISSAN PATROL V8"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] focus:border-[#111111] focus:outline-none text-sm font-bold text-[#111111]"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-[#555555]">
                          Edition / Year
                        </span>
                        <input
                          type="text"
                          value={newCarTitle2}
                          onChange={(e) => setNewCarTitle2(e.target.value)}
                          placeholder="PEARL WHITE 2026"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] focus:border-[#111111] focus:outline-none text-sm text-[#111111]"
                        />
                      </div>
                    </div>

                    {/* Vehicle Condition Input + Quick Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-[#555555] block">
                        Vehicle Condition *
                      </span>
                      <input
                        type="text"
                        value={newCarCondition}
                        onChange={(e) => setNewCarCondition(e.target.value)}
                        placeholder="e.g. Brand New (0 km) · Factory Sealed · Accident-Free"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] focus:border-[#111111] focus:outline-none text-xs sm:text-sm font-bold text-[#111111]"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Brand New (0 km) · Factory Sealed · Accident-Free',
                          'Foreign Used (Mint Grade A) · Original Paint',
                          'Showroom Demo · Mint Condition · Duty Paid',
                        ].map((cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setNewCarCondition(cond)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                              newCarCondition === cond
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'bg-[#f8f8f8] text-[#111111] border-[#d4d4d4]'
                            }`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Powertrain Category */}
                    <div className="grid grid-cols-3 gap-2">
                      {(['Patrol / Petrol', 'EV', 'Hybrid'] as const).map((pt) => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setNewCarPowertrain(pt)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                            newCarPowertrain === pt
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-[#f8f8f8] text-[#111111] border-[#d4d4d4]'
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>

                    {/* Price in Ghana Cedis */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-[#555555] block">
                        Price in Ghana Cedis (GH₵)
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          required
                          value={newCarPrice}
                          onChange={(e) => setNewCarPrice(e.target.value)}
                          placeholder="1850000"
                          className="flex-1 min-w-[160px] px-4 py-2.5 rounded-xl border border-[#d4d4d4] text-sm font-black text-[#111111]"
                        />
                        {[
                          { label: 'GH₵ 1.2M', val: '1200000' },
                          { label: 'GH₵ 1.85M', val: '1850000' },
                          { label: 'GH₵ 2.4M', val: '2400000' },
                        ].map((preset) => (
                          <button
                            key={preset.val}
                            type="button"
                            onClick={() => setNewCarPrice(preset.val)}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer ${
                              newCarPrice === preset.val
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'bg-white text-[#111111] border-[#d4d4d4]'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => setShowAdvancedCarSpecs((prev) => !prev)}
                        className="text-xs font-bold text-[#555555] hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                      >
                        {showAdvancedCarSpecs ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        <span>Optional: Engine &amp; Horsepower Specs</span>
                      </button>

                      {showAdvancedCarSpecs && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2.5 p-3.5 rounded-2xl bg-[#f8f8f8] border border-[#e5e5e5]">
                          <input
                            type="text"
                            value={newCarHp}
                            onChange={(e) => setNewCarHp(e.target.value)}
                            placeholder="Horsepower"
                            className="px-3 py-2 rounded-lg border border-[#d4d4d4] bg-white text-xs text-[#111111]"
                          />
                          <input
                            type="text"
                            value={newCarZeroSixty}
                            onChange={(e) => setNewCarZeroSixty(e.target.value)}
                            placeholder="0–60 Time"
                            className="px-3 py-2 rounded-lg border border-[#d4d4d4] bg-white text-xs text-[#111111]"
                          />
                          <input
                            type="text"
                            value={newCarEngine}
                            onChange={(e) => setNewCarEngine(e.target.value)}
                            placeholder="Engine Summary"
                            className="px-3 py-2 rounded-lg border border-[#d4d4d4] bg-white text-xs text-[#111111]"
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-[#262626] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish Vehicle to Showroom</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* EXISTING SHOWROOM FLEET — EDIT PHOTOS (FRONT, BACKSIDE, INTERIOR), CONDITION & PRICE */}
              <div className="rounded-3xl bg-white border border-[#e5e5e5] p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-sans font-extrabold text-sm sm:text-base uppercase text-[#111111]">
                      Showroom Vehicles ({filteredCars.length})
                    </h3>
                    <p className="text-xs text-[#666666]">
                      Select local photos for Front, Backside, or Interior, edit Condition, or adjust GH₵ price.
                    </p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={fleetSearch}
                      onChange={(e) => setFleetSearch(e.target.value)}
                      placeholder="Search vehicles..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#d4d4d4] text-xs text-[#111111]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCars.map((car) => {
                    const draftPrice =
                      editingPriceMap[car.id] !== undefined
                        ? editingPriceMap[car.id]
                        : String(car.priceNumeric);

                    return (
                      <div
                        key={car.id}
                        className="rounded-2xl border border-[#e5e5e5] hover:border-[#111111] p-4 flex flex-col justify-between gap-3.5 transition-all bg-[#fafafa]"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="relative w-28 h-24 rounded-xl bg-white border border-[#e5e5e5] overflow-hidden shrink-0">
                            <ResilientImage
                              src={car.image}
                              alt={car.titleLine1}
                              className="w-full h-full object-cover"
                            />
                            <label className="absolute inset-x-1 bottom-1 py-1 px-1.5 rounded-lg bg-[#111111]/90 hover:bg-[#111111] text-white text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer">
                              <Upload className="w-3 h-3" />
                              <span>Main Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleSelectPhotoForExistingCar(car, 'main', f);
                                  e.target.value = '';
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <select
                                value={car.powertrain}
                                onChange={(e) => {
                                  onUpdateCar(car.id, {
                                    powertrain: e.target.value as
                                      | 'EV'
                                      | 'Hybrid'
                                      | 'Patrol / Petrol',
                                  });
                                  notifyAdmin(`Updated ${car.titleLine1}`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#111111] text-white text-[10px] font-extrabold uppercase cursor-pointer"
                              >
                                <option value="Patrol / Petrol">Patrol / Petrol</option>
                                <option value="EV">EV Electric</option>
                                <option value="Hybrid">Hybrid</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteCar(car.id);
                                  notifyAdmin(`Removed ${car.titleLine1}`);
                                }}
                                className="p-1.5 rounded-lg bg-white border border-[#e5e5e5] hover:bg-[#111111] hover:text-white text-[#111111] transition-colors cursor-pointer"
                                title="Delete Vehicle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={car.titleLine1}
                              onChange={(e) =>
                                onUpdateCar(car.id, { titleLine1: e.target.value.toUpperCase() })
                              }
                              className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#e5e5e5] font-sans font-extrabold text-xs text-[#111111]"
                            />

                            {/* Editable Condition */}
                            <input
                              type="text"
                              value={car.condition || 'Brand New (0 km) · Duty Paid'}
                              onChange={(e) =>
                                onUpdateCar(car.id, { condition: e.target.value })
                              }
                              placeholder="Condition (e.g. Brand New / Foreign Used)"
                              className="w-full px-2.5 py-1 rounded-lg bg-white border border-[#e5e5e5] text-[11px] font-semibold text-[#444444]"
                            />
                          </div>
                        </div>

                        {/* Upload Additional Views (Backside / Interior / Cockpit) from Local Device */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { idx: 1, label: 'Backside Photo' },
                            { idx: 2, label: 'Interior Photo' },
                            { idx: 3, label: 'Cockpit Photo' },
                          ].map((angle) => (
                            <label
                              key={angle.idx}
                              className="py-1.5 px-2 rounded-lg bg-white border border-[#d4d4d4] hover:border-[#111111] text-[10px] font-bold text-[#111111] flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Upload className="w-3 h-3 shrink-0" />
                              <span className="truncate">{angle.label}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleSelectPhotoForExistingCar(car, angle.idx, f);
                                  e.target.value = '';
                                }}
                                className="hidden"
                              />
                            </label>
                          ))}
                        </div>

                        {/* Price Adjustment Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#e5e5e5]">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const next = Math.max(50000, car.priceNumeric - 50000);
                                onUpdateCarPrice(car.id, next);
                                setEditingPriceMap((prev) => ({
                                  ...prev,
                                  [car.id]: String(next),
                                }));
                                notifyAdmin(`Updated ${car.titleLine1} price`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#d4d4d4] hover:border-[#111111] text-[11px] font-extrabold text-[#111111] cursor-pointer"
                            >
                              -50k
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const next = car.priceNumeric + 50000;
                                onUpdateCarPrice(car.id, next);
                                setEditingPriceMap((prev) => ({
                                  ...prev,
                                  [car.id]: String(next),
                                }));
                                notifyAdmin(`Updated ${car.titleLine1} price`);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#d4d4d4] hover:border-[#111111] text-[11px] font-extrabold text-[#111111] cursor-pointer"
                            >
                              +50k
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 flex-1 justify-end">
                            <input
                              type="number"
                              value={draftPrice}
                              onChange={(e) =>
                                setEditingPriceMap((prev) => ({
                                  ...prev,
                                  [car.id]: e.target.value,
                                }))
                              }
                              className="w-32 px-3 py-1.5 rounded-lg bg-white border border-[#d4d4d4] text-xs font-extrabold text-[#111111]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const val = Number(draftPrice);
                                if (val >= 1000) {
                                  onUpdateCarPrice(car.id, val);
                                  notifyAdmin(`Saved ${car.titleLine1} price`);
                                }
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-[#111111] text-white text-xs font-extrabold cursor-pointer"
                            >
                              Save GH₵
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 3: CLIENT GALLERY CMS (DIRECT LOCAL FILE SELECTION)
             ================================================================= */}
          {activeSection === 'gallery' && (
            <div className="space-y-6">
              <form
                onSubmit={handleCreateGalleryItem}
                className="rounded-3xl bg-white border-2 border-[#111111] p-6 sm:p-7 space-y-5 shadow-sm"
              >
                <div className="border-b border-[#e5e5e5] pb-3">
                  <h2 className="font-sans font-extrabold text-base sm:text-lg uppercase text-[#111111]">
                    Add Client Handover Photo
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 space-y-3">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const f = e.dataTransfer.files?.[0];
                        if (f) handleUploadForNewGallery(f);
                      }}
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="rounded-2xl border-2 border-dashed border-[#111111] bg-[#f8f8f8] hover:bg-[#f0f0f0] p-4 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer"
                    >
                      <input
                        ref={galleryFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadForNewGallery(f);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />

                      <div className="w-full h-36 rounded-xl overflow-hidden bg-white border border-[#e5e5e5]">
                        <ResilientImage
                          src={galImage}
                          alt="Client Handover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-extrabold">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingTargetId === 'new-gallery'
                            ? 'Reading...'
                            : 'Select Photo from Local Device'}
                        </span>
                      </div>

                      {galUploadedBadge && (
                        <span className="text-[11px] font-bold text-[#111111]">
                          ✓ {galUploadedBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {GALLERY_HANDOVER_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setGalImage(preset.url);
                            setGalUploadedBadge(null);
                          }}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
                            galImage === preset.url
                              ? 'border-[#111111] bg-[#111111] text-white'
                              : 'border-[#d4d4d4] bg-white text-[#111111]'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-6 h-5 object-cover rounded"
                          />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#555555]">
                          Client Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={galClientName}
                          onChange={(e) => setGalClientName(e.target.value)}
                          placeholder="e.g. Nana Kwame Osei"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] text-sm font-bold text-[#111111]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#555555]">
                          Vehicle Delivered *
                        </label>
                        <input
                          type="text"
                          required
                          value={galVehicleTitle}
                          onChange={(e) => setGalVehicleTitle(e.target.value)}
                          placeholder="e.g. 2026 Patrol V8 Platinum"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] text-sm font-bold text-[#111111]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#555555]">
                          Powertrain
                        </label>
                        <select
                          value={galPowertrain}
                          onChange={(e) =>
                            setGalPowertrain(
                              e.target.value as 'EV' | 'Hybrid' | 'Patrol / Petrol'
                            )
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] bg-white text-xs font-extrabold text-[#111111]"
                        >
                          <option value="Patrol / Petrol">Patrol / Petrol</option>
                          <option value="EV">EV Electric</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-[#555555]">
                          Location
                        </label>
                        <input
                          type="text"
                          value={galLocation}
                          onChange={(e) => setGalLocation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#555555]">
                        Short Caption (Optional)
                      </label>
                      <input
                        type="text"
                        value={galCaption}
                        onChange={(e) => setGalCaption(e.target.value)}
                        placeholder="Handover at Tse Addo High Street, Accra."
                        className="w-full px-4 py-2.5 rounded-xl border border-[#d4d4d4] text-xs text-[#111111]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#111111] hover:bg-[#262626] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish Handover Photo</span>
                    </button>
                  </div>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {galleryPhotos.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white border border-[#e5e5e5] overflow-hidden flex flex-col justify-between"
                  >
                    <div className="h-44 w-full bg-[#f2f2f2] relative">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={item.clientName}
                        className="w-full h-full object-cover"
                      />
                      {onUpdateGalleryPhoto && (
                        <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-[#111111]/90 hover:bg-[#111111] text-white text-[10px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md">
                          <Upload className="w-3 h-3" />
                          <span>Replace Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadForExistingGallery(item, f);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="font-extrabold text-xs text-[#111111]">
                        {item.clientName}
                      </div>
                      <div className="text-[11px] font-semibold text-[#555555]">
                        {item.vehicleTitle}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteGalleryPhoto(item.id);
                          notifyAdmin('Gallery photo deleted');
                        }}
                        className="w-full mt-2 py-2 rounded-xl bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 4: CLIENT REVIEWS MODERATION
             ================================================================= */}
          {activeSection === 'reviews' && (
            <div className="rounded-3xl bg-white border border-[#e5e5e5] p-6 space-y-4">
              <h2 className="font-sans font-extrabold text-sm uppercase text-[#111111]">
                Customer Reviews ({reviews.length})
              </h2>
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-[#e5e5e5] p-4 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 max-w-2xl">
                      {rev.clientPhotoUrl && (
                        <img
                          src={rev.clientPhotoUrl}
                          alt={rev.clientName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-xs text-[#111111]">
                            {rev.clientName}
                          </span>
                          <span className="text-[11px] text-[#666666]">
                            ({rev.clientLocation})
                          </span>
                          {rev.visibility === 'hidden' && (
                            <span className="px-2 py-0.5 rounded-full border border-[#111111] text-[#111111] text-[10px] font-bold uppercase">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#444444]">&ldquo;{rev.comment}&rdquo;</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onToggleReviewVisibility(rev.id);
                          notifyAdmin(
                            rev.visibility === 'hidden'
                              ? 'Review made public'
                              : 'Review hidden'
                          );
                        }}
                        className="px-3.5 py-2 rounded-xl border border-[#d4d4d4] hover:border-[#111111] text-xs font-bold text-[#111111] flex items-center gap-1.5 cursor-pointer"
                      >
                        {rev.visibility === 'hidden' ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hide</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onDeleteReview(rev.id);
                          notifyAdmin('Review deleted');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 5: SLIDESHOW BANNERS & NEWS
             ================================================================= */}
          {activeSection === 'news' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-[#e5e5e5] p-6 space-y-4">
                <h2 className="font-sans font-extrabold text-sm uppercase text-[#111111]">
                  2026 Slideshow Banners
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {promoSlides.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className="rounded-2xl border border-[#e5e5e5] overflow-hidden bg-[#fafafa] flex flex-col justify-between"
                    >
                      <div className="h-36 w-full bg-[#111111] relative">
                        <ResilientImage
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white text-[#111111] text-[10px] font-extrabold">
                          SLIDE 0{idx + 1}
                        </span>
                        <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-white text-[#111111] text-[10px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md">
                          <Upload className="w-3 h-3" />
                          <span>Select Banner Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadForPromoSlide(slide, f);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) =>
                            onUpdatePromoSlide(slide.id, e.target.value, slide.highlightPill)
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4d4d4] text-xs font-extrabold text-[#111111]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form
                  onSubmit={handleCreateNews}
                  className="lg:col-span-5 rounded-3xl bg-white border border-[#e5e5e5] p-6 space-y-3.5"
                >
                  <h2 className="font-sans font-extrabold text-sm uppercase text-[#111111]">
                    Post News Card
                  </h2>
                  <input
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="Short Headline *"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                  />
                  <input
                    type="text"
                    required
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    placeholder="1-Line Summary *"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs text-[#111111]"
                  />
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      value={newsTag}
                      onChange={(e) => setNewsTag(e.target.value)}
                      placeholder="Tag"
                      className="px-3.5 py-2 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                    />
                    <select
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value as PowertrainCategory)}
                      className="px-3.5 py-2 rounded-xl border border-[#d4d4d4] bg-white text-xs font-bold text-[#111111]"
                    >
                      <option value="all">All Vehicles</option>
                      <option value="EV">EV Electric</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Patrol / Petrol">Patrol / Petrol</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#111111] text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer"
                  >
                    + Publish News Card
                  </button>
                </form>

                <div className="lg:col-span-7 rounded-3xl bg-white border border-[#e5e5e5] p-6 space-y-3">
                  <h2 className="font-sans font-extrabold text-sm uppercase text-[#111111]">
                    Active News Cards ({newsList.length})
                  </h2>
                  {newsList.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-xl border border-[#e5e5e5] p-4 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-[#111111]">{n.title}</h4>
                        <p className="text-xs text-[#666666]">{n.summary}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteNews(n.id);
                          notifyAdmin('News card deleted');
                        }}
                        className="p-2 rounded-lg bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 6: CUSTOMER RESERVATIONS & ORDERS
             ================================================================= */}
          {activeSection === 'reservations' && (
            <div className="rounded-3xl bg-white border border-[#e5e5e5] p-6 space-y-4">
              <h2 className="font-sans font-extrabold text-sm uppercase text-[#111111]">
                Customer Reservations ({reservations.length})
              </h2>
              <div className="space-y-3">
                {reservations.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[#e5e5e5] p-5 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans font-black text-sm text-[#111111]">
                          #{order.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#111111] text-white text-[10px] font-bold">
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#333333]">
                        {order.buyerName} · {order.buyerPhone}
                      </div>
                      <div className="text-xs font-extrabold text-[#111111]">
                        Total: GH₵ {order.totalAmount.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        'Ready at Tse Addo Showroom',
                        'Out for Accra Delivery',
                        'Completed & Handed Over',
                      ].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            onUpdateReservationStatus(order.id, st);
                            notifyAdmin(`Order #${order.id} updated`);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                            order.status === st
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-white text-[#111111] border-[#d4d4d4]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteReservation(order.id);
                          notifyAdmin(`Order #${order.id} deleted`);
                        }}
                        className="p-2 rounded-xl bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 7: SHOWROOM LOCATION & CONTACT SETTINGS
             ================================================================= */}
          {activeSection === 'settings' && (
            <form
              onSubmit={handleSaveSettings}
              className="rounded-3xl bg-white border border-[#e5e5e5] p-6 sm:p-8 max-w-3xl space-y-5"
            >
              <div className="border-b border-[#e5e5e5] pb-3">
                <h2 className="font-sans font-extrabold text-base uppercase text-[#111111]">
                  Tse Addo High Street Showroom Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111]">Showroom Name</label>
                  <input
                    type="text"
                    value={locName}
                    onChange={(e) => setLocName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111]">Street Address</label>
                  <input
                    type="text"
                    value={locAddress}
                    onChange={(e) => setLocAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111]">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={locPhone}
                    onChange={(e) => setLocPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111]">Email</label>
                  <input
                    type="text"
                    value={locEmail}
                    onChange={(e) => setLocEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111]">Opening Hours</label>
                  <input
                    type="text"
                    value={locHours}
                    onChange={(e) => setLocHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#111111]">Instagram Handle</label>
                  <input
                    type="text"
                    value={locIgHandle}
                    onChange={(e) => setLocIgHandle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-[#111111] text-white text-xs font-extrabold uppercase tracking-wider cursor-pointer"
              >
                Save Showroom Settings
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
