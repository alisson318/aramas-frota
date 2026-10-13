'use client';

import React from 'react';

/**
 * Dispatched (bubbling, cancelable) on the player before scrolling to it. A scroll-driven ancestor
 * that scrollIntoView can't reach reliably cancels it and brings the player on screen itself.
 */
export const WATCH_VIDEO_EVENT = 'watchvideo';

export interface WatchVideoButtonProps {
  /** id of a PremiumVideoPlayer container. */
  targetId: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Scrolls a PremiumVideoPlayer into view and presses its click-to-play facade.
 * Renders as an anchor so it still jumps to the player without JavaScript.
 */
export const WatchVideoButton: React.FC<WatchVideoButtonProps> = ({ targetId, className, children }) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const player = document.getElementById(targetId);
    if (!player) return;
    event.preventDefault();
    const handled = !player.dispatchEvent(new Event(WATCH_VIDEO_EVENT, { bubbles: true, cancelable: true }));
    if (!handled) player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    player.querySelector('button')?.click();
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default WatchVideoButton;
