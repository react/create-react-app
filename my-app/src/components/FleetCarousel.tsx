import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Car } from '../data/cars';
import { CarCard } from './CarCard';
import { Reveal } from './Reveal';

/**
 * The fleet on the home page: one car in front, the rest fanned out behind.
 *
 * A grid of six is a grid of six -- the eye divides itself by six and lands
 * on none of them. One card in front gets looked at, and the ones angled
 * away behind it say there are more without asking for attention. On a home
 * page, where the job is to get somebody interested rather than to help them
 * compare, that is the better trade.
 *
 * Every card stays in the document. The ones behind are moved with transforms
 * only, so a crawler reads all six, the next one is already laid out when it
 * arrives, and nothing has to load on a tap. They are out of the tab order
 * until they come to the front -- see CarCard's `offstage`.
 *
 * The listing page still uses a grid, which is the right shape there: that is
 * where somebody is comparing.
 */

/** How far from the front a card can be and still be drawn. */
const WINGS = 2;

interface FleetCarouselProps {
  cars: Car[];
  /** Where "see all of them" goes. */
  moreHref: string;
  moreLabel: string;
}

export function FleetCarousel({ cars, moreHref, moreLabel }: FleetCarouselProps) {
  const [at, setAt] = useState(0);
  const [motion, setMotion] = useState(true);
  const [tall, setTall] = useState<number>();
  const frame = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const count = cars.length;

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    const read = () => setMotion(!q.matches);
    read();
    q.addEventListener('change', read);
    return () => q.removeEventListener('change', read);
  }, []);

  /*
   * The stage is as tall as the tallest card, measured rather than guessed.
   *
   * It was a number in the markup, and the number was wrong for data that
   * had not been tried: a car whose name wraps to two lines makes a card
   * 579px tall, the stage was 576, and the three pixels that stuck out sat
   * on the row of dots underneath. A rate with a monthly line does the same.
   * Nothing in the panel stops either, so the height has to come from what
   * is actually on screen.
   *
   * offsetHeight, not the bounding box: the cards behind are scaled down by
   * a transform, and the box reports what was painted rather than what was
   * laid out.
   */
  useEffect(() => {
    const el = frame.current;
    if (!el) return;

    const measure = () => {
      let max = 0;
      el.querySelectorAll<HTMLElement>('.fleet-slide > *').forEach((card) => {
        max = Math.max(max, card.offsetHeight);
      });
      if (max > 0) setTall(max);
    };

    measure();
    // Fonts arriving, a phone turning, the panel answering with a longer
    // name than the one baked into the build -- all of them change it.
    const watch = new ResizeObserver(measure);
    el.querySelectorAll('.fleet-slide').forEach((slide) => watch.observe(slide));
    return () => watch.disconnect();
  }, [cars]);

  // Wrapping, so the arrows never dead-end and the fan always has something
  // in it on both sides.
  const go = useCallback(
    (n: number) => setAt((was) => (was + n + count) % count),
    [count],
  );

  /** How far round the ring, by the shorter way. */
  const offsetOf = (i: number) => {
    const raw = i - at;
    const half = count / 2;
    return raw > half ? raw - count : raw < -half ? raw + count : raw;
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };

  // A swipe, but only a horizontal one: a diagonal drag down the page is
  // somebody scrolling past, and stealing that is how a carousel becomes a
  // trap on a phone.
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const from = touch.current;
    touch.current = null;
    if (!from) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - from.x;
    const dy = t.clientY - from.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  if (count === 0) return null;

  return (
    <div className="mt-10">
      <div
        ref={frame}
        role="group"
        aria-roledescription="carousel"
        aria-label="Our cars"
        tabIndex={0}
        onKeyDown={onKey}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        // The class is the floor for the first paint and for the prerendered
        // HTML, where nothing has been measured yet; the measurement replaces
        // it as soon as there is one. Generous on purpose: too tall for a
        // moment is a gap, too short is a card sitting on the dots.
        style={tall ? { height: tall } : undefined}
        className="fleet-stage relative mx-auto flex h-[37rem] max-w-5xl items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        {cars.map((car, i) => {
          const d = offsetOf(i);
          const away = Math.abs(d);
          const here = d === 0;
          // Past the wings it is parked behind the front card at zero size
          // rather than removed: removing it would relayout the row every
          // time the carousel moves.
          const hidden = away > WINGS;
          return (
            <div
              key={car.id}
              aria-hidden={hidden || undefined}
              style={{
                transform: hidden
                  ? 'translateX(0) scale(0.6)'
                  : `translateX(${d * 62}%) scale(${1 - away * 0.13}) rotateY(${-d * 13}deg)`,
                opacity: hidden ? 0 : 1 - away * 0.45,
                zIndex: WINGS + 1 - away,
                transitionDuration: motion ? '450ms' : '0ms',
              }}
              className="fleet-slide absolute w-[21rem] sm:w-[24rem]"
            >
              <CarCard car={car} offstage={!here} />
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous car"
          className="fleet-arrow left-0 sm:-left-2"
        >
          <Chevron dir="left" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next car"
          className="fleet-arrow right-0 sm:-right-2"
        >
          <Chevron dir="right" />
        </button>
      </div>

      {/* Which of them is in front, and a way to any of them directly. A live
          region would announce every step of a held-down arrow key, so the
          card itself carries the name and this is only the map. */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {cars.map((car, i) => (
          <button
            key={car.id}
            type="button"
            onClick={() => setAt(i)}
            aria-label={`Show ${car.brand} ${car.name}`}
            aria-current={i === at ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all ${
              i === at ? 'w-7 bg-navy' : 'w-2.5 bg-line hover:bg-gold'
            }`}
          />
        ))}
      </div>

      <Reveal className="mt-8 text-center">
        <Link
          to={moreHref}
          className="tap-target group inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 font-semibold text-white transition hover:bg-navy/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {moreLabel}
          <span aria-hidden="true" className="transition group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Reveal>
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}
