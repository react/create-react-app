import { useHome } from '../content';
import { ContentLink } from './ContentLink';
import { Reveal } from './Reveal';
import { WhatsAppButton } from './WhatsAppButton';

/**
 * The last thing on the page: ask for the booking.
 *
 * A band rather than the bordered white card it was. That card sat on a
 * cream page in cream's own colours and was the quietest thing on the
 * screen, which is the wrong way round for the one block whose entire job
 * is to be clicked.
 *
 * Where the reference site puts its app-store band, and shaped like it --
 * the words on one side, a phone leaning out of the panel on the other. The
 * difference is what is on the phone. Theirs is a picture of an app you can
 * download; there is no app here, so nothing on this page says there is.
 * What the phone shows is this website, on a phone, photographed from the
 * built site -- which is the thing somebody would actually open, and it is
 * already in their hand.
 *
 * The picture is committed rather than rendered live. An iframe would always
 * be current and would also be a second full page load on every visit to the
 * home page, on the one site whose visitors are mostly on a phone on a rural
 * connection. 22 KB of AVIF, loaded lazily, buys the same thing.
 *
 * It is a photograph of the banner, so it goes out of date when the banner
 * changes. Re-shoot it then: 390 by 720 at twice the scale, scrolled so the
 * four tiles sit under the header, resized to 520 wide. 720 rather than a
 * real handset's 844 because the picture leans out of the panel at a tilt,
 * and at the true proportion it climbs into the section above.
 */
const PHONE = '/self-drive-car-rental-nagercoil-on-a-phone';

export function CtaBand() {
  const c = useHome().closingCta;

  // Taller above than below from the laptop up. The phone leans about a
  // hundred and thirty points past the top of the panel, and that has to be
  // the section's own space -- at py-20 it was reaching into the questions
  // band above and sitting on the answers.
  return (
    <section className="mx-auto max-w-[86rem] px-5 pt-20 pb-20 sm:px-8 lg:px-12 lg:pt-36">
      <Reveal>
        <div className="cta-wrap relative">
          <div className="cta-band relative isolate overflow-hidden rounded-[22px] px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            {/* Behind the phone and clipped by the panel, so the phone reads
                as standing in front of something rather than floating on a
                flat rectangle. */}
            <span aria-hidden="true" className="cta-disc" />

            <div className="relative z-10 max-w-xl md:max-w-[21rem] lg:max-w-[31rem] xl:max-w-[34rem]">
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
          </div>

          {/* Outside the panel so it can lean out of it, and decoration
              either way: everything it shows is on the page above, so a
              screen reader that announced it would be reading the site out
              twice. Hidden below the tablet, where the band is one column
              and a phone beside the words would be a phone on top of
              them. */}
          <div aria-hidden="true" className="cta-phone">
            <span className="cta-phone-body">
              <span className="cta-phone-notch" />
              <picture>
                <source type="image/avif" srcSet={`${PHONE}.avif`} />
                <img
                  src={`${PHONE}.webp`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={520}
                  height={960}
                  className="cta-phone-screen"
                />
              </picture>
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
