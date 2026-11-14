import { useHome } from '../content';
import { Hero } from '../components/Hero';
import { HeroEnquiry } from '../components/HeroEnquiry';
import { HowItWorks } from '../components/HowItWorks';
import { AreasServed } from '../components/AreasServed';
import { PlacesTeaser } from '../components/PlacesTeaser';
import { Services } from '../components/Services';
import { Offers } from '../components/Offers';
import { Fleet } from '../components/Fleet';
import { WhyUs } from '../components/WhyUs';
import { Faq } from '../components/Faq';
import { CtaBand } from '../components/CtaBand';
// @ts-expect-error -- plain ESM, shared verbatim with the build so the number
// shown and the number in the structured data cannot disagree.
import { HOME_FAQ_SHOWN } from '../data/faq-shown.mjs';

export function Home() {
  const home = useHome();

  return (
    <>
      {/* The banner now carries the four ways in -- a car for a day, for a
          week, for a month, or two wheels -- as a card beside the headline.
          Somebody arriving wants one of those four, not a home page. */}
      <Hero />

      {/* The enquiry form, as a bar lifted onto the foot of the banner.
          It used to be a card in the banner's corner, where it competed with
          the chooser; here it is twice as wide, it is the first thing under
          the fold rather than the fourth, and the four tiles above it are
          free to be what somebody arriving actually wants. */}
      <section className="relative z-10 mx-auto -mt-8 max-w-[86rem] px-5 sm:px-8 lg:-mt-10 lg:px-12">
        <HeroEnquiry
          layout="bar"
          title={home.hero.formTitle ?? 'Check a date'}
          note={home.hero.formNote ?? 'Tell us when you need it and we will call you back.'}
        />
      </section>

      {/* Then what it takes to book one, before what there is to book. The
          order is the one the reference site uses and it is the right way
          round: "how does this work" is the question that stops a booking,
          and it is cheaper to answer it than to answer it twice on the
          phone. */}
      <HowItWorks />

      {/* The cars themselves. "What have you got" is the question under
          every other one on this page, and the listing had nowhere to live
          after the fleet page went. */}
      <Fleet heading="Explore our cars" view="carousel" />

      <Services />

      {/* Nothing until the owner adds one, and nothing on the page either --
          see Offers. An offer is a promise about money, so there is not one
          here that was not typed in the panel. */}
      <Offers />

      <WhyUs />
      <AreasServed />
      <PlacesTeaser />

      {/* Six of the ten. The rest are on the tariff page, which is where
          somebody with a detailed question already is -- and a home page is
          not the place to answer every question, only the ones that stop a
          booking. */}
      <Faq limit={HOME_FAQ_SHOWN} moreHref="/tariff" moreLabel="All questions and rates" />

      <CtaBand />
    </>
  );
}
