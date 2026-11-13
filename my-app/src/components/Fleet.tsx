import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dailyRate, inr, type BodyType } from '../data/cars';
import { carPhoto } from '../lib/carPhoto';
import { useFleet } from '../lib/useFleet';
import { SectionArt } from './art/SectionArt';
import { Reveal } from './Reveal';
import { BrandPanel } from './BrandPanel';
import { WhatsAppButton } from './WhatsAppButton';

type Filter = 'All' | BodyType;

/* Drawn rather than an icon font: four glyphs are a few hundred bytes of
   markup, and a font is a request, a fallback and a flash. */
const ICONS = {
  seats: (
    <>
      <circle cx="9" cy="8.5" r="3.1" />
      <path d="M3.6 19.4a5.6 5.6 0 0 1 10.8 0" />
      <path d="M16 6.2a3 3 0 0 1 0 5.8" />
      <path d="M17.2 14.6a5.6 5.6 0 0 1 3.4 4.8" />
    </>
  ),
  fuel: (
    <>
      <path d="M5 20.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14.5" />
      <path d="M3.5 20.5h11" />
      <path d="M13 10h3a2 2 0 0 1 2 2v4.5a1.8 1.8 0 0 0 3.5 0V9l-2.3-2.3" />
      <path d="M6.5 8.5h5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21M5.6 5.6l2.3 2.3M16.1 16.1l2.3 2.3M18.4 5.6l-2.3 2.3M7.9 16.1l-2.3 2.3" />
    </>
  ),
  body: (
    <>
      <path d="M4 14.5h16" />
      <path d="M5.5 14.5l1.6-4.3A2 2 0 0 1 9 8.9h6a2 2 0 0 1 1.9 1.3l1.6 4.3" />
      <path d="M4 14.5v3.1h2.2M20 14.5v3.1h-2.2" />
      <circle cx="7.6" cy="17.6" r="1.4" />
      <circle cx="16.4" cy="17.6" r="1.4" />
    </>
  ),
};

/**
 * One fact about a car.
 *
 * A dt/dd pair, so the label is read out but not drawn: "Petrol" on its own
 * is clear to anyone looking at the row of four, and a screen reader going
 * through them one at a time needs to be told which is which.
 */
function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line border-l-[3px] border-l-gold bg-cream/60 px-2.5 py-2">
      <svg
        aria-hidden="true"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-gold-deep"
      >
        {icon}
      </svg>
      <dt className="sr-only">{label}</dt>
      <dd className="truncate text-[13px] font-semibold text-ink">{value}</dd>
    </div>
  );
}
const filters: Filter[] = ['All', 'Hatchback', 'Sedan', 'SUV', 'MUV'];

/**
 * The page written about this vehicle, if there is one.
 *
 * The listing used to be the end of the road: a card, a price and an enquiry
 * button, with nothing to click for somebody still deciding between two of
 * them. The cars had a page each and they are gone, so the card names the car
 * and the enquiry is what it leads to.
 */

interface FleetProps {
  /** The section's heading. The home page asks for its own wording. */
  heading?: string;
  /** Capped on the home page: the whole fleet there is a page of scrolling
   *  before anything else gets a look in. */
  limit?: number;
}

