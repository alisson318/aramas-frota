'use client';

import { useEffect, type ReactNode } from 'react';
import * as motion from 'framer-motion/client';
import type { Variants } from 'framer-motion';
import GlyphPortal from '@/components/ui/glyph-portal';
import GlyphPortalReveal from '@/components/ui/glyph-portal-reveal';
import InteriorFeatureCards, { type InteriorFeatureCard } from '@/components/ui/interior-feature-cards';
import PremiumVideoPlayer from '@/components/ui/premium-video-player';
import { ScrollChoreography } from '@/components/ui/scroll-choreography';
import MotionStoryTransition from '@/components/ui/motion-story-transition';
import FaqFrota from '@/components/ui/faq-frota';
import { Button } from '@/components/ui/button';
import {
  Snowflake,
  Wifi,
  Plug,
  ShieldCheck,
  Earth,
  Bed,
  Users,
  Briefcase,
  Layers,
  MonitorPlay,
  Zap,
  Armchair,
  MoveRight,
  type LucideIcon,
} from 'lucide-react';

const FLEET_FEATURES: { icon: LucideIcon; label: string }[] = [
  { icon: Armchair, label: 'Poltronas confortáveis' },
  { icon: Snowflake, label: 'Ar-condicionado em toda a frota' },
  { icon: Wifi, label: 'Internet Starlink a bordo' },
  { icon: Plug, label: 'Tomadas USB em todas as poltronas' },
  { icon: ShieldCheck, label: 'Segurança em primeiro lugar' },
  { icon: Users, label: 'Ideal para turismo, fretamento e eventos' },
];

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// Callers override the base padding/min-height with Tailwind's `!` modifier, since both land on the same element.
function Section({
  id,
  className,
  children,
  'aria-label': ariaLabel,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`relative flex min-h-[100svh] w-full flex-col justify-between gap-6 overflow-hidden px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw] ${className ?? ''}`}
    >
      {children}
    </section>
  );
}

// Sticky sections can't be snap targets themselves: Chrome measures them at their stuck position, so scrolling up skips them.
// This static marker sits where the section starts in the flow instead. Hidden below md, where the page doesn't snap.
function SnapPoint({ className }: { className?: string }) {
  return <div aria-hidden className={`hidden md:block md:snap-start md:snap-always ${className ?? ''}`} />;
}

