import { useHome } from '../content';
import { ContentLink } from './ContentLink';
import { Reveal } from './Reveal';
import { WhatsAppButton } from './WhatsAppButton';
import { CarSilhouette } from './art/Vehicle';

/**
 * The last thing on the page: ask for the booking.
 *
 * A band rather than the bordered white card it was. That card sat on a
 * cream page in cream's own colours and was the quietest thing on the
 * screen, which is the wrong way round for the one block whose entire job
 * is to be clicked.
 *
 * Where the reference site puts its app-store band. There is no app to
 * download, so there is nothing here pretending there is: the two buttons
 * the owner already writes, and WhatsApp, which is what people round here
 * actually use to book.
 */
export function CtaBand() {
  const c = useHome().closingCta;

  return (
    <section className="mx-auto max-w-[86rem] px-5 py-20 sm:px-8 lg:px-12">
      <Reveal>
        <div className="cta-band relative isolate overflow-hidden rounded-[22px] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow-gold text-[11px]">Car &amp; bike hire · Kanyakumari district</p>

            <h2 className="mt-3 text-[1.7rem] leading-tight font-bold tracking-tight sm:text-[2.2rem]">
              {c.heading}
            </h2>

            <p className="mt-3 text-[15px] leading-relaxed text-white/75">{c.body}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ContentLink
                to={c.primaryHref}
                className="rounded-xl bg-gold px-6 py-3 text-[15px] font-semibold text-navy transition hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {c.primaryLabel}
              </ContentLink>

              <WhatsAppButton
                message="Hello, I would like to book a self-drive vehicle."
                className="rounded-xl px-6 py-3 text-[15px]"
              >
                WhatsApp us
              </WhatsAppButton>

              <ContentLink
                to={c.secondaryHref}
                className="rounded-xl border border-gold/40 px-6 py-3 text-[15px] font-semibold text-gold-light transition hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {c.secondaryLabel}
              </ContentLink>
            </div>
          </div>

          {/* Decoration, and only from the tablet up: on a phone it would sit
              behind the buttons, and a car under a word is a word nobody
              reads. */}
          <CarSilhouette className="cta-car" />
        </div>
      </Reveal>
    </section>
  );
}
