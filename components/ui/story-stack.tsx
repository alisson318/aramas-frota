"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Children, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StoryStackProps {
  className?: string;
  children: ReactNode;
}

/**
 * Stacks each child like a deck of cards: a child scrolls normally until its bottom edge reaches the bottom of the
 * viewport, then stays pinned (shrinking and dimming) while the next child slides up over it.
 */
export function StoryStack({ className, children }: StoryStackProps) {
  const cards = Children.toArray(children);
  return (
    <div className={cn("relative", className)}>
      {cards.map((card, i) => (
        <StoryCard key={i} isLast={i === cards.length - 1}>
          {card}
        </StoryCard>
      ))}
    </div>
  );
}

function StoryCard({ isLast, children }: { isLast: boolean; children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);

  // Cards are taller than the viewport, so top: 0 would pin them before their own content scrolled past.
  // A negative top equal to the overflow pins each one only once its bottom edge reaches the bottom of the screen.
  // Applied after mount so the server render (and a failed hydration) falls back to plain scrolling.
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const pin = () => {
      card.style.position = "sticky";
      card.style.top = `${Math.min(0, window.innerHeight - card.offsetHeight)}px`;
    };
    pin();
    const observer = new ResizeObserver(pin);
    observer.observe(card);
    window.addEventListener("resize", pin);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", pin);
    };
  }, []);

  // Tracked through a static sentinel rather than the next card: offsetTop on a stuck element includes its sticky shift
  const { scrollYProgress } = useScroll({ target: nextRef, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.7]);

  return (
    <>
      {/* isolate keeps the high z-indexes inside a card (e.g. z-50 overlaps) from rising above the cards after it */}
      <motion.div
        ref={cardRef}
        style={isLast ? undefined : { scale, transformOrigin: "50% calc(100% - 50vh)" }}
        className="relative isolate"
      >
        {children}
        {!isLast && (
          <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-[999] bg-black" />
        )}
      </motion.div>
      <div ref={nextRef} aria-hidden />
    </>
  );
}

export default StoryStack;