type InteriorFeature = InteriorFeatureCard;

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`;

const INTERIOR_2020: InteriorFeature[] = [
  {
    icon: 'Armchair',
    title: 'Poltronas',
    description: '44 poltronas Semi-Leito no piso superior e 06 Leito Cama no inferior, com amplo espaço para as pernas.',
    image: '/assets/images/onibus-azul-card-1.jpg',
  },
  {
    icon: 'AirVent',
    title: 'Climatização & Energia',
    description: 'Ar-condicionado inteligente em todos os ambientes e tomadas USB individuais para seus dispositivos.',
    image: '/assets/images/onibus-azul-card-2.jpg',
  },
  {
    icon: 'Toilet',
    title: 'Banheiro a Bordo',
    description: 'Sanitário premium rigorosamente higienizado, com frigobar abastecido durante toda a viagem.',
    image: '/assets/images/onibus-azul-card-3.jpg',
  },
  {
    icon: 'Luggage',
    title: 'Bagageiro Amplo',
    description: 'Compartimentos espaçosos, ideais para as bagagens de grandes grupos e excursões.',
    image: '/assets/images/onibus-azul-card-4.jpg',
  },
  {
    icon: 'Lightbulb',
    title: 'Iluminação em LED',
    description: 'Iluminação ambiente moderna que cria um clima acolhedor a bordo, de dia ou à noite.',
    image: unsplash('1563089145-599997674d42'),
    className: 'max-md:hidden',
  },
  {
    icon: 'MountainSnow',
    title: 'Vista Panorâmica',
    description: 'Janelas amplas no piso superior para apreciar cada paisagem ao longo do trajeto.',
    image: unsplash('1436491865332-7a61a109cc05'),
    className: 'max-md:hidden',
  },
];

const INTERIOR_2025: InteriorFeature[] = [
  {
    icon: 'Armchair',
    title: 'Poltronas',
    description: '48 Semi-Leito no piso superior e 08 Leito Cama no inferior, com reclinação máxima para descansar de verdade.',
    image: '/assets/images/card-rosa-poltronas.jpg',
  },
  {
    icon: 'AirVent',
    title: 'Climatização & Energia',
    description: 'Ar-condicionado em todo o veículo, tomadas USB individuais, Internet Starlink a bordo e 08 televisores individuais no piso inferior.',
    image: '/assets/images/card-rosa-climatizacao.jpg',
  },
  {
    icon: 'Toilet',
    title: 'Banheiro a Bordo',
    description: 'Sanitário sempre higienizado e 2 frigobares para uma viagem sem paradas desnecessárias.',
    image: '/assets/images/card-rosa-banheiro.jpg',
  },
  {
    icon: 'Luggage',
    title: 'Bagageiro Amplo',
    description: 'Bagageiro de grande capacidade para acomodar as malas de todos os 56 passageiros.',
    image: '/assets/images/card-rosa-bagageiro.jpg',
  },
];

const INTERIOR_LD: InteriorFeature[] = [
  {
    icon: 'Armchair',
    title: 'Poltronas',
    description: '44 poltronas Semi-Leito reclináveis, pensadas para o descanso em viagens de média e longa distância.',
    image: '/assets/images/card-ld-poltronas.jpg',
  },
  {
    icon: 'AirVent',
    title: 'Climatização & Energia',
    description: 'Ar-condicionado em todo o salão, tomadas USB individuais e Internet Starlink para viajar conectado.',
    image: '/assets/images/card-ld-climatizacao.jpg',
  },
  {
    icon: 'Toilet',
    title: 'Banheiro a Bordo',
    description: 'Banheiro rigorosamente higienizado e frigobar a bordo para bebidas sempre geladas.',
    image: '/assets/images/card-ld-banheiro.jpg',
  },
  {
    icon: 'Luggage',
    title: 'Bagageiro Amplo',
    description: 'Bagageiro inferior de alta capacidade, com espaço de sobra para grupos médios e grandes.',
    image: '/assets/images/card-ld-bagageiro.jpg',
  },
];

// Full class strings (not interpolated color names) so Tailwind can detect them at build time.
const INTERIOR_THEMES = {
  blue: {
    accent: 'text-blue-500',
    rule: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-400',
    edge: 'via-blue-500/80',
    ambient: 'from-blue-950/40 via-black/50 to-black/80',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_-12px_30px_rgba(59,130,246,0.35)] hover:shadow-[0_-12px_36px_rgba(59,130,246,0.6)]',
    videoFrame: 'border border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.3)]',
    playButton: 'bg-blue-500/70 shadow-[0_0_30px_rgba(59,130,246,0.6)]',
  },
  pink: {
    accent: 'text-pink-500',
    rule: 'bg-pink-500',
    gradient: 'from-pink-500 to-purple-400',
    edge: 'via-pink-500/80',
    ambient: 'from-pink-950/30 via-black/50 to-black/80',
    border: 'border-pink-500/30',
    glow: 'shadow-[0_-12px_30px_rgba(236,72,153,0.35)] hover:shadow-[0_-12px_36px_rgba(236,72,153,0.6)]',
    videoFrame: 'border border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.3)]',
    playButton: 'bg-pink-500/70 shadow-[0_0_30px_rgba(236,72,153,0.6)]',
  },
  red: {
    accent: 'text-[#FF453A]',
    rule: 'bg-[#FF453A]',
    gradient: 'from-[#FF453A] to-orange-400',
    edge: 'via-[#FF453A]/80',
    ambient: 'from-orange-950/30 via-black/50 to-black/80',
    border: 'border-[#FF453A]/30',
    glow: 'shadow-[0_-12px_30px_rgba(255,69,58,0.35)] hover:shadow-[0_-12px_36px_rgba(255,69,58,0.6)]',
    videoFrame: 'border border-[#FF453A]/40 shadow-[0_0_40px_rgba(255,69,58,0.3)]',
    playButton: 'bg-[#FF453A]/70 shadow-[0_0_30px_rgba(255,69,58,0.6)]',
  },
} as const;

function InteriorSection({
  label,
  features,
  theme,
  videoId,
  cover,
  className,
}: {
  label: string;
  features: InteriorFeature[];
  theme: keyof typeof INTERIOR_THEMES;
  videoId: string;
  cover: string;
  className?: string;
}) {
  const t = INTERIOR_THEMES[theme];
  return (
    <Section
      aria-label={label}
      className={`relative h-auto min-h-[100svh]! lg:h-[100dvh] lg:min-h-0! max-md:pt-28 max-md:pb-12 bg-black text-white bg-[url('/assets/images/interior-premium-mobile-bg.jpg')] md:bg-[url('/assets/images/interior-premium-bg.jpg')] bg-cover bg-bottom bg-no-repeat ${className ?? ''}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div aria-hidden className={`pointer-events-none absolute inset-0 z-0 bg-radial ${t.ambient}`} />

      {/* Below lg the children stack in DOM order (header, video, cards); on lg the video spans both rows of the right column.
          content-center packs the two left rows together instead of stretching them apart to fill the fixed-height section. */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-center gap-8 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-12 lg:gap-y-8 w-full max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center md:text-left lg:col-span-8 lg:row-start-1 lg:self-end"
        >
          <p className={`text-xs font-bold uppercase tracking-widest ${t.accent}`}>
            Detalhes — Interior
          </p>
          {/* Short laptop screens (e.g. 1280x720) can't fit the full-size heading plus the card row inside the fixed-height section */}
          <h2 className="mt-4 text-5xl md:text-7xl xl:text-[5.5rem] lg:[@media(max-height:820px)]:text-6xl font-black leading-[0.85] uppercase tracking-tight">
            <span className="block text-white">Estrutura</span>
            <span className={`block pb-1 bg-gradient-to-r ${t.gradient} bg-clip-text text-transparent`}>
              Completa
            </span>
          </h2>
          <p className="mt-3 max-w-md mx-auto md:mx-0 text-sm leading-relaxed text-gray-400">
            Cada detalhe pensado para oferecer mais conforto, praticidade e bem-estar em todas as viagens.
          </p>
          <p aria-hidden className="mt-4 hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            Deslize para explorar
            <MoveRight className="size-4" />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          {/* Height is capped through max-width (75vh on phones, 60vh on tablets, viewport minus padding on desktop): a plain
              max-height on a w-full box would override aspect-[9/16] and squash the frame instead of shrinking it.
              The 90% lives inside max-w so it doesn't fight the player's own w-full. */}
          <PremiumVideoPlayer
            videoId={videoId}
            cover={cover}
            title={label}
            playButtonClassName={t.playButton}
            className={`max-w-[min(90%,400px,calc(75vh*9/16))] md:max-w-[min(350px,calc(60vh*9/16))] lg:max-w-[min(350px,calc((100svh-8rem)*9/16))] mx-auto ${t.videoFrame}`}
          />
        </motion.div>

        <InteriorFeatureCards features={features} theme={t} />
      </div>
    </Section>
  );
}

