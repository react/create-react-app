import { useHome } from '../content';
import { ContentLink } from './ContentLink';
import { Reveal } from './Reveal';

/**
 * "What are you looking for?" -- the four ways in, under the hero.
 *
 * Somebody arriving does not want the home page, they want one of four
 * answers: a car for the weekend, a car for a fortnight, a car for a month,
 * or a two-wheeler. The page had all four on it and made you find them: one
 * was a service card, one was a line in a rate table, one was a section of
 * another page.
 *
 * It is a band of its own rather than a card in the hero, where the
 * reference site puts it, because that corner already holds the enquiry
 * form. A chooser and a form competing for the same corner is two things
 * asking at once, and the form is the one that books.
 *
 * Every destination is somewhere that answers the question rather than
 * somewhere that repeats it -- the rate card for the lengths, the service
 * for bikes. The panel owns all four, so a fifth is a row in a form.
 */
export function Chooser() {
  const { chooser } = useHome();
  const items = chooser?.items ?? [];

  if (items.length === 0) return null;

  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-[86rem] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <Reveal>
          <h2 className="text-center text-xl font-bold tracking-tight text-navy sm:text-2xl">
            {chooser.heading}
          </h2>
        </Reveal>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={item.label}>
              <Reveal delay={i * 70} className="h-full">
                <ContentLink
                  to={item.href}
                  className="card-lift group flex h-full items-center gap-3 rounded-[14px] border border-line bg-cream/50 p-4 transition hover:border-gold/60 hover:bg-white"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold text-navy">{item.label}</span>
                    {item.note ? (
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-dim">
                        {item.note}
                      </span>
                    ) : null}
                  </span>
                  {/* The arrow is the affordance: four tiles with no sign of
                      being clickable read as a list of facts. */}
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold-deep transition group-hover:translate-x-0.5 group-hover:bg-gold/20"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </ContentLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
