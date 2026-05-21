import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=75&auto=format&fit=crop';

interface PropertyGalleryProps {
  images: string[];
  alt: string;
}

export function PropertyGallery({ images, alt }: PropertyGalleryProps) {
  const displayImages = images.length > 0 ? images : [PLACEHOLDER];
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const prev = useCallback(() =>
    setCurrent((i) => (i === 0 ? displayImages.length - 1 : i - 1)),
    [displayImages.length],
  );

  const next = useCallback(() =>
    setCurrent((i) => (i === displayImages.length - 1 ? 0 : i + 1)),
    [displayImages.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, prev, next]);

  const getSrc = (idx: number) => (imgErrors[idx] ? PLACEHOLDER : displayImages[idx]);

  return (
    <>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 cursor-pointer group">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={getSrc(current)}
            alt={`${alt} — imagen ${current + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            loading="lazy"
            onError={() => setImgErrors((p) => ({ ...p, [current]: true }))}
            onClick={() => setLightbox(true)}
          />
        </AnimatePresence>

        {/* Overlay controls */}
        <div className="absolute inset-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Imagen anterior"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="w-9 h-9 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Imagen siguiente"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Fullscreen + counter badges */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {displayImages.length > 1 && (
            <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
              {current + 1} / {displayImages.length}
            </span>
          )}
          <button
            onClick={() => setLightbox(true)}
            className="bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
            aria-label="Ver pantalla completa"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Ampliar
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {displayImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? 'border-indigo-500 shadow-md'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Ir a imagen ${i + 1}`}
            >
              <img
                src={getSrc(i)}
                alt={`Miniatura ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImgErrors((p) => ({ ...p, [i]: true }))}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            {/* Image */}
            <motion.img
              key={current}
              src={getSrc(current)}
              alt={`${alt} — imagen ${current + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Nav buttons */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Anterior"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Siguiente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                  {current + 1} / {displayImages.length}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
