import { Link } from 'react-router-dom';
import seo from '../data/seo.json';
import townData from '../data/towns.json';
import { PageHeader } from './PageHeader';
import { Benefits } from '../components/Benefits';
import { Reveal } from '../components/Reveal';
import { readablePhone } from '../lib/phone';

/**
 * Who we are, in about a minute.
 *
 * This page was nine paragraphs of prose. Every one of them was true and
 * useful, and almost nobody got to the end: an about page is read standing
 * up, half-decided, usually on a phone, and a wall of justified text is the
 * shape of a document rather than of an answer.
 *
 * Same facts, laid out to be scanned. Four things we rent, three steps a
 * rental actually takes, and the towns we drive to -- each one short enough
 * to take in without reading it. Nothing was dropped to make it shorter: the
 * licence and the ID are still named, the deposit still says it comes back,
 * and what a rental costs still points at the page that lists the figures
 * rather than describing them twice.
 *
 * TODO for the owner: the story is still the generic one. What is here is
 * only what the booking flow actually does -- inventing a founding year or a
 * fleet size would put claims on the site that are not true. The part worth
 * replacing is the opening line, with how this business actually started.
 */

/* Drawn rather than an icon font: four glyphs are a few hundred bytes of
   markup here, and a font is a request, a fallback and a flash. */
const RENTS = [
  {
    to: '/services#cars',
    title: 'Self drive cars',
    body: 'Hatchbacks to 7 seaters. You drive.',
    icon: (
      <>
        <path d="M4 14.5h16" />
        <path d="M5.5 14.5l1.6-4.3A2 2 0 0 1 9 8.9h6a2 2 0 0 1 1.9 1.3l1.6 4.3" />
        <circle cx="7.6" cy="17.6" r="1.4" />
        <circle cx="16.4" cy="17.6" r="1.4" />
      </>
    ),
  },
  {
    to: '/services#bikes',
    title: 'Bikes and scooters',
    body: 'By the hour, the day or the week.',
    icon: (
      <>
        <circle cx="6" cy="16.5" r="3.2" />
        <circle cx="18" cy="16.5" r="3.2" />
        <path d="M6 16.5l3.5-6h5l3.5 6" />
        <path d="M9.5 10.5H8" />
      </>
    ),
  },
  {
    to: '/services#wedding-cars',
    title: 'Wedding cars',
    body: 'Decorated, on time, for the day it matters.',
    icon: (
      <>
        <path d="M12 20.5s-7-4.2-7-9A3.6 3.6 0 0 1 12 9.4 3.6 3.6 0 0 1 19 11.5c0 4.8-7 9-7 9z" />
      </>
    ),
  },
  {
    to: '/services#tourist-vehicles',
    title: 'Tourist vehicles',
    body: 'With a driver, for groups and sightseeing.',
    icon: (
      <>
        <circle cx="12" cy="7.5" r="3.1" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      </>
    ),
  },
];

const STEPS = [
  {
    title: 'Tell us the dates',
    body: 'We confirm what is free and what it costs. No booking fee on top.',
  },
  {
    title: 'We bring it to you',
    body: `Anywhere in ${seo.site.district} district, papers in it. Bring a driving licence and a photo ID.`,
  },
  {
    title: 'Bring it back',
    body: 'Deposit returned, less extra KM or damage. Nothing new at the end.',
  },
];

function Glyph({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/35 bg-gold/10 text-gold-deep"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </span>
  );
}

export function About() {
  return (
    <>
      <PageHeader
        photo="about-hero"
        imageAlt="The NiteSha Cars & Bikes team and vehicle yard in Nagercoil"
        scene="coast"
        title="About us"
        intro="NiteSha Cars & Bikes is a self drive car rental in Nagercoil, and we rent two-wheelers, wedding cars and tourist vehicles across Kanyakumari district as well."
      />

      <section className="mx-auto max-w-[86rem] px-5 py-16 sm:px-8 lg:px-12">
        {/* One sentence where there were three paragraphs. It is the thing
            somebody wants to know first and the only thing they are certain
            to read. */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[1.15rem] leading-relaxed font-semibold text-navy sm:text-[1.35rem]">
            We are based in {seo.site.city} and we drive to you — anywhere in{' '}
            {seo.site.district} district. Four things under one roof, one agreed
            price, and a deposit that comes back.
          </p>
        </Reveal>

        {/* ---- what we rent ---- */}
        <h2 className="mt-14 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          What we rent
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RENTS.map((r, i) => (
            <li key={r.to}>
              <Reveal delay={i * 70} className="h-full">
                <Link
                  to={r.to}
                  className="card-lift group flex h-full flex-col gap-3 rounded-[14px] border border-line bg-white p-5 shadow-[0_10px_30px_rgba(16,24,40,0.06)] transition hover:border-gold/60"
                >
                  <Glyph>{r.icon}</Glyph>
                  <span className="text-[17px] font-bold text-navy">{r.title}</span>
                  <span className="text-[14.5px] leading-relaxed text-ink-dim">{r.body}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-gold-deep">
                    See what is included
                    <span aria-hidden="true" className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* ---- how it works ---- */}
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          How a rental works
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 80} className="h-full">
                <div className="h-full rounded-[14px] border border-line bg-cream p-5">
                  <span aria-hidden="true" className="service-n">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-3 text-[17px] font-bold text-navy">{s.title}</p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-dim">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* The figures live on one page and are quoted from the panel there.
            Describing them here as well is two places to keep right. */}
        <Reveal>
          <p className="mt-5 text-[14.5px] text-ink-dim">
            Every vehicle has a daily rate, a KM allowance, a rate beyond it and a
            refundable deposit —{' '}
            <Link to="/tariff" className="font-semibold text-navy hover:text-gold-deep">
              all four are listed on the tariff
            </Link>
            , and they come down on a longer rental.
          </p>
        </Reveal>

        {/* ---- where ---- */}
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-navy sm:text-3xl">
          Where we drive
        </h2>
        <p className="mt-3 text-ink-dim">
          The whole of {seo.site.district} district. These twelve towns have a page
          of their own; everywhere between them is a phone call.
        </p>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {townData.towns.map((town) => (
            <li key={town.slug}>
              <Link
                to={`/car-rental/${town.slug}`}
                className="tap-target inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-ink-dim transition hover:border-gold hover:text-navy"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
                {town.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* ---- ask ---- */}
        <Reveal>
          <div className="relative isolate mt-12 overflow-hidden rounded-[18px] bg-navy px-6 py-9 text-center text-white sm:px-10">
            <div aria-hidden="true" className="brand-panel-glow absolute inset-0" />
            <div className="relative">
              <h2 className="text-xl font-bold sm:text-2xl">Not sure which one you need?</h2>
              <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-white/75">
                Tell us the dates and where you are. We will say what is free and
                what it costs — usually within the hour.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={`tel:${seo.site.phone}`}
                  className="rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-gold-light sm:text-base"
                >
                  Call {readablePhone(seo.site.phone)}
                </a>
                <Link
                  to="/contact#enquire"
                  className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-gold hover:text-gold-light sm:text-base"
                >
                  Send an enquiry
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Four things worth knowing, after the page has said who we are and
          before it asks for the call. */}
      <Benefits />
    </>
  );
}
