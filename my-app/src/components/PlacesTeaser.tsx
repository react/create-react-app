import { Link } from 'react-router-dom';
import { usePlaces } from '../lib/usePlaces';
import type { Place } from '../lib/places';
import { Reveal } from './Reveal';
import { useReveal } from '../lib/useReveal';
import { Skyline } from './art/Skyline';

/**
 * Where people go, as a handful of snapshots pinned to a board.
 *
 * It was a rail of nineteen cards that crawled past on its own, which
 * answered "what is there" by listing everything and grouping nothing. The
 * district's places fall into five kinds -- the cape and its monuments, the
 * temples, the waterfalls, the quiet beaches, the viewpoints -- and that is
 * the shape of the answer somebody actually wants: not nineteen names, but
 * "there is a coast, there are temples, there are falls".
 *
 * So one pile per kind, three snapshots deep, with the kind on a card pinned
 * to the front of it. The landmarks are drawn along the back as a hairline,
 * which is what stops five piles of photographs reading as a pile of
 * photographs.
 *
 * Each pile is a link to /places, where all nineteen are listed with their
 * map links. The snapshots are not separately clickable: three overlapping
 * targets of which two are half covered is a worse way to open a map than
 * the page that lists them.
 */

/** How many snapshots a pile is deep. More than three stops reading as a pile. */
const DEEP = 3;

/** The tilt and lift each pile is pinned at, repeating down the row. */
const PINNED = [
  { tilt: -2.5, lift: 0 },
  { tilt: 2, lift: 34 },
  { tilt: -1.5, lift: 8 },
  { tilt: 2.5, lift: 42 },
  { tilt: -2, lift: 16 },
];

/** The kinds, in the order the panel lists their first place. */
function pilesFrom(places: readonly Place[]): Array<{ kind: string; places: Place[] }> {
  const order: string[] = [];
  const by = new Map<string, Place[]>();

  for (const place of places) {
    const kind = place.category?.trim() || 'Worth the drive';
    if (!by.has(kind)) {
      by.set(kind, []);
      order.push(kind);
    }
    by.get(kind)!.push(place);
  }

  return order.map((kind) => {
    const all = by.get(kind)!;
    // The ones with a photograph first, so a pile shows pictures where there
    // are pictures -- then the rest, which still get a card with their name
    // on it. A place nobody has photographed yet is a place, not a gap.
    const sorted = [...all].sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));
    return { kind, places: sorted };
  });
}

function Pile({ kind, places, at }: { kind: string; places: Place[]; at: number }) {
  const shown = places.slice(0, DEEP);
  const pin = PINNED[at % PINNED.length];
  // The reveal goes on the <li> itself rather than on a wrapper: a <ul> may
  // only contain <li>, and a div between them is invalid however it is
  // displayed.
  const ref = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      data-reveal=""
      className="place-pile"
      style={
        {
          '--pile-tilt': `${pin.tilt}deg`,
          '--pile-lift': `${pin.lift}px`,
          '--reveal-delay': `${at * 90}ms`,
        } as React.CSSProperties
      }
    >
      <Link to="/places" className="place-pile-link group">
        <span className="place-stack">
          {/* Back to front, so the one on top is the first place in the kind
              and the two behind it are the fan. Each is a snapshot with the
              place's name written under it, which is where the names of the
              other eighteen places on this section come from. */}
          {shown
            .map((place, i) => (
              <span key={place.id} className={`snap snap-${i}`}>
                <span className="snap-frame">
                  {place.photo ? (
                    <img
                      src={place.photo}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      className="snap-photo"
                    />
                  ) : (
                    <span className="snap-blank" />
                  )}
                </span>
                <span className="snap-caption">{place.name}</span>
              </span>
            ))
            .reverse()}
        </span>

        <span className="place-tag">
          <span aria-hidden="true" className="place-tack" />
          <span className="place-tag-name">{kind}</span>
          <span className="place-tag-count">
            {places.length} place{places.length === 1 ? '' : 's'}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function PlacesTeaser() {
  const places = usePlaces();

  // Nothing at all rather than an empty heading. A section that says "places
  // to visit" above white space is worse than no section.
  if (places.length === 0) return null;

  const piles = pilesFrom(places);

  return (
    <section className="places-band relative isolate overflow-hidden bg-cream/60">
      <div className="mx-auto max-w-[86rem] px-5 py-20 sm:px-8 lg:px-12">
        <Reveal className="max-w-xl">
          <p className="section-eyebrow">Out of the car park</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Where people go
          </h2>
          <p className="mt-3 leading-relaxed text-ink-dim">
            The coast, the temples and the waterfalls are all an easy drive from
            Nagercoil. Take the car and go at your own pace.
          </p>
        </Reveal>

        <div className="places-scene relative mt-10">
          {/* The landmarks, behind everything. Hidden from a phone, where the
              piles stack and there is no band of background left to draw on. */}
          <Skyline className="places-skyline" />

          {/* Two across on a phone, five in a row once there is width for
              them. Scrolling sideways was the other option and it is the
              wrong one here: a pile half out of the frame reads as a pile
              that has fallen over. */}
          <ul className="places-piles relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:flex lg:items-start lg:justify-between lg:gap-4">
            {piles.map((pile, i) => (
              <Pile key={pile.kind} kind={pile.kind} places={pile.places} at={i} />
            ))}
          </ul>
        </div>

        <Reveal className="mt-12 flex justify-center lg:mt-16">
          <Link
            to="/places"
            className="group inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3 font-semibold text-navy transition hover:border-gold/60 hover:text-gold-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            View all {places.length} places
            <span aria-hidden="true" className="transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
