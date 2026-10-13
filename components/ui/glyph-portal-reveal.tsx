"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig, motion, useInView, type HTMLMotionProps } from "framer-motion";

type GlyphPortalRevealProps = Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "viewport">;

/**
 * Plays its `visible` variant (and its children's, via variant propagation) while the enclosing GlyphPortal is open,
 * and resets to `hidden` when it closes so the stagger replays on the way back in.
 * whileInView can't time this: the portal's content is sticky, so it counts as in view long before the portal reveals it.
 * When the portal falls back to a static layout, the content is in normal flow and a regular in-view trigger is used instead.
 */
export default function GlyphPortalReveal(props: GlyphPortalRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [isStatic, setStatic] = useState(false);
  const inView = useInView(ref, { once: false, amount: 0.1 });

  useEffect(() => {
    const section = ref.current?.closest("[data-gp-content]")?.parentElement;
    if (!section) return;
    const sync = () => {
      setEntered(section.dataset.gpEntered === "true");
      setStatic(section.dataset.gpMotion === "off");
    };
    const observer = new MutationObserver(sync);
    observer.observe(section, { attributes: true, attributeFilter: ["data-gp-entered", "data-gp-motion"] });
    return () => observer.disconnect();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div {...props} ref={ref} initial="hidden" animate={entered || (isStatic && inView) ? "visible" : "hidden"} />
    </MotionConfig>
  );
}