export function Fleet({ heading = 'Our fleet', limit }: FleetProps = {}) {
  const [filter, setFilter] = useState<Filter>('All');
  const fleet = useFleet();

  const cars = fleet.status === 'ready' ? fleet.cars : [];
  const empty = cars.length === 0;
  const matching = filter === 'All' ? cars : cars.filter((c) => c.bodyType === filter);
  const shown = limit ? matching.slice(0, limit) : matching;
  const hidden = matching.length - shown.length;

  return (
    <section id="fleet" className="mx-auto max-w-[86rem] px-5 sm:px-8 lg:px-12 py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-lg text-ink-dim">
            {empty
              ? 'We are updating our vehicle listing. Call us or send an enquiry and we will tell you what is free for your dates.'
              : 'Rates shown are per day. Longer rentals bring the daily rate down.'}
          </p>
        </div>

        {empty ? null : (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by body type">
          {filters.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                  active
                    ? 'border-navy bg-navy text-white'
                    : 'border-line bg-white text-ink-dim hover:border-navy/40 hover:text-navy'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
        )}
      </div>

      {empty ? (
        <div className="mt-10">
          <BrandPanel title="Ask us what's available">
            Our current vehicles are not listed here yet. Tell us your dates and
            what you need, and we will come back with the options and the rate.
          </BrandPanel>
        </div>
      ) : (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((car, i) => {
          const label = `${car.brand} ${car.name}`;
          const photo = carPhoto(car);
          const terms = [
            car.kmLimitPerDay > 0 ? `${car.kmLimitPerDay} km/day included` : null,
            car.extraKmRate > 0 ? `${inr(car.extraKmRate)}/km after` : null,
            car.deposit > 0 ? `${inr(car.deposit)} deposit` : null,
          ].filter((t): t is string => t !== null);
          return (
            <Reveal key={car.id} delay={i * 70}>
            <article
              data-lift=""
              className="flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_10px_30px_rgba(16,24,40,0.08)]"
            >
              <div className="relative aspect-[16/10] bg-cream">
                {/* No photograph yet falls through to the drawing the rest of
                    the site uses, not a grey initial: a card with a picture on
                    it reads as a vehicle for hire, and a card with a letter on
                    it reads as a page that failed to load. */}
                <SectionArt
                  name="/cars"
                  className="h-full"
                  photo={photo}
                  alt={photo ? label : undefined}
                />
                {/* Top left, where a card is read from. On the right it sat
                    where the eye arrives last, which is the wrong place for
                    the one thing that decides whether to read the rest. */}
                <span
                  className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                    car.available ? 'bg-ok-soft text-ok' : 'bg-line text-ink-faint'
                  }`}
                >
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                  {car.available ? 'Available' : 'On rental'}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-navy">{car.name}</h3>
                <p className="mt-0.5 text-[13px] font-semibold text-ink-faint">
                  {car.brand}
                  {car.year > 0 ? ` · ${car.year}` : ''}
                </p>

                {/* Four facts in a two-by-two block rather than a wrapped
                    line. The same four appear in the same two corners on
                    every card, so two cars are compared by looking at one
                    spot twice instead of reading both. */}
                <dl className="mt-4 grid grid-cols-2 gap-2">
                  <Spec icon={ICONS.seats} label="Seats" value={`${car.seats} seats`} />
                  <Spec icon={ICONS.fuel} label="Fuel" value={car.fuel} />
                  <Spec icon={ICONS.gear} label="Transmission" value={car.transmission} />
                  <Spec icon={ICONS.body} label="Body type" value={car.bodyType} />
                </dl>

                {/* Only the terms the panel has actually published. With
                    none of them it used to read "KM limit agreed when you
                    book | —/km after | — deposit": three dashes in a row,
                    which looks like the page is broken rather than like
                    figures nobody has entered yet. */}
                {terms.length > 0 ? (
                  <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ink-faint">
                    {terms.map((t, n) => (
                      <span key={t} className="contents">
                        {/* A gold hairline rather than an interpunct, matching
                            the rule under the logo bar. aria-hidden because a
                            divider read aloud as a character is noise; the
                            items are separate elements, which is what carries
                            the grouping. */}
                        {n > 0 ? (
                          <span
                            aria-hidden="true"
                            className="h-3.5 w-0.5 shrink-0 rounded-full bg-gold-mid"
                          />
                        ) : null}
                        <span>{t}</span>
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-ink-faint">
                    KM limit and deposit agreed when you book.
                  </p>
                )}

                {/* Price and the way to act on it, side by side on the last
                    line. They are one decision and they were two blocks. */}
                <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
                  <div>
                    {/* A band when the panel carries an upper rate, one figure
                        otherwise -- dailyRate decides, so this card and the
                        tariff table can never disagree about the price. */}
                    <p className="text-2xl leading-none font-bold text-navy">{dailyRate(car)}</p>
                    {car.rateDaily > 0 ? (
                      <p className="mt-1 text-[11px] font-semibold tracking-wide text-ink-faint uppercase">
                        per day
                      </p>
                    ) : null}
                    {car.rateMonthly ? (
                      <p className="mt-1 text-xs text-gold-deep">
                        {inr(car.rateMonthly)} monthly
                      </p>
                    ) : null}
                  </div>

                  <WhatsAppButton
                    className="shrink-0 px-4 py-2.5 text-sm"
                    message={`Hello, I would like to book the ${label}${
                      car.year ? ` (${car.year})` : ''
                    }.`}
                  >
                    Book
                  </WhatsAppButton>
                </div>

                <Link
                  to={`/contact?car=${encodeURIComponent(label)}`}
                  className="tap-target mt-2 block py-2 text-center text-sm font-semibold text-ink-dim transition hover:text-navy"
                >
                  Or send an enquiry
                </Link>
              </div>
            </article>
            </Reveal>
          );
        })}
      </div>
      )}

      {limit && !empty ? (
        <Reveal className="mt-8 text-center">
          <Link
            to="/tariff"
            className="tap-target group inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 font-semibold text-navy transition hover:border-gold"
          >
            {hidden > 0
              ? `See all ${matching.length} vehicles and their rates`
              : 'See every rate, KM limit and deposit'}
            <span aria-hidden="true" className="transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      ) : null}
    </section>
  );
}