export default function AramasFrota() {
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-black overflow-x-clip w-full">
      {/* SECTION 1: FLEET HERO */}
      {/* Scrolling flies the camera through a letter of FROTA into the photo, where the video and features fade in.
          The skip link is hidden and the content padding overridden in globals.css under .fleet-portal. */}
      {/* The `!` is required: the portal's own default --gp-paper is unlayered CSS, which beats Tailwind's layered utilities.
          bg-fixed sizes the desktop image to the viewport; otherwise `cover` stretches it over the whole multi-screen scroll track.
          iOS Safari ignores bg-fixed, so mobile repaints the paper on the sticky, viewport-sized pin instead. */}
      <GlyphPortal
        word="FROTA"
        interactive={false}
        scrollLength={2.0}
        // Not var(--font-plus-jakarta): its never-loaded "Fallback" face makes the portal treat the font as pending and stay static
        fontFamily='"Plus Jakarta Sans", Arial, sans-serif'
        fontWeight={800}
        className="fleet-portal md:snap-start md:snap-always [--gp-paper:url('/assets/images/bg-hero-portal-mobile.jpg')_center/cover_no-repeat]! max-lg:[&_[data-gp-pin]]:[background:var(--gp-paper)] lg:[--gp-paper:url('/assets/images/bg-hero-portal.jpg')_center/cover_no-repeat]! lg:bg-fixed!"
        style={{ '--gp-ink': '#fff', '--gp-field': '#000', '--gp-foreground': '#fff' }}
        background={
          <div className="absolute inset-0 [transform:scale(var(--gp-field-scale,1))] bg-[url('/assets/images/bg_hero_frota_mobile_claros.jpg')] lg:bg-[url('/assets/images/bg-hero-frota.jpg')] bg-cover bg-center bg-no-repeat">
            {/* The photo's sky is near-black, so a top glow keeps the upper half of the letters readable; mobile stays dark throughout */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 via-45% to-transparent opacity-[calc(1_-_var(--gp-reveal,0))] max-lg:hidden" />
            {/* Mobile: a constant cinematic darkening, so the letters show the photo and the video lands over the same tint */}
            <div className="absolute inset-0 bg-black/40 lg:hidden" />
            {/* Desktop dims the photo only once the video and features fade in over it, so the letters show it at full color */}
            <div className="absolute inset-0 bg-black/70 opacity-[var(--gp-reveal,0)] max-lg:hidden" />
          </div>
        }
        front={
          // Static wrapper, so the absolute children still position against the portal; text-shadow inherits and lifts them off the desktop image
          <div className="[text-shadow:0_1px_2px_rgb(0_0_0/0.6),0_2px_16px_rgb(0_0_0/0.75)]">
            <h1 className="absolute inset-x-6 bottom-[calc(100%_-_var(--gp-word-top,39%)_+_1.5rem)] text-center text-xs md:text-sm font-semibold uppercase tracking-[0.4em] text-white/90">
              Conheça a nossa<span className="sr-only"> frota</span>
            </h1>
            <p className="absolute inset-x-6 top-[calc(var(--gp-word-bottom,71%)_+_1.5rem)] mx-auto max-w-xl text-center text-lg md:text-2xl font-light leading-snug text-white text-balance">
              Veículos de última geração para o seu destino.
            </p>
            <p className="absolute inset-x-0 bottom-0 pb-8 text-center text-xs uppercase tracking-widest text-white/75 motion-safe:animate-pulse">
              Role para explorar <span aria-hidden>↓</span>
            </p>
          </div>
        }
      >
        <GlyphPortalReveal
          variants={{ visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } } }}
          className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 lg:gap-10 bg-transparent"
        >
          {/* The 60svh height limit is expressed as a 16:9 width cap: max-height on an aspect-ratio box would squash it out of 16:9 */}
          <motion.div variants={FADE_UP} className="relative pt-12 lg:pt-16">
            {/* Mobile-only, out of flow so the centered video and features don't move; its bottom sits on the video's top edge */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
              // pb-14 matches the gap from the video to the features; short screens have no room above the video for it, or below 600px for the title
              className="absolute inset-x-0 bottom-[calc(100%-3rem)] z-10 flex flex-col px-4 pb-14 [@media(max-height:700px)]:pb-6 [@media(max-height:600px)]:hidden text-center lg:hidden"
            >
              <span className="mb-1 text-4xl md:text-5xl font-extrabold uppercase leading-none tracking-tight text-white">
                Viaje no
              </span>
              {/* Sized to the viewport so it stays on one line: wrapped at this leading, the Í accent collides with the line above.
                  pt-1 extends the gradient over the accent, which rises above the tight line box; -mt-1 keeps the lines together */}
              <span className="-mt-1 pt-1 text-[min(calc(11vw-4px),3.75rem)] font-black uppercase leading-[0.85] tracking-tight bg-gradient-to-r from-red-500 via-amber-400 to-white bg-clip-text text-transparent">
                Mais Alto Nível
              </span>
            </motion.h2>
            <PremiumVideoPlayer
              videoId="zBAxf2pG-E4"
              cover="/assets/images/capa-video-hero-v4.jpg"
              title="Conheça a frota Aramas Tur"
              orientation="horizontal"
              playButtonClassName="bg-white/20 group-hover:bg-white/30 group-focus-visible:bg-white/30 text-white"
              className={`mx-auto w-full max-w-[min(56rem,calc(60svh*16/9))] lg:max-w-[min(64rem,calc(60svh*16/9))] ${INTERIOR_THEMES.blue.videoFrame}`}
            />
          </motion.div>

          {/* Two columns on phones; md and lg can't fit six 200px items, so the row scrolls there; from xl they share the width evenly */}
          <motion.ul variants={FADE_UP} className="w-full border-t border-white/10 pt-6 scroll-px-4 flex flex-wrap md:flex-nowrap justify-between gap-4 md:gap-6 overflow-x-auto snap-x hide-scrollbar">
            {FLEET_FEATURES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex shrink-0 items-center gap-3 snap-start w-[calc(50%-0.5rem)] md:w-[200px] xl:w-auto xl:min-w-0 xl:grow xl:shrink xl:basis-0 text-sm text-white/80"
              >
                <Icon aria-hidden size={24} className="shrink-0 text-white" />
                {label}
              </li>
            ))}
          </motion.ul>
        </GlyphPortalReveal>
      </GlyphPortal>

      {/* SECTION 2: GALLERY TRANSITION + 2020 BUS HERO */}
      {/* Own stacking context so the gallery's internal z-50 cannot paint over the buses that follow */}
      <div className="relative w-full z-10 bg-black md:snap-start md:snap-always">
        {/* The gallery's animation finishes 200vh into its track, leaving the 2020 bus fully expanded */}
        <SnapPoint className="pointer-events-none absolute inset-x-0 top-[200vh]" />
        {/* topRight is the image that expands to full screen, so the 2020 bus section is rendered on top of it */}
        <ScrollChoreography
          images={{
            topLeft: "/assets/images/frota-galeria-1.jpg",
            topRight: "/assets/images/frota-galeria-2.jpg", // The blue bus that expands
            bottomLeft: "/assets/images/frota-galeria-3.jpg",
            bottomRight: "/assets/images/frota-galeria-4.jpg"
          }}
          mobileImages={{
            topLeft: "/assets/images/frota-galeria-1-mobile.jpg",
            topRight: "/assets/images/frota-galeria-2-mobile.jpg",
            bottomLeft: "/assets/images/frota-galeria-3-mobile.jpg",
            bottomRight: "/assets/images/frota-galeria-4-mobile.jpg"
          }}
        >
          {/* max-md:min-h-[100svh] beats Section's min-h-screen (100vh), which on mobile is taller
              than the visible area and jumps as the browser chrome shows and hides. Mobile uses its
              own background; desktop keeps md:bg-none so the expanded gallery image shows through. */}
          <Section
            id="marcopolo-2020"
            aria-label="Marcopolo 2020"
            className="relative max-md:min-h-[100svh] max-md:bg-black text-white max-md:bg-[url('/assets/images/onibus-marcopolo-2020-mobile-bg.jpg')] max-md:bg-cover max-md:bg-center max-md:bg-no-repeat md:bg-none"
          >
            {/* Mobile: darken only the top behind the title; the text block below carries its own gradient */}
            <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/80 to-transparent z-0 md:hidden"></div>
            {/* Desktop: overlay restricted to the left side so the bus on the right is completely clear */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent w-full md:w-2/3 z-0 hidden md:block"></div>

            {/* Opacity-only fades instead of ScrollReveal: the details materialize in place, with no slide-up */}
            <div className="relative z-10 flex flex-col flex-1 justify-between md:justify-center max-w-3xl gap-4 md:gap-8 md:py-10">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="text-center md:text-left pt-32 md:pt-0 will-change-[opacity]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-2 md:mb-3">
                  01 — Frota Premium
                </p>
                <h2 className="text-[2.75rem] md:text-6xl lg:text-7xl font-bold leading-[0.9] uppercase tracking-tight">
                  Marcopolo
                  <br />
                  Paradiso DD
                  <br />
                  <span className="text-gray-400 text-4xl md:text-5xl lg:text-6xl">2020</span>
                </h2>
              </motion.div>

              <div className="flex flex-col gap-3 md:gap-8 -mx-[4vw] -mb-[4vw] px-[4vw] pt-8 pb-12 bg-gradient-to-b from-transparent via-black/85 via-25% to-black md:mx-0 md:mb-0 md:px-0 md:pt-0 md:pb-0 md:bg-none">
                {/* On short phones (e.g. iPhone SE) the description is dropped so the specs and button still fit */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  className="will-change-[opacity] max-md:[@media(max-height:640px)]:hidden"
                >
                  <p className="max-w-[55ch] text-[15px] leading-snug md:text-lg md:leading-relaxed font-normal text-gray-300">
                    A união perfeita entre luxo, tecnologia e segurança. O veículo ideal para excursões, viagens corporativas e turismo de lazer, projetado para oferecer o máximo de conforto em longas distâncias.
                  </p>
                </motion.div>

                {/* Essential Chartering Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-6 md:mt-2 will-change-[opacity]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-blue-500">
                      <Users size={20} className="shrink-0 size-4 md:size-5" />
                      <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Capacidade</p>
                    </div>
                    <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                      50 passageiros acomodados com total conforto.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-blue-500">
                      <Bed size={20} className="shrink-0 size-4 md:size-5" />
                      <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Leito Cama</p>
                    </div>
                    <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                      06 poltronas com reclinação máxima no piso inferior.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-blue-500">
                      <Earth size={20} className="shrink-0 size-4 md:size-5" />
                      <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Internet Starlink</p>
                    </div>
                    <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                      Wi-Fi via satélite de alta velocidade contínua.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-blue-500">
                      <Briefcase size={20} className="shrink-0 size-4 md:size-5" />
                      <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Amplo Bagageiro</p>
                    </div>
                    <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                      Espaço ideal para bagagens de grandes grupos.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.1, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  className="md:mt-4 will-change-[opacity]"
                >
                  <Button asChild className="h-auto w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 md:py-3 px-8 rounded-full transition duration-300 shadow-lg text-sm uppercase tracking-wide focus-visible:ring-white/50">
                    <a
                      href="https://wa.me/554491366418?text=Ol%C3%A1%21%20Tenho%20interesse%20em%20fazer%20um%20fretamento%20do%20%C3%B4nibus%20azul."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Reservar este Ônibus
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </Section>
        </ScrollChoreography>
      </div>

      {/* SECTION 3: 2020 INTERIOR */}
      {/* Sticks at z-20 so the pink hero, rotating in at z-30, can cover it */}
      <SnapPoint />
      <InteriorSection
        label="Interior do Ônibus Paradiso DD 2020"
        features={INTERIOR_2020}
        theme="blue"
        videoId="elkyq5GXDns"
        cover="/assets/images/capa-video-azul.jpg"
        className="max-md:-mt-2 max-md:relative max-md:h-auto max-md:overflow-visible md:sticky md:top-0 z-20 md:min-h-screen w-full md:overflow-hidden bg-[#0a0a0a] flex flex-col justify-center"
      />

      {/* SECTION 4: 2025 BUS HERO */}
      {/* Sticky on the transition itself: the tilt covers the blue details, then this hero stays put */}
      <SnapPoint />
      <MotionStoryTransition zIndex={30} className="sticky top-0 h-[100dvh] w-full">
        <Section
          aria-label="Marcopolo 2025"
          className="max-md:min-h-[100svh] bg-black bg-no-repeat max-md:bg-[length:100%_auto] max-md:bg-top md:bg-cover md:bg-bottom md:bg-right text-white max-md:bg-[url('/assets/images/onibus-marcopolo-2025-rosa-mobile-bg.jpg')] md:bg-[url('/assets/images/onibus-marcopolo-2025-rosa-bg.jpg')]"
        >
          <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/80 to-transparent z-0 md:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent w-full md:w-2/3 z-0 hidden md:block"></div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col flex-1 justify-between md:justify-center max-w-3xl gap-4 md:gap-8 md:py-10"
          >
            <div className="text-center md:text-left pt-32 md:pt-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500 mb-2 md:mb-3">
                02 — Frota Premium
              </p>
              <h2 className="text-[2.75rem] md:text-6xl lg:text-7xl font-bold leading-[0.9] uppercase tracking-tight">
                Marcopolo
                <br />
                Paradiso DD
                <br />
                <span className="text-gray-400 text-4xl md:text-5xl lg:text-6xl">2025</span>
              </h2>
            </div>
            
            <div className="flex flex-col gap-3 md:gap-8 -mx-[4vw] max-md:mb-0 px-[4vw] max-md:pt-16 max-md:pb-12 max-md:bg-gradient-to-t max-md:from-black max-md:via-black/95 max-md:to-transparent md:mx-0 md:mb-0 md:px-0 md:pt-0 md:pb-0 md:bg-none">
              <p className="max-w-[55ch] text-[15px] leading-snug md:text-lg md:leading-relaxed font-normal text-gray-300 max-md:[@media(max-height:640px)]:hidden">
                O mais novo integrante da frota. Dois pisos de puro conforto, entretenimento a bordo e conectividade via satélite para transformar cada quilômetro em parte da experiência.
              </p>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-6 md:mt-2">
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-pink-500">
                    <Users size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Capacidade</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    56 passageiros no total, distribuídos em dois pisos.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-pink-500">
                    <Layers size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Distribuição</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    48 Semi Leito no piso superior e 08 Leito Cama no piso inferior.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-pink-500">
                    <MonitorPlay size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Entretenimento</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    CD, DVD e 6 televisores espalhados pelo veículo.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-pink-500">
                    <Zap size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Conectividade & Energia</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    Internet Starlink e tomadas individuais para seus dispositivos.
                  </p>
                </div>
              </div>
              
              <div className="md:mt-4">
                <Button asChild className="h-auto w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 md:py-3 px-8 rounded-full transition duration-300 shadow-lg text-sm uppercase tracking-wide focus-visible:ring-white/50">
                  <a
                    href="https://wa.me/554491366418?text=Ol%C3%A1%21%20Tenho%20interesse%20em%20fazer%20um%20fretamento%20do%20%C3%B4nibus%20rosa."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reservar este Ônibus
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </Section>
      </MotionStoryTransition>

      {/* SECTION 5: 2025 INTERIOR */}
      {/* Slides over the stuck pink hero, then sticks so the red hero can cover it */}
      <SnapPoint />
      <InteriorSection
        label="Interior do Ônibus Paradiso DD 2025"
        features={INTERIOR_2025}
        theme="pink"
        videoId="V0YpE7nSHRk"
        cover="/assets/images/capa-video-rosa.jpg"
        className="max-md:-mt-2 max-md:relative max-md:h-auto max-md:overflow-visible md:sticky! md:top-0 z-40 md:min-h-screen w-full md:overflow-hidden bg-[#0a0a0a] flex flex-col justify-center"
      />

      {/* SECTION 6: 2018/2019 LD BUS HERO */}
      {/* Sticky on the transition: it rotates over the pink details and then stays put */}
      <SnapPoint />
      <MotionStoryTransition zIndex={50} className="sticky top-0 h-[100dvh] w-full">
        <Section
          aria-label="Marcopolo Paradiso LD 2018 e 2019"
          className="max-md:min-h-[100svh] bg-black bg-no-repeat max-md:bg-[length:100%_auto] max-md:bg-center md:bg-cover md:bg-bottom md:bg-right text-white max-md:bg-[url('/assets/images/onibus-marcopolo-ld-2018-2019-mobile-bg.jpg')] md:bg-[url('/assets/images/onibus-marcopolo-ld-2018-2019-bg.jpg')]"
        >
          <div className="absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/80 to-transparent z-0 md:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent w-full md:w-2/3 z-0 hidden md:block"></div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col flex-1 justify-between md:justify-center max-w-3xl gap-4 md:gap-8 md:py-10"
          >
            <div className="text-center md:text-left pt-32 md:pt-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF453A] mb-2 md:mb-3">
                03 — Frota Premium
              </p>
              <h2 className="text-[2.75rem] md:text-6xl lg:text-7xl font-bold leading-[0.9] uppercase tracking-tight">
                Marcopolo
                <br />
                Paradiso LD
                <br />
                <span className="text-gray-400 text-4xl md:text-5xl lg:text-6xl">2018 / 2019</span>
              </h2>
              <span className="inline-flex items-center mt-3 md:mt-4 px-3 py-1 rounded-full border border-[#FF453A]/60 bg-[#FF453A]/15 text-[11px] md:text-xs font-bold uppercase tracking-wider text-white">
                Duas unidades idênticas disponíveis
              </span>
            </div>
            
            <div className="flex flex-col gap-3 md:gap-8 -mx-[4vw] max-md:mb-0 px-[4vw] max-md:pt-16 max-md:pb-12 max-md:bg-gradient-to-t max-md:from-black max-md:via-black/95 max-md:to-transparent md:mx-0 md:mb-0 md:px-0 md:pt-0 md:pb-0 md:bg-none">
              <p className="max-w-[55ch] text-[15px] leading-snug md:text-lg md:leading-relaxed font-normal text-gray-300 max-md:[@media(max-height:640px)]:hidden">
                Padrão de excelência para grupos médios e grandes. Veículos equipados com o máximo de conforto, ideal para viagens seguras e conectadas.
              </p>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-6 md:mt-2">
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-[#FF453A]">
                    <Users size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Capacidade</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    44 passageiros acomodados com total conforto.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-[#FF453A]">
                    <Armchair size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Conforto</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    Poltronas Semi Leito padrão em todo o veículo.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-[#FF453A]">
                    <MonitorPlay size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Entretenimento</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    4 televisores, CD e DVD a bordo.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 text-[#FF453A]">
                    <Zap size={20} className="shrink-0 size-4 md:size-5" />
                    <p className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-white">Conectividade & Energia</p>
                  </div>
                  <p className="text-[13px] leading-snug md:text-sm md:leading-relaxed opacity-75">
                    Internet Starlink e tomadas individuais para seus dispositivos.
                  </p>
                </div>
              </div>
              
              <div className="md:mt-4">
                <Button asChild className="h-auto w-full md:w-auto bg-[#FF453A] hover:bg-red-600 text-white font-bold py-2.5 md:py-3 px-8 rounded-full transition duration-300 shadow-lg text-sm uppercase tracking-wide focus-visible:ring-white/50">
                  <a
                    href="https://wa.me/554491366418?text=Ol%C3%A1%21%20Tenho%20interesse%20em%20fazer%20um%20fretamento%20do%20%C3%B4nibus%20vermelho."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reservar este Ônibus
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </Section>
      </MotionStoryTransition>

      {/* SECTION 7: 2018/2019 LD INTERIOR */}
      {/* Last plate: scrolls over the stuck red hero and does not stick */}
      <InteriorSection
        label="Interior do Ônibus Paradiso LD 2018 e 2019"
        features={INTERIOR_LD}
        theme="red"
        videoId="_htO2EOx2RU"
        cover="/assets/images/capa-video-ld.jpg"
        className="max-md:-mt-2 md:snap-start md:snap-always relative z-[60] min-h-[100dvh] w-full overflow-hidden bg-[#0a0a0a] flex flex-col justify-center"
      />

      {/* SECTION 8: FAQ */}
      {/* The red hero stays stuck (z-50) until <main> ends, so the FAQ needs the same layer as the LD interior to cover it */}
      <div className="relative z-[60]">
        <FaqFrota />
      </div>
    </main>
  );
}
