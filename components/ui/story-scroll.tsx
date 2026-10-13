'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  id,
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  // Pre-rendered pin spacer: without it ScrollTrigger inserts its own and moves the section out of and back
  // into it on every refresh (e.g. resize, leaving fullscreen), which reloads any iframe inside.
  // The id lives on the spacer because it stays in normal flow while the section itself is pinned.
  <div data-flow-spacer id={id}>
    <section
      data-flow-section
      aria-label={ariaLabel}
      className={cx('relative w-full', className)}
    >
      {/* No flex, min-height or padding: the content is full-bleed and relies on exact heights for its negative-margin overlaps */}
      <div
        data-flow-inner
        className={cx(
          'flow-art-container relative w-full bg-black',
          'will-change-transform',
        )}
        style={{ transformOrigin: 'bottom left', ...style }}
      >
        {children}
      </div>
    </section>
  </div>
);

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

          // Without this, a scrollable panel captures wheel/touch while it is still
          // sliding in, scrolling its own content instead of advancing the page.
          const overflowY = getComputedStyle(inner).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            gsap.set(inner, { overflowY: 'hidden' });
            triggers.push(
              ScrollTrigger.create({
                trigger: section,
                start: 'top 1px',
                onToggle: (self) =>
                  gsap.set(inner, { overflowY: self.isActive ? overflowY : 'hidden' }),
              }),
            );
          }
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacer: section.parentElement,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full bg-black', className)}
    >
      {children}
    </main>
  );
};

export default FlowArt;
