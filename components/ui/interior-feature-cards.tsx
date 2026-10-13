'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  AirVent,
  Armchair,
  Lightbulb,
  Luggage,
  MountainSnow,
  Toilet,
  X,
  type LucideIcon,
} from 'lucide-react';

const FEATURE_ICONS = {
  Armchair,
  AirVent,
  Toilet,
  Luggage,
  Lightbulb,
  MountainSnow,
} as const satisfies Record<string, LucideIcon>;

export type InteriorFeatureIcon = keyof typeof FEATURE_ICONS;

export interface InteriorFeatureCard {
  icon: InteriorFeatureIcon;
  title: string;
  description: string;
  image: string;
  className?: string;
}

export interface InteriorFeatureTheme {
  accent: string;
  rule: string;
  edge: string;
  border: string;
  glow: string;
}

// Triggered on the list rather than each card: on md+ the row scrolls sideways, so off-screen cards would never be "in view"
const CARD_LIST: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.3, staggerChildren: 0.12 } },
};

const CARD: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

function expandedSrc(src: string) {
  return src.replace(/([?&]w=)\d+/, '$12000');
}

export default function InteriorFeatureCards({
  features,
  theme,
}: {
  features: InteriorFeatureCard[];
  theme: InteriorFeatureTheme;
}) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!expandedImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedImage(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [expandedImage]);

  const expandedTitle = features.find((feature) => feature.image === expandedImage)?.title;

  return (
    <>
      {/* md:pt-12 leaves room for the cards' upward glow (offset + blur reach ~48px on hover), which overflow-x-auto would otherwise clip */}
      {/* shrink-0: overflow-x-auto also makes the row scroll vertically, so without it the column squeezes the row and hides the card bottoms */}
      {/* min-w-0: grid items default to min-width:auto, so the scrolling card row would otherwise stretch the left column */}
      {/* lg:mr-0 lg:pr-0: only bleed to the left on desktop so the row doesn't run under the video column */}
      <motion.ul
        variants={CARD_LIST}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col md:flex-row shrink-0 min-w-0 overflow-visible md:overflow-x-auto gap-4 lg:gap-3 md:pt-12 pb-4 hide-scrollbar snap-none md:snap-x md:snap-mandatory -mx-[4vw] px-[4vw] scroll-px-[4vw] lg:mr-0 lg:pr-0 lg:col-span-8 lg:row-start-2 lg:self-start"
      >
        {features.map(({ icon, title, description, image, className }, i) => {
          const Icon = FEATURE_ICONS[icon];
          return (
            <motion.li
              key={title}
              variants={CARD}
              className={`group relative w-full md:w-[240px] lg:w-[200px] h-auto shrink-0 snap-start overflow-hidden rounded-xl border ${theme.border} bg-black/60 backdrop-blur-md ${theme.glow} transition-shadow duration-300 ${className ?? ''}`}
            >
              <div aria-hidden className={`absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent ${theme.edge} to-transparent`} />
              <button
                type="button"
                onClick={() => setExpandedImage(image)}
                aria-label={`Ampliar imagem: ${title}`}
                className="block h-48 md:h-32 w-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/80"
              >
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
              <div className="p-4 md:p-5">
                <p className={`flex items-center gap-2 text-xs font-bold tracking-widest ${theme.accent}`}>
                  {String(i + 1).padStart(2, '0')}
                  <span aria-hidden className={`h-px w-6 ${theme.rule}`} />
                </p>
                <h3 className="mt-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white">
                  <Icon aria-hidden className={`size-5 shrink-0 ${theme.accent}`} />
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-snug text-gray-400">{description}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* Portaled onto document.body so the overlay is not trapped under later sticky sections */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {expandedImage && (
              <motion.div
                key="feature-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={expandedTitle ?? 'Imagem ampliada'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setExpandedImage(null)}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 md:p-16 cursor-zoom-out"
              >
                <motion.img
                  src={expandedSrc(expandedImage)}
                  alt={expandedTitle ?? 'Expanded view'}
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="w-auto h-auto max-w-full max-h-full rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] object-contain"
                  onClick={(event) => event.stopPropagation()}
                />
                <button
                  type="button"
                  aria-label="Fechar"
                  onClick={() => setExpandedImage(null)}
                  className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors"
                >
                  <X className="size-8" strokeWidth={2} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
