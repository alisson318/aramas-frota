'use client';

import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export interface CinematicHeroRevealProps {
  className?: string;
  children: React.ReactNode;
}

// scaleX/scaleY rather than the `scale` shorthand: GSAP reads the shorthand's Y start from its transform
// cache instead of the fromTo start values, which left scaleY stuck at 1 and squashed the text horizontally.
const shown = { autoAlpha: 1, y: 0, scaleX: 1, scaleY: 1, rotationX: 0, filter: 'blur(0px)' } satisfies gsap.TweenVars;
const scaled = (s: number) => ({ scaleX: s, scaleY: s });

/**
 * Plays the first-screen entrance as one cinematic timeline on mount. Descendants opt in with
 * `data-hero` set to one of: tagline, title, accent (a span inside the title that wipes in from
 * the left), subtitle, actions, media, features, feature (items inside the features bar).
 * Each role has its own slot in the timeline, so the entrance order is independent of DOM order.
 * The hidden start state lives in globals.css so text doesn't flash before hydration.
 */
export const CinematicHeroReveal: React.FC<CinematicHeroRevealProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = (role: string) => gsap.utils.toArray<HTMLElement>(`[data-hero="${role}"]`, root);

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // clearProps drops the leftover transform/filter so no ancestor of a video iframe stays transformed
        // (mobile WebKit misroutes taps) and the features bar's backdrop-blur works again once it lands.
        gsap
          .timeline({ delay: 0.3, defaults: { ease: 'expo.out', clearProps: 'transform,filter' } })
          .fromTo(q('tagline'), { autoAlpha: 0, y: 30, filter: 'blur(10px)' }, { ...shown, duration: 1.2 }, 0)
          .fromTo(
            q('title'),
            { autoAlpha: 0, y: 60, ...scaled(0.85), rotationX: -20, filter: 'blur(20px)', transformPerspective: 1000 },
            { ...shown, transformPerspective: 1000, duration: 1.8 },
            0.2,
          )
          .fromTo(
            q('accent'),
            { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' },
            { autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power4.inOut', clearProps: 'clipPath' },
            0.8,
          )
          .fromTo(q('subtitle'), { autoAlpha: 0, y: 40, filter: 'blur(12px)' }, { ...shown, duration: 1.4 }, 1.0)
          .fromTo(q('actions'), { autoAlpha: 0, y: 40, filter: 'blur(12px)' }, { ...shown, duration: 1.4 }, 1.2)
          .fromTo(
            q('media'),
            { autoAlpha: 0, y: 120, ...scaled(0.85), rotationX: 25, filter: 'blur(20px)', transformPerspective: 1500 },
            { ...shown, transformPerspective: 1500, duration: 2 },
            1.4,
          )
          .fromTo(q('features'), { autoAlpha: 0, y: 40 }, { ...shown, duration: 1.2 }, 1.8)
          .fromTo(
            q('feature'),
            { autoAlpha: 0, y: 20, ...scaled(0.95) },
            { ...shown, duration: 1, ease: 'back.out(1.2)', stagger: 0.08 },
            2.0,
          );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default CinematicHeroReveal;
