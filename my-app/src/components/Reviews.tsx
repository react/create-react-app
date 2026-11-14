import { useHome } from '../content';
import { ContentLink } from './ContentLink';
import { Reveal } from './Reveal';

/**
 * What customers said, in their own words.
 *
 * Empty by default, and the whole block disappears when it is. That is
 * deliberate and it is the one thing about this component worth knowing: a
 * testimonial is a claim about what a real person said, so there is not a
 * single invented one shipped here to fill the design. The owner pastes in
 * the reviews they actually have -- the ones on Google, or what somebody
 * wrote on WhatsApp -- and the column appears.
 *
 * Nothing here is marked up as a review in the structured-data sense, and
 * that is also deliberate: Google stopped showing stars for self-serving
 * reviews a business publishes about itself, and claiming them anyway is the
 * kind of thing that costs a site its other rich results.
 */

/** The rating, drawn. Anything outside one to five is treated as none. */
function Stars({ rating }: { rating: number }) {
  if (!(rating >= 1 && rating <= 5)) return null;
  const whole = Math.round(rating);

  return (
    <span className="flex items-center gap-0.5" aria-label={`${whole} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={n <= whole ? 'text-gold' : 'text-line'}
          fill="currentColor"
        >
          <path d="M12 3.6l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 10l6-.9z" />
        </svg>
      ))}
    </span>
  );
}

type Review = {
  name: string;
  rating?: number | string;
  text: string;
  place?: string;
};

export function Reviews() {
  const { reviews } = useHome();
  const items = (reviews?.items ?? []) as readonly Review[];

  if (items.length === 0) return null;

  return (
    <div>
      <Reveal>
        <h3 className="text-[13px] font-bold tracking-[0.12em] text-ink-faint uppercase">
          {reviews.heading}
        </h3>
      </Reveal>

      {/* Columns rather than a grid, so cards of different lengths stack up
          against each other instead of every row growing to its tallest
          card. One column where the band gives this a third of the page,
          because two at that width is four words a line. */}
      <div className="review-wall mt-4 gap-3 sm:columns-2 xl:columns-1">
        {items.map((review, i) => (
          <Reveal key={`${review.name}-${i}`} delay={Math.min(i, 5) * 60} className="review-card-wrap">
            <figure className="review-card rounded-[14px] bg-white p-4">
              <figcaption className="flex items-center justify-between gap-3">
                <span className="truncate text-[14px] font-bold text-navy">{review.name}</span>
                <Stars rating={Number(review.rating)} />
              </figcaption>
              <blockquote className="mt-2 text-[13.5px] leading-relaxed text-ink-dim">
                {review.text}
              </blockquote>
              {review.place ? (
                <p className="mt-2 text-[12px] text-ink-faint">{review.place}</p>
              ) : null}
            </figure>
          </Reveal>
        ))}
      </div>

      {/* Where the rest can be read, by somebody who would rather check than
          take our word for it. Four quotations a business has put on its own
          site are worth a good deal less without it. */}
      {reviews.sourceUrl ? (
        <Reveal>
          <ContentLink
            to={reviews.sourceUrl}
            className="group mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy transition hover:text-gold-deep"
          >
            {reviews.sourceLabel || 'Read them all'}
            <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
              →
            </span>
          </ContentLink>
        </Reveal>
      ) : null}
    </div>
  );
}
