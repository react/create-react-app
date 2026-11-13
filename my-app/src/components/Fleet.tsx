import { useState } from 'react';
import { type BodyType } from '../data/cars';
import { Link } from 'react-router-dom';
import { useFleet } from '../lib/useFleet';
import { Reveal } from './Reveal';
import { BrandPanel } from './BrandPanel';
import { CarCard } from './CarCard';
import { FleetCarousel } from './FleetCarousel';

type Filter = 'All' | BodyType;

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
  /**
   * How the cars are laid out.
   *
   * 'grid' is for a listing, where somebody is comparing and wants them all
   * in front of them at once. 'carousel' is for the home page, where the job
   * is to get somebody interested in one.
   */
  view?: 'grid' | 'carousel';
}

export function Fleet({ heading = 'Our fleet', limit, view = 'grid' }: FleetProps = {}) {
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

        {empty || view === 'carousel' ? null : (
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
      ) : view === 'carousel' ? (
        <FleetCarousel
          cars={shown}
          moreHref="/tariff"
          moreLabel={
            hidden > 0 ? `View all ${matching.length} cars` : 'View all cars and rates'
          }
        />
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((car, i) => (
              <Reveal key={car.id} delay={i * 70}>
                <CarCard car={car} />
              </Reveal>
            ))}
          </div>

          {limit ? (
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
        </>
      )}

    </section>
  );
}
