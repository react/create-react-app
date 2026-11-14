import { Link } from 'react-router-dom';
import { useHome, useSiteImageLookup } from '../content';
import { Reveal } from './Reveal';
import { Icon } from './Icon';
import { Reviews } from './Reviews';
import { CircleBadge } from './CircleBadge';

/**
 * Why hire from us: the pictures, the claims, and what customers said.
 *
 * Three columns rather than the two it was. The claims used to be an
 * accordion, which is the wrong shape for them -- an accordion is for things
 * most people do not want to read, and these are the three reasons the page
 * exists. Shut by default they were three headings and nothing else; open
 * they were one. As cards all three are read at a glance, which is all any
 * of them needs.
 *
 * The right-hand column is customers' own words, and it is empty until the
 * owner puts real ones in: see Reviews. With none the section is two columns
 * and looks deliberate, which is what lets it ship honest.
 */

/** The photographs, in the order the collage lays them out. */
const PHOTO_SLOTS = ['why-us-1', 'why-us-2', 'why-us-3', 'why-us-4', 'why-us-5', 'why-us-6'];

/** Shipped with the site, so the collage is never empty on a fresh install. */
const BAKED = [
  '/self-drive-car-rental-nitesha-cars-and-bikes.webp',
  '/maruti-brezza-self-drive-car-rental-nagercoil.avif',
];

export function WhyUs() {
  const home = useHome();
  const imageFor = useSiteImageLookup();
  const { badge, heading, intro, items } = home.whyUs;

  // Whatever has actually been uploaded, plus the two committed photographs
  // when nothing has. Six empty frames would be worse than two full ones:
  // a collage of placeholders says the business has no pictures of itself.
  const uploaded = PHOTO_SLOTS.map(imageFor).filter((src): src is string => Boolean(src));
  const photos = uploaded.length > 0 ? uploaded : BAKED;

  const hasReviews = (home.reviews?.items ?? []).length > 0;

  return (
    <section className="bg-cream py-20">
      <div
        className={`mx-auto grid max-w-[86rem] gap-10 px-5 sm:px-8 lg:gap-12 lg:px-12 ${
          hasReviews
            ? 'lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,0.85fr)]'
            : 'lg:grid-cols-2 lg:items-center'
        }`}
      >
        {/* The photographs. Two columns of frames offset against each other,
            which is what stops a grid of snapshots reading as a contact
            sheet. The odd ones sit a little lower. */}
        <Reveal>
          <div className="relative">
          <ul className="why-collage grid grid-cols-2 gap-3 sm:gap-4">
            {photos.map((src, i) => (
              <li key={src} className={i % 2 === 1 ? 'mt-6 sm:mt-10' : ''}>
                <img
                  src={src}
                  // Decorative: every one of them is a photograph of the
                  // fleet or the people, and the three claims beside them
                  // are what the section actually says. Describing six
                  // snapshots individually would be six announcements
                  // between the heading and the first claim.
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="why-photo aspect-3/4 w-full rounded-[14px] object-cover"
                />
              </li>
            ))}
          </ul>

          {/* The spinning badge, over the corner of the collage. It is the
              one thing in this column that is not a photograph, which is
              what stops two or three frames reading as a gap waiting for
              more -- and it is a link to the contact page, which is where
              somebody who has read this far is going. */}
          <div className="absolute -bottom-5 left-2 hidden sm:block">
            <CircleBadge />
          </div>
          </div>
        </Reveal>

        {/* The claims. */}
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold tracking-wide text-navy uppercase shadow-[0_10px_30px_rgba(16,24,40,0.06)]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
              {badge}
            </p>

            <h2 className="mt-5 text-3xl leading-tight font-bold tracking-tight text-navy sm:text-[2.35rem]">
              {heading}
            </h2>

            <p className="mt-4 leading-relaxed text-ink-dim">{intro}</p>
          </Reveal>

          <ul className="mt-7 space-y-3">
            {items.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={i * 70}>
                  <div className="why-claim flex gap-4 rounded-[14px] bg-white p-4 sm:p-5">
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/12 text-gold-deep"
                    >
                      <Icon name={item.icon} size={22} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[17px] leading-snug font-bold text-navy">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-dim">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={120}>
            <Link
              to="/about"
              className="tap-target group mt-7 inline-flex items-center gap-1.5 font-semibold text-navy transition hover:text-gold-deep"
            >
              More about us
              <span aria-hidden="true" className="transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* What customers said, when there are any. Below the claims on a
            laptop and beside them on a desktop: three columns at 1024 would
            give each of them about 300 points, and a review card at that
            width is four words a line. */}
        {hasReviews ? (
          <div className="lg:col-span-2 xl:col-span-1">
            <Reviews />
          </div>
        ) : null}
      </div>
    </section>
  );
}
