import { RAIL_REPEAT, useRailCrawl } from '../lib/useRailCrawl';
import { useHome, useSiteImageLookup } from '../content';
import { ContentLink } from './ContentLink';
import { Reveal } from './Reveal';

/**
 * What is on offer at the moment, as a rail that moves on its own.
 *
 * Empty by default, and the section does not render when it is -- which is
 * the point of it. An offer is a promise about money, so there is nothing
 * here that the owner has not typed: a discount written into the code is a
 * discount nobody can withdraw without a deploy, and one invented to fill a
 * design is a discount the business never agreed to honour.
 *
 * Add a row under Website content and the band appears; delete the rows when
 * the festival is over and it disappears again. Each offer can carry a
 * picture uploaded against its slot, and reads perfectly well without one.
 */
/**
 * One offer. Declared here rather than inferred from the defaults file,
 * because the default list is empty -- and an empty array in JSON infers as
 * a list of nothing, which makes every field below an error.
 */
type Offer = {
  title: string;
  note?: string;
  code?: string;
  terms?: string;
  badge?: string;
  href?: string;
};

export function Offers() {
  const home = useHome();
  const offers = home.offers;
  const items = (offers?.items ?? []) as readonly Offer[];
  const imageFor = useSiteImageLookup();

  // Hooks before the early return: the list comes from the panel and can go
  // from none to some while the page is open.
  const { rail, page, ready } = useRailCrawl(items.length);

  if (items.length === 0) return null;

  const card = (offer: Offer, index: number, copy: boolean, first = false) => {
    const photo = imageFor(`offer-${index + 1}`);
    // An offer with nowhere to go is a card rather than a link. A link to
    // nothing is worse than no link: it is a click that does not move.
    const shell =
      'offer-card group relative flex h-full flex-col justify-end overflow-hidden rounded-[18px] p-5 text-white sm:p-6';
    // The second set is scenery: the same offers again would be more stops
    // for a keyboard and more announcements for a screen reader, saying
    // nothing new either time.
    const quiet = copy ? ({ tabIndex: -1, 'aria-hidden': true } as const) : {};

    const body = (
      <>
          {photo ? (
            <>
              <img
                src={photo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <span aria-hidden="true" className="offer-scrim absolute inset-0 -z-10" />
            </>
          ) : null}

          {offer.badge ? (
            <span className="offer-badge mb-3 self-start rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase">
              {offer.badge}
            </span>
          ) : null}

          <p className="text-[1.35rem] leading-tight font-bold tracking-tight sm:text-[1.6rem]">
            {offer.title}
          </p>

          {offer.note ? (
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/75">{offer.note}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {offer.code ? (
              <span className="offer-code rounded-lg px-3 py-1.5 text-[13px] font-bold tracking-[0.08em] uppercase">
                {offer.code}
              </span>
            ) : null}
            {offer.terms ? (
              <span className="text-[12px] text-white/60">{offer.terms}</span>
            ) : null}
          </div>
      </>
    );

    return (
      <div
        key={`${copy ? 'again-' : ''}${offer.title}`}
        className="rail-item offer-item"
        {...(first ? { 'data-rail-repeat': '' } : {})}
      >
        {offer.href ? (
          <ContentLink to={offer.href} data-rail-card="" {...quiet} className={shell}>
            {body}
          </ContentLink>
        ) : (
          <div data-rail-card="" {...quiet} className={shell}>
            {body}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="pt-20 pb-16">
      <div className="mx-auto max-w-[86rem] px-5 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between gap-6">
          <Reveal>
            {offers.eyebrow ? <p className="section-eyebrow">{offers.eyebrow}</p> : null}
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {offers.heading}
            </h2>
          </Reveal>

          {/* Hidden from a phone, where the gesture is the affordance. */}
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button type="button" onClick={() => page(-1)} aria-label="Previous offers" className="rail-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button type="button" onClick={() => page(1)} aria-label="More offers" className="rail-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rail-mask mt-9">
          <div
            ref={rail}
            tabIndex={0}
            role="region"
            aria-label={offers.heading}
            className="rail flex gap-5 overflow-x-auto pb-4"
          >
            {items.map((offer, i) => card(offer, i, false))}
            {ready ? items.slice(0, RAIL_REPEAT).map((offer, i) => card(offer, i, true, i === 0)) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
