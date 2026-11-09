import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquarePlus,
  X,
  ArrowRight,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Camera,
} from 'lucide-react';
import {
  ClientGalleryPhoto,
  ClientReviewRecord,
  PowertrainCategory,
  WorkplaceSlide,
  ExecutiveLeader,
  WORKPLACE_SLIDES,
  LEADERSHIP_TEAM,
  RY_SHOWROOM_LOCATION,
  clientHandoverPatrolImg,
} from '../data/vehicles';
import { ResilientImage } from './ResilientImage';

interface GallerySectionProps {
  galleryPhotos: ClientGalleryPhoto[];
  reviews: ClientReviewRecord[];
  workplaceSlides?: WorkplaceSlide[];
  leaders?: ExecutiveLeader[];
  initialTab?: 'gallery' | 'bosses';
  whatsappPhone?: string;
  onAddReview: (newReview: Omit<ClientReviewRecord, 'id' | 'createdAtLabel'>) => Promise<void> | void;
  onDeleteReview?: (reviewId: string) => void;
  isAdmin?: boolean;
  onEnterShowroom: (category?: PowertrainCategory) => void;
}

const toWhatsAppDigits = (rawPhone: string): string => {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return `233${digits.slice(1)}`;
  }
  return digits || '233593207377';
};

export function GallerySection({
  galleryPhotos,
  reviews,
  workplaceSlides = WORKPLACE_SLIDES,
  leaders = LEADERSHIP_TEAM,
  initialTab = 'gallery',
  whatsappPhone = RY_SHOWROOM_LOCATION.phone,
  onAddReview,
  onDeleteReview,
  isAdmin = false,
  onEnterShowroom,
}: GallerySectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'gallery' | 'bosses'>(initialTab);
  const [selectedPowertrain, setSelectedPowertrain] = useState<'all' | 'EV' | 'Hybrid' | 'Patrol / Petrol'>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<ClientGalleryPhoto | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const reviewBoxRef = useRef<HTMLDivElement | null>(null);
  const reviewTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Workplace Slideshow Loop State
  const [activeWorkplaceIdx, setActiveWorkplaceIdx] = useState(0);

  useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  // Pre-decode all workplace slides in background so slide transitions never flicker or lag
  useEffect(() => {
    workplaceSlides.forEach((s) => {
      if (s.imageUrl) {
        const img = new Image();
        img.decoding = 'async';
        img.src = s.imageUrl;
      }
    });
  }, [workplaceSlides]);

  useEffect(() => {
    if (workplaceSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveWorkplaceIdx((prev) => (prev + 1) % workplaceSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [workplaceSlides.length]);

  // Simple Review Text Box State -> Sends directly to WhatsApp
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const openReviewTextBox = () => {
    setIsReviewFormOpen(true);
    window.setTimeout(() => {
      reviewBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      reviewTextareaRef.current?.focus();
    }, 80);
  };

  const visibleGallery = galleryPhotos.filter(
    (item) =>
      item.visibility !== 'hidden' &&
      (selectedPowertrain === 'all' || item.powertrain === selectedPowertrain)
  );

  const visibleReviews = reviews.filter(
    (rev) =>
      rev.visibility !== 'hidden' &&
      (selectedPowertrain === 'all' || rev.powertrain === selectedPowertrain)
  );

  const buildReviewWhatsAppUrl = () => {
    const phoneDigits = toWhatsAppDigits(whatsappPhone);
    const trimmedComment = comment.trim();
    const senderLabel = clientName.trim() ? clientName.trim() : 'Client';
    const stars = '★'.repeat(rating);
    const lines = [
      `Hello RY WHEELS, I would like to share a review:`,
      ``,
      `"${trimmedComment}"`,
      ``,
      `• Rating: ${stars} (${rating}/5)`,
      `• From: ${senderLabel}`,
    ];
    return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handleSendReviewToWhatsApp = () => {
    if (!comment.trim()) return;
    onAddReview({
      clientName: (clientName.trim() || 'RY WHEELS Client').slice(0, 80),
      clientLocation: 'Accra, Ghana',
      vehicleOwned: 'RY WHEELS Showroom',
      powertrain: 'Patrol / Petrol',
      rating,
      comment: comment.trim().slice(0, 600),
      clientPhotoUrl: clientHandoverPatrolImg,
      visibility: 'public',
    });
    window.setTimeout(() => {
      setClientName('');
      setComment('');
      setIsReviewFormOpen(false);
    }, 150);
  };

  return (
    <section
      id="gallery-section"
      className="max-w-[1320px] w-[94%] mx-auto py-8 sm:py-12 flex flex-col gap-8"
    >
      {/* =====================================================================
          GALLERY & LEADERSHIP HEADER BAR
         ===================================================================== */}
      <div className="rounded-[24px] sm:rounded-[28px] border border-[#e5e5e5] bg-[#f8f8f8] p-5 sm:p-7 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-sans font-extrabold not-italic tracking-tight text-xl sm:text-2xl text-[#111111] uppercase">
            {activeSubTab === 'bosses'
              ? 'RY WHEELS LEADERSHIP & EXECUTIVES'
              : 'RY WHEELS GALLERY & WORKPLACES'}
          </h2>
          <p className="text-xs sm:text-sm text-[#666666]">
            {activeSubTab === 'bosses'
              ? 'Founder, CEO & executive team · Tse Addo High Street, Accra'
              : 'Showroom workplaces, client handovers & reviews · Tse Addo, Accra'}
          </p>
        </div>

        {/* Sub-page Switcher: Gallery & Workplaces vs Our Bosses (CEO / Founder) */}
        <div className="w-full lg:w-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('gallery')}
            className={`px-4 py-2 rounded-[30px] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'gallery'
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-[#d4d4d4] text-[#111111] hover:bg-[#eeeeee]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Gallery &amp; Workplaces</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('bosses')}
            className={`px-4 py-2 rounded-[30px] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'bosses'
                ? 'bg-[#111111] text-white'
                : 'bg-white border border-[#d4d4d4] text-[#111111] hover:bg-[#eeeeee]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Our Bosses (CEO &amp; Team)</span>
          </button>

          {activeSubTab === 'gallery' && (
            <button
              type="button"
              onClick={() => {
                if (isReviewFormOpen) {
                  setIsReviewFormOpen(false);
                } else {
                  openReviewTextBox();
                }
              }}
              className="px-4 py-2 rounded-[30px] border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>{isReviewFormOpen ? 'Close Review' : 'Write Review'}</span>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          TAB B: DEDICATED PAGE FOR OUR BOSSES (CEO, FOUNDER & EXECUTIVES)
         ===================================================================== */}
      {activeSubTab === 'bosses' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {leaders.map((leader) => (
              <article
                key={leader.id}
                className="rounded-[26px] border border-[#e5e5e5] hover:border-[#111111] bg-white overflow-hidden flex flex-col justify-between transition-all shadow-2xs"
              >
                <div className="h-[280px] sm:h-[320px] lg:h-[370px] w-full bg-[#f4f4f4] overflow-hidden relative">
                  <ResilientImage
                    src={leader.imageUrl}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#111111]/90 text-white text-[10px] font-bold uppercase tracking-wider">
                    {leader.role}
                  </span>
                </div>

                <div className="p-5 space-y-1.5">
                  <h3 className="font-sans font-extrabold text-base sm:text-lg text-[#111111]">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {leader.note}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-[24px] border border-[#e5e5e5] bg-[#f8f8f8] p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs sm:text-sm font-bold text-[#111111]">
              RY WHEELS Executive Office · Tse Addo High Street, Accra
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('gallery')}
              className="px-4 py-2 rounded-[30px] bg-[#111111] text-white text-xs font-extrabold cursor-pointer"
            >
              ← Back to Gallery &amp; Workplaces
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* =================================================================
              1. LOOPING WORKPLACE IMAGE SLIDESHOW ("OUR WORKPLACES")
              Increased height on desktop (md/lg/xl) so full building, RY WHEELS
              signage, and red-carpet EV fleet display without vertical cropping
             ================================================================= */}
          {workplaceSlides.length > 0 && (
            <div className="w-full rounded-[24px] sm:rounded-[30px] overflow-hidden relative min-h-[320px] sm:min-h-[440px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[530px] bg-[#111111] border border-[#d4d4d4] shadow-sm flex flex-col">
              <AnimatePresence mode="wait">
                {workplaceSlides.map((slide, idx) => {
                  if (idx !== activeWorkplaceIdx) return null;
                  return (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="relative w-full flex-1 flex flex-col justify-between min-h-[320px] sm:min-h-[440px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[530px]"
                    >
                      <ResilientImage
                        src={slide.imageUrl}
                        alt={slide.title}
                        loading="eager"
                        fetchPriority="high"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-95"
                      />
                      <div className="relative z-10 flex-1 bg-gradient-to-t from-black/85 via-black/20 to-black/15 p-5 sm:p-8 lg:p-10 flex flex-col justify-between gap-4 min-h-[320px] sm:min-h-[440px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[530px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-white/85">
                            OUR WORKPLACES · {slide.tag}
                          </span>
                          <span className="text-xs font-bold text-white/85">
                            0{idx + 1} / 0{workplaceSlides.length}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-4 mt-auto">
                          <div className="max-w-xl space-y-1">
                            <h3 className="font-sans font-extrabold not-italic tracking-tight text-lg sm:text-2xl md:text-3xl text-white uppercase">
                              {slide.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/85 line-clamp-1">
                              {slide.caption}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 ml-auto">
                            <div className="flex items-center gap-1.5 mr-1">
                              {workplaceSlides.map((s, dotI) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => setActiveWorkplaceIdx(dotI)}
                                  aria-label={`Workplace slide ${dotI + 1}`}
                                  className={`h-2 rounded-full transition-all cursor-pointer ${
                                    dotI === activeWorkplaceIdx
                                      ? 'w-7 bg-white'
                                      : 'w-2 bg-white/40 hover:bg-white/70'
                                  }`}
                                />
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setActiveWorkplaceIdx(
                                  (prev) =>
                                    (prev - 1 + workplaceSlides.length) %
                                    workplaceSlides.length
                                )
                              }
                              aria-label="Previous workplace photo"
                              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white hover:text-[#111111] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveWorkplaceIdx(
                                  (prev) => (prev + 1) % workplaceSlides.length
                                )
                              }
                              aria-label="Next workplace photo"
                              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white hover:text-[#111111] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
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
          )}

          {/* =================================================================
              SIMPLE REVIEW TEXT BOX -> SENDS DIRECTLY TO WHATSAPP
             ================================================================= */}
          <AnimatePresence>
            {isReviewFormOpen && (
              <motion.div
                ref={reviewBoxRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-[26px] border-2 border-[#111111] bg-white p-5 sm:p-6 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3">
                  <div>
                    <h3 className="font-sans font-extrabold text-sm sm:text-base text-[#111111] uppercase">
                      Write Your Review
                    </h3>
                    <p className="text-[11px] text-[#666666]">
                      Type your message below and send it directly to RY WHEELS on WhatsApp
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#f2f2f2] hover:bg-[#111111] hover:text-white text-[#111111] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <textarea
                    ref={reviewTextareaRef}
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your review or experience with RY WHEELS here..."
                    className="w-full px-4 py-3 rounded-[18px] border border-[#d4d4d4] bg-[#fafafa] focus:bg-white text-sm text-[#111111] focus:outline-none focus:border-[#111111] transition-colors"
                  />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Your Name (optional)"
                        className="px-4 py-2 rounded-full border border-[#d4d4d4] bg-white text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#111111]"
                      />

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            className={`w-8 h-8 rounded-full text-xs font-extrabold border transition-all cursor-pointer ${
                              rating >= num
                                ? 'bg-[#111111] text-white border-[#111111]'
                                : 'bg-white text-[#666666] border-[#d4d4d4]'
                            }`}
                            title={`${num} Star${num > 1 ? 's' : ''}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsReviewFormOpen(false)}
                        className="px-4 py-2.5 rounded-full border border-[#d4d4d4] text-xs font-bold text-[#111111] cursor-pointer hover:bg-[#f4f4f4]"
                      >
                        Cancel
                      </button>

                      {comment.trim() ? (
                        <a
                          href={buildReviewWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleSendReviewToWhatsApp}
                          className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#262626] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>Send to WhatsApp</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-5 py-2.5 rounded-full bg-[#111111]/40 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <span>Send to WhatsApp</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =================================================================
              2. CLIENT DELIVERY PHOTO GALLERY GRID
             ================================================================= */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-sans font-extrabold text-base sm:text-lg text-[#111111] uppercase mr-2">
                  Client Handovers ({visibleGallery.length})
                </h3>
                {(['all', 'EV', 'Hybrid', 'Patrol / Petrol'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedPowertrain(cat)}
                    className={`px-3 py-1 rounded-[30px] text-[11px] font-bold transition-all cursor-pointer ${
                      selectedPowertrain === cat
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#f2f2f2] text-[#111111] hover:bg-[#e5e5e5]'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onEnterShowroom('all')}
                className="text-xs font-extrabold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Showroom</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {visibleGallery.map((photo) => (
                <article
                  key={photo.id}
                  onClick={() => setLightboxPhoto(photo)}
                  className="group rounded-[24px] border border-[#e5e5e5] hover:border-[#111111] bg-white overflow-hidden flex flex-col justify-between transition-all cursor-pointer shadow-2xs hover:shadow-md"
                >
                  <div className="relative h-[220px] sm:h-[235px] w-full bg-[#f4f4f4] overflow-hidden">
                    <ResilientImage
                      src={photo.imageUrl}
                      alt={`${photo.clientName} - ${photo.vehicleTitle}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#111111]/90 text-white text-[10px] font-bold uppercase">
                      {photo.powertrain}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#111111] truncate">
                        {photo.clientName}
                      </span>
                      <span className="text-[11px] font-medium text-[#737373] shrink-0">
                        {photo.locationTag}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#111111] truncate">
                      {photo.vehicleTitle}
                    </h4>
                    <p className="text-xs text-[#666666] line-clamp-1">
                      {photo.caption}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* =================================================================
              3. CLIENT REVIEWS WALL
             ================================================================= */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e5e5] pt-6">
              <h3 className="font-sans font-extrabold text-base sm:text-lg text-[#111111] uppercase">
                Client Reviews ({visibleReviews.length})
              </h3>

              <button
                type="button"
                onClick={openReviewTextBox}
                className="px-4 py-2 rounded-[30px] border border-[#111111] bg-white hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-[22px] border border-[#e5e5e5] hover:border-[#111111] bg-white p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {rev.clientPhotoUrl ? (
                        <img
                          src={rev.clientPhotoUrl}
                          alt={rev.clientName}
                          className="w-11 h-11 rounded-xl object-cover border border-[#d4d4d4] shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {rev.clientName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#111111] truncate">
                          {rev.clientName}
                        </h4>
                        <p className="text-[11px] text-[#666666] truncate">
                          {rev.vehicleOwned} · {rev.clientLocation}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-[#111111] shrink-0">
                      ★ {rev.rating}.0
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#333333] line-clamp-2">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {isAdmin && onDeleteReview && (
                    <div className="pt-2 border-t border-[#f0f0f0] flex justify-end">
                      <button
                        type="button"
                        onClick={() => onDeleteReview(rev.id)}
                        className="text-xs font-bold text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* =====================================================================
          CLIENT HANDOVER DETAIL MODAL (Responsive Split-View on Desktop)
         ===================================================================== */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-[920] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[920px] rounded-[28px] bg-white border border-[#d4d4d4] overflow-hidden shadow-2xl text-[#111111] grid grid-cols-1 md:grid-cols-12"
            >
              <button
                type="button"
                onClick={() => setLightboxPhoto(null)}
                aria-label="Close handover card"
                className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-white/95 hover:bg-[#111111] hover:text-white text-[#111111] border border-[#d4d4d4] flex items-center justify-center cursor-pointer shadow-xs transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column (Desktop): Full Uncropped Handover Photo + Prev/Next */}
              <div className="md:col-span-7 relative h-[260px] sm:h-[340px] md:h-[440px] w-full bg-[#111111] flex items-center justify-center overflow-hidden">
                <ResilientImage
                  src={lightboxPhoto.imageUrl}
                  alt={`${lightboxPhoto.clientName} - ${lightboxPhoto.vehicleTitle}`}
                  className="w-full h-full object-contain"
                />

                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#111111]/90 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  {lightboxPhoto.powertrain}
                </span>

                {visibleGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const currIdx = visibleGallery.findIndex(
                          (item) => item.id === lightboxPhoto.id
                        );
                        const prevIdx =
                          (currIdx - 1 + visibleGallery.length) %
                          visibleGallery.length;
                        setLightboxPhoto(visibleGallery[prevIdx]);
                      }}
                      aria-label="Previous client handover"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-white hover:text-[#111111] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const currIdx = visibleGallery.findIndex(
                          (item) => item.id === lightboxPhoto.id
                        );
                        const nextIdx = (currIdx + 1) % visibleGallery.length;
                        setLightboxPhoto(visibleGallery[nextIdx]);
                      }}
                      aria-label="Next client handover"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 hover:bg-white hover:text-[#111111] text-white border border-white/25 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Right Column (Desktop): Structured Client Handover Details & Thumbnails */}
              <div className="md:col-span-5 p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-4 bg-white">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f4f4f4] text-[10px] font-extrabold uppercase tracking-wider text-[#111111]">
                    <span>Client Handover · {lightboxPhoto.deliveredDate}</span>
                  </div>

                  <div>
                    <h3 className="font-sans font-extrabold text-lg sm:text-xl text-[#111111] leading-snug">
                      {lightboxPhoto.clientName}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-[#444444] mt-0.5">
                      {lightboxPhoto.vehicleTitle}
                    </p>
                  </div>

                  <div className="rounded-[16px] bg-[#f8f8f8] border border-[#e5e5e5] p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#666666] font-semibold">Location</span>
                      <span className="font-bold text-[#111111]">
                        {lightboxPhoto.locationTag}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#666666] font-semibold">Category</span>
                      <span className="font-bold text-[#111111]">
                        {lightboxPhoto.powertrain}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                    {lightboxPhoto.caption}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#eeeeee]">
                  {visibleGallery.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {visibleGallery.slice(0, 4).map((thumb) => {
                        const isCurrent = thumb.id === lightboxPhoto.id;
                        return (
                          <button
                            key={thumb.id}
                            type="button"
                            onClick={() => setLightboxPhoto(thumb)}
                            className={`h-12 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                              isCurrent
                                ? 'border-2 border-[#111111] ring-1 ring-[#111111]'
                                : 'border-[#d4d4d4] opacity-70 hover:opacity-100'
                            }`}
                          >
                            <ResilientImage
                              src={thumb.imageUrl}
                              alt={thumb.clientName}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const cat = lightboxPhoto.powertrain;
                      setLightboxPhoto(null);
                      onEnterShowroom(cat);
                    }}
                    className="w-full py-2.5 px-4 rounded-[30px] bg-[#111111] hover:bg-[#262626] text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Explore {lightboxPhoto.powertrain} in Showroom</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
