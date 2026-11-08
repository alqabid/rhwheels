import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  LogIn,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import {
  ShowcaseCar,
  ClientGalleryPhoto,
  ClientReviewRecord,
  PromoSlide,
   ShowRoomLocationType,
  PowertrainCategory,
  patrolSuvWhiteImg,
  evCoupeImg,
  evSedanImg,
  clientHandoverPatrolImg,
  clientHandoverEvImg,
  clientHandoverHybridImg,
  clientHandoverBentleyImg,
} from './adminTypes';

export interface NewsItemRecord {
  id: string;
  tag: string;
  date: string;
  title: string;
  summary: string;
  actionLabel: string;
  targetCategory: PowertrainCategory;
}

export interface ReservationAdminItem {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  totalAmount: number;
  locationName: string;
  deliveryMode: 'pickup' | 'delivery';
  createdAt: string;
  status: string;
  vehicleSummary: string;
}

interface AdminControlSectionProps {
  cars: ShowcaseCar[];
  onAddCar: (car: ShowcaseCar) => void;
  onUpdateCarPrice: (carId: string, newPriceNumeric: number) => void;
  onDeleteCar: (carId: string) => void;
  onResetCars: () => void;

  galleryPhotos: ClientGalleryPhoto[];
  onAddGalleryPhoto: (photo: Omit<ClientGalleryPhoto, 'id'>) => void;
  onDeleteGalleryPhoto: (id: string) => void;

  reviews: ClientReviewRecord[];
  onToggleReviewVisibility: (id: string) => void;
  onDeleteReview: (id: string) => void;

  newsList: NewsItemRecord[];
  onAddNews: (news: Omit<NewsItemRecord, 'id'>) => void;
  onDeleteNews: (id: string) => void;

  promoSlides: PromoSlide[];
  onUpdatePromoSlide: (slideId: string, title: string, highlightPill: string) => void;

  reservations: ReservationAdminItem[];
  onUpdateReservationStatus: (orderId: string, newStatus: string) => void;
  onDeleteReservation: (orderId: string) => void;

  showroomInfo: ShowRoomLocationType;
  onUpdateShowroomInfo: (updated: ShowRoomLocationType) => void;

  adminUserEmail: string | null;
  onGoogleAdminSignIn: () => void;
  onAdminSignOut: () => void;
}

