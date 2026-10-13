"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
}

function layoutTop(el: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

export default function MotionStoryTransition({ children, className, zIndex = 20 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const rotate = useTransform(scrollY, (y) => {
    const el = ref.current;
    if (!el) return 12;
    const distance = window.innerHeight || 1;
    const progress = (y - (layoutTop(el) - distance)) / distance;
    return 12 * (1 - Math.min(1, Math.max(0, progress)));
  });

  return (
    <section
      ref={ref}
      style={{ zIndex }}
      className={cn("w-full max-md:relative max-md:h-auto max-md:overflow-x-clip md:sticky md:top-0 md:h-screen md:overflow-visible", className)}
    >
      <motion.div
        style={{ rotate, transformOrigin: "bottom left" }}
        className="w-full max-md:h-auto max-md:overflow-visible md:h-full md:overflow-hidden bg-black md:shadow-[0_-20px_50px_rgba(0,0,0,0.5)] will-change-transform max-md:!transform-none"
      >
        {children}
      </motion.div>
    </section>
  );
}