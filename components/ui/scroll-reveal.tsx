'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface ScrollRevealProps {
  className?: string;
  children: React.ReactNode;
  /** Play the whole sequence on mount instead of on scroll. Use for the first screen. */
  playOnLoad?: boolean;
  /** Reveal everything as one timeline once the first element scrolls into view. Elements sharing a
   *  `data-reveal` number play together (staggered), and each number follows the one before it. */
  sequence?: boolean;
  /** ScrollTrigger start position for each element (or the first one, in a sequence). */
  start?: string;
  /** Seconds each element takes to fade and slide in. */
  duration?: number;
  /** Seconds between the start of one element and the next within a batch. */
  stagger?: number;
  /** Pixels each element slides up from. */
  distance?: number;
}

// clearProps drops the leftover translate(0, 0) so no ancestor of a video iframe stays transformed,
// which mobile WebKit is prone to misrouting taps on.
const revealTo = {
  y: 0,
  autoAlpha: 1,
  duration: 0.9,
  ease: 'power3.out',
  stagger: 0.15,
  clearProps: 'transform',
} satisfies gsap.TweenVars;

// ScrollTrigger only re-measures on load and resize, but GlyphPortal grows its scroll track a frame
// after mount, which would leave every trigger below (or inside) it at a stale position.
let pageHeightObserver: ResizeObserver | undefined;
function refreshOnPageResize() {
  if (pageHeightObserver) return;
  pageHeightObserver = new ResizeObserver(() => ScrollTrigger.refresh());
  pageHeightObserver.observe(document.body);
}

/**
 * Fades and slides each descendant marked with `data-reveal` up into view once it scrolls onto the
 * screen. Elements that enter together (a heading and its copy, a row of cards) are staggered as one
 * batch, in DOM order unless `data-reveal` holds a number, which sets their position in the sequence.
 * Each element has its own trigger, so tall stacked layouts on phones reveal as they're reached.
 * The hidden start state lives in globals.css so text doesn't flash before hydration.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  className,
  children,
  playOnLoad = false,
  sequence = false,
  start = 'top 85%',
  duration = revealTo.duration,
  stagger = revealTo.stagger,
  distance = 30,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const items = gsap.utils
        .toArray<HTMLElement>('[data-reveal]', root)
        .sort((a, b) => Number(a.dataset.reveal || 0) - Number(b.dataset.reveal || 0));
      if (items.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const to = { ...revealTo, duration, stagger };
        if (playOnLoad) {
          gsap.fromTo(items, { y: distance, autoAlpha: 0 }, { ...to, delay: 0.1 });
          return;
        }

        refreshOnPageResize();
        gsap.set(items, { y: distance, autoAlpha: 0 });

        if (sequence) {
          const steps = new Map<number, HTMLElement[]>();
          for (const item of items) {
            const step = Number(item.dataset.reveal || 0);
            steps.set(step, [...(steps.get(step) ?? []), item]);
          }
          const timeline = gsap.timeline({ scrollTrigger: { trigger: items[0], start, once: true } });
          [...steps.values()].forEach((step, i) => timeline.to(step, to, i === 0 ? 0 : '>-0.2'));
          return;
        }

        ScrollTrigger.batch(items, {
          start,
          once: true,
          onEnter: (batch) => gsap.to(batch, to),
        });
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [playOnLoad, sequence, start, duration, stagger, distance] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