export function AdminControlSection({
  cars,
  onAddCar,
  onUpdateCarPrice,
  onDeleteCar,
  onResetCars,
  galleryPhotos,
  onAddGalleryPhoto,
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
}: AdminControlSectionProps) {
  const [activeTab, setActiveTab] = useState<
    'vehicles' | 'gallery' | 'reviews' | 'news' | 'reservations' | 'settings'
  >('vehicles');

  // --- New Vehicle Form State ---
  const [newCarTitle1, setNewCarTitle1] = useState('');
  const [newCarTitle2, setNewCarTitle2] = useState('PEARL WHITE EDITION 2026');
  const [newCarPowertrain, setNewCarPowertrain] = useState<'EV' | 'Hybrid' | 'Patrol / Petrol'>('Patrol / Petrol');
  const [newCarPrice, setNewCarPrice] = useState('1850000');
  const [newCarHp, setNewCarHp] = useState('520 hp');
  const [newCarZeroSixty, setNewCarZeroSixty] = useState('3.8 sec');
  const [newCarEngine, setNewCarEngine] = useState('Twin-Turbo V8 / 800V Electric · Duty Paid');
  const [newCarRange, setNewCarRange] = useState('Available at Tse Addo High Street · DVLA Registered');
  const [newCarImage, setNewCarImage] = useState(patrolSuvWhiteImg);
  const [editingPriceMap, setEditingPriceMap] = useState<Record<string, string>>({});

  // --- New Gallery Photo Form State ---
  const [galClientName, setGalClientName] = useState('');
  const [galVehicleTitle, setGalVehicleTitle] = useState('');
  const [galPowertrain, setGalPowertrain] = useState<'EV' | 'Hybrid' | 'Patrol / Petrol'>('Patrol / Petrol');
  const [galLocation, setGalLocation] = useState('Tse Addo High Street, Accra');
  const [galCaption, setGalCaption] = useState('');
  const [galImage, setGalImage] = useState(clientHandoverPatrolImg);

  // --- New News Card Form State ---
  const [newsTag, setNewsTag] = useState('TSE ADDO SHOWROOM');
  const [newsDate, setNewsDate] = useState('2026 UPDATE');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsCategory, setNewsCategory] = useState<PowertrainCategory>('all');

  // --- Showroom Settings Form State ---
  const [locName, setLocName] = useState(showroomInfo.name);
  const [locAddress, setLocAddress] = useState(showroomInfo.fullAddress);
  const [locPhone, setLocPhone] = useState(showroomInfo.phone);
  const [locEmail, setLocEmail] = useState(showroomInfo.email);
  const [locHours, setLocHours] = useState(showroomInfo.hours);
  const [locIgHandle, setLocIgHandle] = useState(showroomInfo.instagramHandle);
  const [locIgUrl, setLocIgUrl] = useState(showroomInfo.instagramUrl);

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
      isPackage: true,
      priceText: `GH₵ ${numeric.toLocaleString()}`,
      priceNumeric: numeric,
      typeText: `${newCarPowertrain} Luxury Vehicle`,
      engineText: newCarEngine.trim(),
      fuelEconomyOrRange: newCarRange.trim(),
      thresholdOffer: 'Available at Tse Addo High Street · Duty Paid',
      image: newCarImage || patrolSuvWhiteImg,
      tagCategory: ['latest', 'featured'],
      zeroToSixty: newCarZeroSixty.trim() || '3.9 sec',
      topSpeed: '260 km/h',
      horsepower: newCarHp.trim() || '500 hp',
      transmission: 'Automatic AWD',
      description: `${newCarTitle1.trim()} ${newCarTitle2.trim()} available for inspection and immediate pickup at RY WHEELS, Tse Addo High Street, Accra.`,
      trims: [
        { id: 'std-spec', label: 'Standard Executive Spec', sublabel: newCarHp, priceDelta: 0 },
        { id: 'vip-spec', label: 'Pearl White Reserve Pack', sublabel: 'Bespoke Trim', priceDelta: 140000 },
      ],
    };
    onAddCar(created);
    setNewCarTitle1('');
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galClientName.trim() || !galVehicleTitle.trim()) return;
    onAddGalleryPhoto({
      clientName: galClientName.trim(),
      vehicleTitle: galVehicleTitle.trim(),
      powertrain: galPowertrain,
      locationTag: galLocation.trim() || 'Tse Addo High Street, Accra',
      deliveredDate: '2026 Handover',
      caption:
        galCaption.trim() ||
        'Delivered at RY WHEELS Showroom on Tse Addo High Street, Accra with full DVLA registration and customs duty paid.',
      imageUrl: galImage || clientHandoverPatrolImg,
      visibility: 'public',
    });
    setGalClientName('');
    setGalVehicleTitle('');
    setGalCaption('');
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;
    onAddNews({
      tag: newsTag.trim() || 'TSE ADDO SHOWROOM',
      date: newsDate.trim() || '2026 UPDATE',
      title: newsTitle.trim(),
      summary: newsSummary.trim(),
      actionLabel: 'Browse in Showroom',
      targetCategory: newsCategory,
    });
    setNewsTitle('');
    setNewsSummary('');
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
  };

  return (
    <div className="mt-4 rounded-[26px] border-2 border-[#111111] bg-[#f8f8f8] p-4 sm:p-6 text-[#111111] space-y-5">
      {/* Top Admin Header & Cloud Sync Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4d4d4] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#111111] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm sm:text-base uppercase text-[#111111]">
              RY WHEELS Master Admin Control
            </h3>
            <p className="text-[11px] text-[#555555]">
              Controls Vehicles, Client Gallery, Reviews, News &amp; Slideshow, Reservations, and Tse Addo Showroom Info
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {adminUserEmail ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-white border border-[#d4d4d4] text-[11px] font-bold text-[#111111] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{adminUserEmail}</span>
              </span>
              <button
                type="button"
                onClick={onAdminSignOut}
                className="px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onGoogleAdminSignIn}
              className="px-4 py-2 rounded-full bg-[#111111] hover:bg-[#262626] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Admin Cloud Sync (Google)</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Control Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(
          [
            { id: 'vehicles', label: `Vehicles (${cars.length})` },
            { id: 'gallery', label: `Gallery Photos (${galleryPhotos.length})` },
            { id: 'reviews', label: `Client Reviews (${reviews.length})` },
            { id: 'news', label: `News & Slides (${newsList.length})` },
            { id: 'reservations', label: `Reservations (${reservations.length})` },
            { id: 'settings', label: 'Showroom Info' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-[30px] text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-[#d4d4d4] text-[#111111] hover:bg-[#eeeeee]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =====================================================================
          TAB 1: SHOWROOM VEHICLES CONTROL
         ===================================================================== */}
      {activeTab === 'vehicles' && (
        <div className="space-y-5">
          <form
            onSubmit={handleCreateVehicle}
            className="rounded-[22px] border border-[#d4d4d4] bg-white p-4 sm:p-5 space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs sm:text-sm uppercase text-[#111111]">
                Add Vehicle to Showroom
              </h4>
              <button
                type="button"
                onClick={onResetCars}
                className="text-[11px] font-bold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default Fleet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newCarTitle1}
                onChange={(e) => setNewCarTitle1(e.target.value)}
                placeholder="Model Title (e.g. RANGE ROVER P530)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <input
                type="text"
                value={newCarTitle2}
                onChange={(e) => setNewCarTitle2(e.target.value)}
                placeholder="Edition / Year (e.g. PEARL WHITE 2026)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <select
                value={newCarPowertrain}
                onChange={(e) =>
                  setNewCarPowertrain(e.target.value as 'EV' | 'Hybrid' | 'Patrol / Petrol')
                }
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] bg-white text-xs font-bold text-[#111111]"
              >
                <option value="Patrol / Petrol">Patrol / Petrol</option>
                <option value="EV">EV Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <input
                type="number"
                required
                value={newCarPrice}
                onChange={(e) => setNewCarPrice(e.target.value)}
                placeholder="Price in GH₵ (e.g. 1850000)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <input
                type="text"
                value={newCarHp}
                onChange={(e) => setNewCarHp(e.target.value)}
                placeholder="Horsepower (e.g. 520 hp)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <input
                type="text"
                value={newCarZeroSixty}
                onChange={(e) => setNewCarZeroSixty(e.target.value)}
                placeholder="0-60 Time (e.g. 3.8 sec)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newCarEngine}
                onChange={(e) => setNewCarEngine(e.target.value)}
                placeholder="Engine / Battery Spec"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <select
                value={newCarImage}
                onChange={(e) => setNewCarImage(e.target.value)}
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] bg-white text-xs font-semibold text-[#111111]"
              >
                <option value={patrolSuvWhiteImg}>Studio Photo: Pearl White Patrol V8 SUV</option>
                <option value={evCoupeImg}>Studio Photo: Pearl White EV Coupe GT</option>
                <option value={evSedanImg}>Studio Photo: Pearl White EV Flagship Sedan</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vehicle to Showroom</span>
            </button>
          </form>

          {/* Existing Vehicles Price & Removal Control */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {cars.map((car) => {
              const draftPrice =
                editingPriceMap[car.id] !== undefined
                  ? editingPriceMap[car.id]
                  : String(car.priceNumeric);
              return (
                <div
                  key={car.id}
                  className="rounded-[18px] border border-[#e5e5e5] bg-white p-3.5 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={car.image}
                      alt={car.titleLine1}
                      className="w-14 h-10 rounded-xl object-cover border border-[#e5e5e5] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-[#111111] truncate">
                        {car.titleLine1} · {car.titleLine2}
                      </div>
                      <div className="text-[11px] text-[#666666]">
                        {car.powertrain} · Current: {car.priceText}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={draftPrice}
                      onChange={(e) =>
                        setEditingPriceMap((prev) => ({
                          ...prev,
                          [car.id]: e.target.value,
                        }))
                      }
                      className="w-28 px-3 py-1.5 rounded-full border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = Number(draftPrice);
                        if (val >= 1000) onUpdateCarPrice(car.id, val);
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#111111] text-white text-[11px] font-bold cursor-pointer"
                    >
                      Update GH₵
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCar(car.id)}
                      aria-label={`Remove ${car.titleLine1}`}
                      className="w-8 h-8 rounded-full bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: CLIENT GALLERY CONTROL
         ===================================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <form
            onSubmit={handleCreateGalleryItem}
            className="rounded-[22px] border border-[#d4d4d4] bg-white p-4 sm:p-5 space-y-3"
          >
            <h4 className="font-bold text-xs sm:text-sm uppercase text-[#111111]">
              Add Client Handover Photo to Gallery
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={galClientName}
                onChange={(e) => setGalClientName(e.target.value)}
                placeholder="Client Name (e.g. Dr. Mensah)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <input
                type="text"
                required
                value={galVehicleTitle}
                onChange={(e) => setGalVehicleTitle(e.target.value)}
                placeholder="Vehicle Delivered (e.g. 2026 Patrol V8)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <select
                value={galPowertrain}
                onChange={(e) =>
                  setGalPowertrain(e.target.value as 'EV' | 'Hybrid' | 'Patrol / Petrol')
                }
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] bg-white text-xs font-bold text-[#111111]"
              >
                <option value="Patrol / Petrol">Patrol / Petrol</option>
                <option value="EV">EV Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={galLocation}
                onChange={(e) => setGalLocation(e.target.value)}
                placeholder="Location Tag (e.g. Tse Addo High Street, Accra)"
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <select
                value={galImage}
                onChange={(e) => setGalImage(e.target.value)}
                className="px-3.5 py-2.5 rounded-full border border-[#d4d4d4] bg-white text-xs font-semibold text-[#111111]"
              >
                <option value={clientHandoverPatrolImg}>Photo: Executive Patrol V8 Handover</option>
                <option value={clientHandoverEvImg}>Photo: EV Coupe Showroom Handover</option>
                <option value={clientHandoverHybridImg}>Photo: Couple Plug-In Hybrid Delivery</option>
                <option value={clientHandoverBentleyImg}>Photo: Grand Tourer Key Handover</option>
              </select>
            </div>

            <input
              type="text"
              value={galCaption}
              onChange={(e) => setGalCaption(e.target.value)}
              placeholder="Handover story / caption..."
              className="w-full px-3.5 py-2.5 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
            />

            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish to Client Gallery</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {galleryPhotos.map((item) => (
              <div
                key={item.id}
                className="rounded-[18px] border border-[#e5e5e5] bg-white p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.clientName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#111111] truncate">
                      {item.clientName}
                    </div>
                    <div className="text-[11px] text-[#666666] truncate">
                      {item.vehicleTitle}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteGalleryPhoto(item.id)}
                  className="w-8 h-8 rounded-full bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: CLIENT REVIEWS MODERATION
         ===================================================================== */}
      {activeTab === 'reviews' && (
        <div className="space-y-2.5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-[18px] border border-[#e5e5e5] bg-white p-3.5 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#111111]">
                    {rev.clientName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#111111] text-white text-[10px] font-bold">
                    {rev.rating}/5
                  </span>
                  <span className="text-[11px] text-[#666666]">
                    {rev.vehicleOwned}
                  </span>
                  {rev.visibility === 'hidden' && (
                    <span className="px-2 py-0.5 rounded-full bg-[#e5e5e5] text-[#111111] text-[10px] font-bold uppercase">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#444444] mt-1 line-clamp-2">
                  {rev.comment}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleReviewVisibility(rev.id)}
                  className="px-3 py-1.5 rounded-full border border-[#d4d4d4] text-[11px] font-bold text-[#111111] flex items-center gap-1 cursor-pointer"
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
                  onClick={() => onDeleteReview(rev.id)}
                  className="w-8 h-8 rounded-full bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          TAB 4: WELCOME & NEWS + SLIDESHOW CONTROL
         ===================================================================== */}
      {activeTab === 'news' && (
        <div className="space-y-5">
          {/* Edit 2026 Flagship Arrival Slideshow */}
          <div className="rounded-[22px] border border-[#d4d4d4] bg-white p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase text-[#111111]">
              2026 Flagship Arrival Slideshow Headlines
            </h4>
            {promoSlides.map((slide) => (
              <div
                key={slide.id}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#f0f0f0]"
              >
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) =>
                    onUpdatePromoSlide(slide.id, e.target.value, slide.highlightPill)
                  }
                  className="px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs font-bold text-[#111111]"
                />
                <input
                  type="text"
                  value={slide.highlightPill}
                  onChange={(e) =>
                    onUpdatePromoSlide(slide.id, slide.title, e.target.value)
                  }
                  className="px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
                />
              </div>
            ))}
          </div>

          {/* Add News Highlight */}
          <form
            onSubmit={handleCreateNews}
            className="rounded-[22px] border border-[#d4d4d4] bg-white p-4 space-y-3"
          >
            <h4 className="font-bold text-xs uppercase text-[#111111]">
              Publish Tse Addo Showroom News Card
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newsTag}
                onChange={(e) => setNewsTag(e.target.value)}
                placeholder="Tag (e.g. TSE ADDO SHOWROOM)"
                className="px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <input
                type="text"
                value={newsDate}
                onChange={(e) => setNewsDate(e.target.value)}
                placeholder="Date Badge (e.g. 2026 ARRIVALS)"
                className="px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
              <select
                value={newsCategory}
                onChange={(e) => setNewsCategory(e.target.value as PowertrainCategory)}
                className="px-3.5 py-2 rounded-full border border-[#d4d4d4] bg-white text-xs font-bold text-[#111111]"
              >
                <option value="all">Target: All Vehicles</option>
                <option value="EV">Target: EV Electric</option>
                <option value="Hybrid">Target: Hybrid Cars</option>
                <option value="Patrol / Petrol">Target: Patrol &amp; Petrol</option>
                <option value="Packages">Target: Executive Deals</option>
              </select>
            </div>
            <input
              type="text"
              required
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="News Headline..."
              className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
            />
            <input
              type="text"
              required
              value={newsSummary}
              onChange={(e) => setNewsSummary(e.target.value)}
              placeholder="Short summary for visitors..."
              className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add News Card</span>
            </button>
          </form>

          <div className="space-y-2">
            {newsList.map((n) => (
              <div
                key={n.id}
                className="rounded-[18px] border border-[#e5e5e5] bg-white p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#111111] truncate">{n.title}</div>
                  <div className="text-[11px] text-[#666666] truncate">{n.summary}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteNews(n.id)}
                  className="w-8 h-8 rounded-full bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: RESERVATIONS CONTROL
         ===================================================================== */}
      {activeTab === 'reservations' && (
        <div className="space-y-2.5">
          {reservations.map((order) => (
            <div
              key={order.id}
              className="rounded-[18px] border border-[#e5e5e5] bg-white p-3.5 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-[#111111]">
                  #{order.id} · {order.buyerName} ({order.buyerPhone})
                </div>
                <div className="text-[11px] text-[#555555]">
                  {order.vehicleSummary} · GH₵ {order.totalAmount.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={order.status}
                  onChange={(e) => onUpdateReservationStatus(order.id, e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-[#d4d4d4] bg-white text-xs font-bold text-[#111111]"
                >
                  <option value="Ready at Tse Addo Showroom">Ready at Tse Addo Showroom</option>
                  <option value="Scheduled for Accra Home Delivery">Scheduled for Accra Home Delivery</option>
                  <option value="DVLA Registered & Delivered">DVLA Registered &amp; Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  type="button"
                  onClick={() => onDeleteReservation(order.id)}
                  className="w-8 h-8 rounded-full bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================================
          TAB 6: SHOWROOM INFO & CONTACT SETTINGS
         ===================================================================== */}
      {activeTab === 'settings' && (
        <form
          onSubmit={handleSaveSettings}
          className="rounded-[22px] border border-[#d4d4d4] bg-white p-4 sm:p-5 space-y-3"
        >
          <h4 className="font-bold text-xs sm:text-sm uppercase text-[#111111]">
            Showroom Address, Phone &amp; Socials
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#555555]">Showroom Name</label>
              <input
                type="text"
                value={locName}
                onChange={(e) => setLocName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#555555]">Full Street Address</label>
              <input
                type="text"
                value={locAddress}
                onChange={(e) => setLocAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#555555]">Ghana Phone</label>
              <input
                type="text"
                value={locPhone}
                onChange={(e) => setLocPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#555555]">Email</label>
              <input
                type="email"
                value={locEmail}
                onChange={(e) => setLocEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#555555]">Opening Hours</label>
              <input
                type="text"
                value={locHours}
                onChange={(e) => setLocHours(e.target.value)}
                className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#555555]">Instagram Handle</label>
              <input
                type="text"
                value={locIgHandle}
                onChange={(e) => setLocIgHandle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-full border border-[#d4d4d4] text-xs text-[#111111]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-extrabold cursor-pointer"
          >
            Save Showroom Info
          </button>
        </form>
      )}
    </div>
  );
}
