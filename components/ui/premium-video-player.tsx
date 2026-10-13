'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

const ORIENTATIONS = {
  vertical: { frame: 'aspect-[9/16] rounded-[2rem]', sizes: '400px' },
  horizontal: { frame: 'aspect-video rounded-2xl', sizes: '(min-width: 1024px) 1024px, 100vw' },
} as const;

export interface PremiumVideoPlayerProps {
  videoId: string;
  cover: string;
  title: string;
  /** Vertical (9:16) for shorts-style clips, horizontal (16:9) for regular videos. */
  orientation?: keyof typeof ORIENTATIONS;
  id?: string;
  /** Load the cover immediately with high priority. Use when the player is above the fold. */
  eager?: boolean;
  /** Frame styling (border, glow, sizing) applied to the container. */
  className?: string;
  /** Background/shadow classes for the round play button. */
  playButtonClassName?: string;
}

/**
 * Click-to-play YouTube facade: renders only the cover image until the user
 * clicks, so no YouTube scripts or iframes load with the page.
 */
export const PremiumVideoPlayer: React.FC<PremiumVideoPlayerProps> = ({
  videoId,
  cover,
  title,
  orientation = 'vertical',
  id,
  eager = false,
  className,
  playButtonClassName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { frame, sizes } = ORIENTATIONS[orientation];

  return (
    <div id={id} className={cx('relative isolate w-full overflow-hidden bg-black', frame, className)}>
      {isPlaying ? (
        // z-10 + pointer-events-auto: the YouTube controls must receive every click/tap, even if a decorative layer is added to the frame later
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&vq=hd1080&playsinline=1&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="pointer-events-auto absolute inset-0 z-10 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Reproduzir vídeo: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={cover}
            alt=""
            fill
            sizes={sizes}
            loading={eager ? 'eager' : undefined}
            fetchPriority={eager ? 'high' : undefined}
            className="object-cover w-full h-full transition duration-500 group-hover:scale-105 group-hover:brightness-110"
          />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
          <span
            aria-hidden
            className={cx(
              'absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ring-1 ring-white/40 backdrop-blur-md transition duration-300 group-hover:scale-110 group-focus-visible:scale-110',
              playButtonClassName ?? 'bg-white/20',
            )}
          >
            <Play className="ml-1 size-8 fill-white text-white" />
          </span>
        </button>
      )}
    </div>
  );
};

export default PremiumVideoPlayer;
