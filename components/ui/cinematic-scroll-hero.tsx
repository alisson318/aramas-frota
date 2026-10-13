'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { WATCH_VIDEO_EVENT } from '@/components/ui/watch-video-button';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

// Must match the `scroll-motion` custom variant in globals.css, which switches the markup between the
// pinned overlay layout and the plain stacked one. Browsers without the `scripting` feature get the stacked one.
const SCROLL_MOTION_QUERY = '(prefers-reduced-motion: no-preference) and (scripting: enabled)';

export interface CinematicScrollHeroProps {
  'aria-label'?: string;
  className?: string;
  /** Full-bleed layer behind everything; zooms in slightly while the card rises. */
  background?: React.ReactNode;
  /** First-screen copy. Scales up, blurs and fades as the card rises over it. */
  children: React.ReactNode;
  /**
   * Content of the card that slides up from below the viewport and then expands to fill it.
   * Descendants marked `data-scroll-hero="item"` stagger in as the card finishes expanding.
   */
  card: React.ReactNode;
  cardClassName?: string;
}

/**
 * Pins the first screen while the card scrolls up over the copy and takes over the viewport,
 * then releases the pin so the page continues. Without scroll motion the card simply stacks under the copy.
 */
export const CinematicScrollHero: React.FC<CinematicScrollHeroProps> = ({
  'aria-label': ariaLabel,
  className,
  background,
  children,
  card,
  cardClassName,
}) => {
  const spacerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const spacer = spacerRef.current;
      const section = sectionRef.current;
      if (!spacer || !section) return;

      const part = (name: string) => section.querySelector<HTMLElement>(`[data-scroll-hero="${name}"]`);
      const backdrop = part('background');
      const copy = part('copy');
      const panel = part('card');
      if (!copy || !panel) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-scroll-hero="item"]', panel);

      const mm = gsap.matchMedia();
      mm.add({ motion: SCROLL_MOTION_QUERY, wide: '(min-width: 768px)' }, (context) => {
        const { motion, wide } = context.conditions as { motion: boolean; wide: boolean };
        if (!motion) return;

        // Same values as the card's resting classes, so the expansion starts exactly where the CSS left it.
        const resting = wide ? { size: '85%', radius: 40 } : { size: '92%', radius: 32 };

        gsap.set(panel, { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=250%',
            pin: true,
            // Pre-rendered spacer: otherwise ScrollTrigger moves the section into its own spacer on every
            // refresh (resize, leaving fullscreen), which reloads the video iframe.
            pinSpacer: spacer,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(copy, { scale: 1.15, filter: 'blur(20px)', opacity: 0.2, ease: 'power2.inOut', duration: 2 }, 0);
        if (backdrop) tl.to(backdrop, { scale: 1.1, duration: 2 }, 0);
        tl.fromTo(panel, { y: () => window.innerHeight + 200 }, { y: 0, duration: 2 }, 0)
          .fromTo(
            panel,
            { width: resting.size, height: resting.size, borderRadius: resting.radius },
            { width: '100%', height: '100%', borderRadius: 0, duration: 1.5 },
          )
          .fromTo(
            items,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 1, ease: 'back.out(1.2)', stagger: 0.08 },
            '-=1',
          )
          .addLabel('revealed')
          .to({}, { duration: 1 });

        // The player sits below the fold inside a pinned, transformed card, where scrollIntoView lands
        // somewhere arbitrary in the timeline; jump to the point where the card has fully arrived instead.
        const onWatchVideo = (event: Event) => {
          if (!tl.scrollTrigger) return;
          event.preventDefault();
          window.scrollTo({ top: tl.scrollTrigger.labelToScroll('revealed'), behavior: 'smooth' });
        };
        section.addEventListener(WATCH_VIDEO_EVENT, onWatchVideo);
        return () => section.removeEventListener(WATCH_VIDEO_EVENT, onWatchVideo);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <div ref={spacerRef}>
      <section
        ref={sectionRef}
        aria-label={ariaLabel}
        className={cx(
          'relative flex min-h-[100dvh] w-full flex-col overflow-hidden scroll-motion:block scroll-motion:h-lvh scroll-motion:min-h-0',
          className,
        )}
      >
        {background && (
          <div data-scroll-hero="background" aria-hidden className="pointer-events-none absolute inset-0 z-0">
            {background}
          </div>
        )}

        <div data-scroll-hero="copy" className="relative z-10 scroll-motion:h-full scroll-motion:will-change-[transform,filter]">
          {children}
        </div>

        <div className="relative z-20 flex items-center justify-center px-4 pb-10 scroll-motion:pointer-events-none scroll-motion:absolute scroll-motion:inset-0 scroll-motion:p-0">
          <div
            data-scroll-hero="card"
            className={cx(
              'pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-[32px] md:rounded-[40px]',
              'scroll-motion:h-[92%] scroll-motion:w-[92%] md:scroll-motion:h-[85%] md:scroll-motion:w-[85%]',
              cardClassName,
            )}
          >
            {card}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CinematicScrollHero;
