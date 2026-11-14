/**
 * A car and a scooter on their own, with no scene behind them.
 *
 * The service cards have whole illustrated scenes -- sky, road, hills. The
 * chooser tiles in the banner want the vehicle and nothing else: they are
 * three inches wide, they sit on a card that is already busy, and a sunset
 * behind a two-line label is noise at that size.
 *
 * Same palette and same construction as the scenes, so a tile and a card
 * further down the page look drawn by the same hand. They paint with
 * `url(#ns-metal)`, the gradient App renders once in SceneDefs, and inherit
 * nothing else -- which is what lets the same drawing sit on navy and on
 * cream without a second copy.
 */

type Props = { className?: string };

export function CarSilhouette({ className }: Props) {
  return (
    <svg
      viewBox="0 0 120 78"
      preserveAspectRatio="xMaxYMax meet"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* The body, lifted 5 units so the wheels have room under it. */}
      <path
        d="M8 43 L18 25 Q22 18 32 18 L74 18 Q84 18 90 25 L104 43 Q110 44 110 51 L110 59 Q110 63 105 63 L98 63 A12 12 0 0 0 74 63 L44 63 A12 12 0 0 0 20 63 L13 63 Q8 63 8 59 Z"
        fill="url(#ns-metal)"
      />
      {/* Glass. Navy at just over half, so it reads as glass on a pale tile
          and as shadow on a dark one rather than as a hole in the car. */}
      <path d="M26 26 L36 26 L34 40 L18 40 Z" fill="#0a0e20" opacity="0.62" />
      <path d="M42 26 L72 26 L74 40 L40 40 Z" fill="#0a0e20" opacity="0.62" />
      <circle cx="32" cy="63" r="10" fill="#05070f" />
      <circle cx="32" cy="63" r="4" fill="#d4af37" opacity="0.6" />
      <circle cx="86" cy="63" r="10" fill="#05070f" />
      <circle cx="86" cy="63" r="4" fill="#d4af37" opacity="0.6" />
    </svg>
  );
}

export function ScooterSilhouette({ className }: Props) {
  return (
    <svg
      viewBox="6 8 114 64"
      preserveAspectRatio="xMaxYMax meet"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* The same machine the bike card draws, lifted out of its scene. Two
          attempts at a scooter of my own both came out reading as a cart;
          this one is already on the site, already recognisable at this size,
          and shares its construction with the car beside it. */}
      <path d="M54 46 L38 51" stroke="url(#ns-metal)" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* Tail and seat. */}
      <path d="M12 28 L50 25 L52 34 L14 36 Z" fill="#d4af37" opacity="0.92" />
      {/* Tank. */}
      <path d="M48 26 Q64 13 82 21 L84 32 L50 34 Z" fill="url(#ns-metal)" />
      {/* Engine block, sitting in the gap between the wheels. */}
      <rect x="52" y="34" width="24" height="15" rx="3" fill="url(#ns-metal)" />
      {/* Front fork and bars. */}
      <path d="M96 20 L104 50" stroke="url(#ns-metal)" strokeWidth="5" strokeLinecap="round" />
      <path d="M88 14 L106 19" stroke="url(#ns-metal)" strokeWidth="4" strokeLinecap="round" />
      <path d="M74 40 L98 46" stroke="url(#ns-metal)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="27" r="5" fill="#f0d060" />

      <circle cx="26" cy="52" r="15" fill="none" stroke="url(#ns-metal)" strokeWidth="5" />
      <circle cx="104" cy="52" r="15" fill="none" stroke="url(#ns-metal)" strokeWidth="5" />
    </svg>
  );
}

/** The drawing a chooser tile asks for by name, or none. */
export function VehicleArt({ art, className }: { art?: string; className?: string }) {
  if (art === 'car') return <CarSilhouette className={className} />;
  if (art === 'scooter') return <ScooterSilhouette className={className} />;
  return null;
}
