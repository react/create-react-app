import { useHome, useSiteImageLookup } from '../content';
import { ContentLink } from './ContentLink';
import { VehicleArt } from './art/Vehicle';

/**
 * "What are you looking for?" -- the card in the banner.
 *
 * Somebody arriving does not want the home page, they want one of four
 * answers: a car for the weekend, a car for a week, a car for a month, or a
 * two-wheeler. The page had all four on it and made you find them.
 *
 * It sits in the banner rather than in a band below it, which is where the
 * reference site puts it and where it does the most work: it is the first
 * thing on the page after the headline, and every tile is a destination
 * rather than a heading. The enquiry form that used to hold this corner is
 * now a bar directly under the banner, where it is wider and no longer
 * competing with the chooser for the same glance.
 *
 * The first tile is the wide one and the rest pair up, so the shape comes
 * from the number of choices rather than from a field nobody would think to
 * set. An odd one at the end takes the full width instead of leaving a gap.
 *
 * Each tile can carry a photograph from the panel, and falls back to the
 * drawing. The drawings are the floor rather than a placeholder: a tile with
 * no photograph is still a finished tile, which is what lets the owner add
 * them one at a time.
 */

/** Which drawing a tile gets when it has no photograph. */
function artFor(item: { art?: string }, index: number): string | undefined {
  if (item.art) return item.art;
  // Nothing set: the drawings are decoration, so a tile without one is fine
  // and guessing from the words would be wrong the first time the panel is
  // edited in Tamil.
  return index === 0 ? 'car' : undefined;
}

export function Chooser() {
  const { chooser } = useHome();
  const items = chooser?.items ?? [];
  const imageFor = useSiteImageLookup();

  if (items.length === 0) return null;

  const last = items.length - 1;

  return (
    <div className="chooser-card rounded-[20px] bg-white p-3.5 shadow-[0_18px_50px_rgba(5,7,15,0.28)] sm:p-[18px]">
      <h2 className="px-1 text-[15px] font-bold tracking-tight text-navy sm:text-[17px]">
        {chooser.heading}
      </h2>

      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {items.map((item, i) => {
          // The first is the wide one. After that they pair up, and a lone
          // last tile widens rather than sitting beside a hole.
          const wide = i === 0 || (i === last && last % 2 === 1);
          const lead = i === 0;
          const photo = imageFor(`chooser-${i + 1}`);
          const art = artFor(item, i);

          return (
            <li key={item.label} className={wide ? 'col-span-2' : ''}>
              <ContentLink
                to={item.href}
                className={`chooser-tile group relative flex h-full overflow-hidden rounded-[14px] px-3.5 py-3 transition sm:px-4 ${
                  lead
                    ? 'chooser-tile-lead text-white'
                    : 'border border-line bg-cream/70 text-navy hover:border-gold/50 hover:bg-white'
                }`}
              >
                <span
                  className={`relative z-10 flex flex-col ${
                    wide ? 'max-w-[58%]' : 'w-full'
                  } ${item.ribbon ? 'pr-7' : ''}`}
                >
                  <span
                    className={`block font-bold tracking-tight ${
                      lead ? 'text-[17px] sm:text-[19px]' : 'text-[14.5px] sm:text-[16px]'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.note ? (
                    <span
                      className={`mt-0.5 block text-[12px] leading-snug sm:text-[12.5px] ${
                        lead ? 'text-white/70' : 'text-ink-dim'
                      }`}
                    >
                      {item.note}
                    </span>
                  ) : null}

                  {/* The arrow is the affordance. Four tiles with no sign of
                      being clickable read as a list of facts, which is what
                      the row under the banner used to be. mt-auto pins it to
                      the bottom so the arrows in a pair line up however
                      differently their labels wrap. */}
                  <span
                    aria-hidden="true"
                    className={`mt-auto grid size-8 shrink-0 translate-y-2.5 place-items-center rounded-full transition group-hover:translate-x-0.5 ${
                      lead
                        ? 'bg-gold text-navy group-hover:bg-gold-light'
                        : 'border border-gold/45 bg-white text-gold-deep group-hover:bg-gold/15'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </span>

                {/* The picture, which is decoration: the label beside it
                    carries the meaning, so it is never announced. */}
                {photo ? (
                  <img
                    src={photo}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="chooser-photo"
                  />
                ) : (
                  <VehicleArt art={art} className="chooser-art" />
                )}

                {item.ribbon ? (
                  <span aria-hidden="true" className="chooser-ribbon">
                    {item.ribbon}
                  </span>
                ) : null}
              </ContentLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
