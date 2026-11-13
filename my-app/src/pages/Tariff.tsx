import { Link } from 'react-router-dom';
import { dailyRate, orDash } from '../data/cars';
import { useFleet } from '../lib/useFleet';
import { PageHeader } from './PageHeader';
import { BrandPanel } from '../components/BrandPanel';
import { Faq } from '../components/Faq';
import tariffFaq from '../data/tariff-faq.json';
// @ts-expect-error -- plain ESM, shared verbatim with the build so the
// questions this page shows and the ones in its structured data cannot
// disagree about which of the panel's the home page already answered.
import { HOME_FAQ_SHOWN } from '../data/faq-shown.mjs';

export function Tariff() {
  const fleet = useFleet();
  const cars = fleet.status === 'ready' ? fleet.cars : [];
  const empty = cars.length === 0;

  return (
    <>
      <PageHeader
        photo="tariff-hero"
        imageAlt="Self-drive car rental rates in Nagercoil and Kanyakumari district"
        scene="/cars"
        title="Tariff"
        intro="These are our self drive car rental rates, per day. Longer rentals bring the daily rate down, and every figure below is what you pay — there is no separate booking fee."
      />

      <section className="mx-auto max-w-[86rem] px-5 sm:px-8 lg:px-12 py-16">
        {empty ? (
          <BrandPanel title="Ask us for a quote">
            Our rate card is not published here yet. Tell us the car you want
            and your dates, and we will give you the figure.
          </BrandPanel>
        ) : (
          /*
           * One table, not a table and a stack of cards.
           *
           * It was 44rem wide at a minimum inside a horizontal scroller, so
           * on a phone six of the seven columns were off the side of the
           * screen and the way to reach them was to drag a rate card
           * sideways. Below 64rem each row becomes a card instead, with the
           * column name printed against each figure -- same markup, same
           * crawl, nothing rendered twice.
           *
           * The roles are written out because changing a table's `display`
           * is what strips its semantics: a screen reader stops announcing
           * rows and columns the moment the rows stop being rows. Declared,
           * they survive the layout change.
           */
          <div className="tariff-card overflow-hidden rounded-[14px] border border-line bg-white shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
            <table role="table" className="tariff-table w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Daily, weekly and monthly rates for every car, with the
                kilometre allowance, the extra-kilometre rate and the deposit.
              </caption>
              <thead role="rowgroup">
                <tr role="row" className="border-b border-line bg-cream/60 text-xs tracking-wide text-ink-faint uppercase">
                  <th role="columnheader" scope="col" className="px-5 py-3 font-semibold">Car</th>
                  {/* "Weekly" and "Monthly" are per-day figures too. That was
                      a footnote under the table, which is the wrong place for
                      the thing that stops a column being read as a total. */}
                  <th role="columnheader" scope="col" className="px-5 py-3 font-semibold">Per day</th>
                  <th role="columnheader" scope="col" className="px-5 py-3 font-semibold">
                    Weekly <span className="normal-case">(per day)</span>
                  </th>
                  <th role="columnheader" scope="col" className="px-5 py-3 font-semibold">
                    Monthly <span className="normal-case">(per day)</span>
                  </th>
                  <th role="columnheader" scope="col" className="px-5 py-3 font-semibold">KM / day</th>
                  <th role="columnheader" scope="col" className="px-5 py-3 font-semibold">Extra KM</th>
                  <th role="columnheader" scope="col" className="px-5 py-3 font-semibold">Deposit</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {cars.map((car) => (
                  <tr role="row" key={car.id} className="tariff-row border-b border-line/70 last:border-0">
                    <th role="rowheader" scope="row" className="px-5 py-4 font-semibold text-navy">
                      {car.brand} {car.name}
                      <span className="block text-xs font-normal text-ink-faint">
                        {car.bodyType} · {car.fuel} · {car.transmission}
                      </span>
                    </th>
                    {/* data-label is what the card layout prints beside each
                        figure. It repeats the column heading on purpose:
                        a column of rupees with no heading in sight is a
                        column of rupees nobody can use. */}
                    <td role="cell" data-label="Per day" className="tariff-lead px-5 py-4 font-semibold text-navy">
                      {dailyRate(car)}
                    </td>
                    <td role="cell" data-label="Weekly, per day" className="px-5 py-4 text-ink-dim">
                      {orDash(car.rateWeekly)}
                    </td>
                    <td role="cell" data-label="Monthly, per day" className="px-5 py-4 text-ink-dim">
                      {orDash(car.rateMonthly)}
                    </td>
                    <td role="cell" data-label="KM / day" className="px-5 py-4 text-ink-dim">
                      {car.kmLimitPerDay > 0 ? `${car.kmLimitPerDay} km` : '—'}
                    </td>
                    <td role="cell" data-label="Extra KM" className="px-5 py-4 text-ink-dim">
                      {orDash(car.extraKmRate)}
                    </td>
                    <td role="cell" data-label="Deposit" className="px-5 py-4 text-ink-dim">
                      {orDash(car.deposit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-sm leading-relaxed text-ink-faint">
          The deposit is refundable and returned after the car comes back, less
          any extra-KM charges or damage. There is no booking fee on top of
          these figures.
        </p>

        {/* The table raises three questions and answers none of them in full.
            This is where the reader is when they ask. */}
        <div className="mt-8 rounded-[14px] border border-line bg-cream p-6 sm:p-7">
          <h2 className="text-lg font-bold text-navy">Before you compare quotes</h2>
          <p className="mt-2 leading-relaxed text-ink-dim">
            A daily rate on its own does not tell you what a rental costs — the
            kilometre allowance and the extra-KM rate decide as much as the
            headline figure does.
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                to="/blog/km-limits-and-deposits-explained"
                className="tap-target group inline-flex items-baseline gap-2 font-semibold text-navy transition hover:text-gold-deep"
              >
                KM limits, extra-KM rates and deposits, explained plainly
                <span aria-hidden="true" className="text-gold transition group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/blog/documents-to-rent-a-self-drive-car"
                className="tap-target group inline-flex items-baseline gap-2 font-semibold text-navy transition hover:text-gold-deep"
              >
                What documents you need to take a self-drive car
                <span aria-hidden="true" className="text-gold transition group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* The questions the figures above raise -- what a per-day column
          means, how the allowance is counted, what the deposit is -- asked
          and answered on the page that raises them.

          Then the panel's own questions, minus the ones the home page
          already shows. This page used to show all ten, which meant six of
          them were answered at two URLs: the same six questions, the same
          six answers, and the same six in both pages' FAQPage data. Google
          picks one of a pair like that and the other is wasted. Now each
          question is answered once, on one page. */}
      <Faq
        heading={tariffFaq.heading}
        intro={tariffFaq.intro}
        items={tariffFaq.items}
        skip={HOME_FAQ_SHOWN}
      />
    </>
  );
}
