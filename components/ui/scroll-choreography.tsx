"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type GalleryImages = {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
};

interface ScrollChoreographyProps {
  className?: string;
  images: GalleryImages;
  mobileImages?: GalleryImages;
  children?: React.ReactNode;
}

function GalleryPicture({
  desktopSrc,
  mobileSrc,
  alt,
}: {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
}) {
  return (
    <picture className="block h-full w-full">
      {mobileSrc ? <source media="(max-width: 767px)" srcSet={mobileSrc} /> : null}
      <img src={desktopSrc} alt={alt} className="h-full w-full object-cover" />
    </picture>
  );
}

export function ScrollChoreography({ className, images, mobileImages, children }: ScrollChoreographyProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400, damping: 50, mass: 1.2, restDelta: 0.001,
  });

  const xLeft = "-20vw"; const xRight = "20vw";
  const yTop = "-14vh"; const yBottom = "14vh";

  const tlX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const tlY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yTop, yBottom, yBottom, "0vh", "0vh"]);
  const brX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const brY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yTop, yTop, "0vh", "0vh"]);
  const blX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const blY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yBottom, yBottom, yBottom, "0vh", "0vh"]);
  const trX = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [xRight, xRight, xRight, "0vw", "0vw"]);
  const trY = useTransform(smoothProgress, [0, 0.3, 0.35, 0.65, 1], [yTop, yTop, yTop, "0vh", "0vh"]);

  const heroWidth = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], ["36vw", "36vw", "100vw", "100vw"]);
  const heroHeight = useTransform(smoothProgress, [0.65, 0.7, 0.9, 1], ["24vh", "24vh", "100dvh", "100dvh"]);

  const underImagesOpacity = useTransform(smoothProgress, [0.75, 0.85], [1, 0]);
  
  // Custom Opacity Maps for Integration
  const titleOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  // Starts once heroWidth/heroHeight reach full screen (0.9): any earlier and the children would ride the still-growing hero
  const contentOpacity = useTransform(smoothProgress, [0.9, 0.97], [0, 1]);
  // Kept out of layout until then, so children's whileInView only fires once they can be seen
  const contentDisplay = useTransform(smoothProgress, (v) => (v < 0.9 ? "none" : "flex"));

  const baseImageClasses = "absolute left-1/2 top-1/2 w-[36vw] h-[24vh] overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-muted shadow-2xl will-change-transform";

  return (
    // The animation plays over the first 300vh; the last 100vh keeps the expanded bus pinned so it can be read
    // before the sticky interior that follows in normal flow.
    <div className={cn("relative h-[400vh] w-full bg-black", className)}>
      <div ref={trackRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[300vh]" />
      <div className="sticky top-0 h-[100dvh] min-h-[100dvh] w-full overflow-hidden">
        
        {/* Section Title. On phones it sits higher (top-8) with mb-10 so it clears the 2x2 grid. */}
        <motion.div style={{ opacity: titleOpacity }} className="absolute top-20 left-0 w-full text-center z-50 px-4 max-md:top-8 max-md:mb-10">
          <h2 className="text-white text-5xl max-md:text-4xl md:text-7xl font-black uppercase tracking-tighter">
            Conheça Nossos Modelos
          </h2>
        </motion.div>

        {/* Scroll Helper Text */}
        <motion.div style={{ opacity: titleOpacity }} className="absolute bottom-12 left-0 w-full text-center z-50 pointer-events-none">
          <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.2em] animate-pulse">
            Continue rolando para baixo ↓
          </p>
        </motion.div>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div style={{ x: tlX, y: tlY, opacity: underImagesOpacity }} className={cn(baseImageClasses, "z-10")}>
            <GalleryPicture desktopSrc={images.topLeft} mobileSrc={mobileImages?.topLeft} alt="Gallery 1" />
          </motion.div>
          <motion.div style={{ x: brX, y: brY, opacity: underImagesOpacity }} className={cn(baseImageClasses, "z-20")}>
            <GalleryPicture desktopSrc={images.bottomRight} mobileSrc={mobileImages?.bottomRight} alt="Gallery 4" />
          </motion.div>
          <motion.div style={{ x: blX, y: blY, opacity: underImagesOpacity }} className={cn(baseImageClasses, "z-30")}>
            <GalleryPicture desktopSrc={images.bottomLeft} mobileSrc={mobileImages?.bottomLeft} alt="Gallery 3" />
          </motion.div>
          
          {/* Hero Image (Blue Bus) that expands */}
          <motion.div style={{ x: trX, y: trY, width: heroWidth, height: heroHeight }} className={cn(baseImageClasses, "z-40 origin-center")}>
            <GalleryPicture desktopSrc={images.topRight} mobileSrc={mobileImages?.topRight} alt="Hero Bus" />
            
            {/* Faded overlay to ensure text contrast when expanded */}
            <motion.div style={{ opacity: contentOpacity }} className="absolute inset-0 bg-black/60 z-10" />
          </motion.div>
        </div>

        {/* Children Content (Bus Details): pinned to the viewport rather than nested in the hero, so they never move with its size */}
        {/* z-50, not lower: the hero above is z-40 in this same stacking context */}
        <motion.div style={{ opacity: contentOpacity, display: contentDisplay }} className="absolute inset-0 z-50 flex flex-col justify-center">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
