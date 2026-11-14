import { useId } from 'react';

/**
 * The cape, with the places we deliver to marked on it.
 *
 * Drawn rather than mapped, for the same reason the scenes beside it are: a
 * tile from a map provider is a network request, a licence, an attribution
 * line and a grey rectangle while it loads, and it invites somebody to read a
 * service boundary off it that we have not drawn. This is a sketch of the
 * coast with five towns on it, and it says so by looking like one.
 *
 * What is not sketched is where the towns are. Every pin is placed from its
 * real latitude and longitude through the projection below, so the shape of
 * the journey -- Marthandam inland, Muttom on the west coast, Kanyakumari at
 * the tip -- is the shape it is on the road. A decorative map with the towns
 * in invented positions would be the one kind of wrong worth avoiding here:
 * somebody deciding whether we come to them reads distance off it.
 *
 * Five pins, not ten. Parvathipuram is inside Nagercoil and the two stations
 * and the bus stand are inside those towns; drawn at this size they would be
 * one smudge of overlapping labels. The list beside this names all ten, which
 * is where the answer actually lives.
 */

/** Degrees to the viewBox. South and east are larger, as on a map.
 *
 * The box is squared off to the ground rather than to a shape that looked
 * right: a degree of longitude at eight north is 110.3 km and a degree of
 * latitude is 110.6, so the two scales are within a third of a per cent of
 * each other and the height follows from the span. It was 440 by 380 over a
 * span that is slightly taller than it is wide, which stretched the cape
 * sideways -- every distance read off it was wrong by about a tenth, and the
 * whole point of placing the pins from real coordinates is that they are
 * not. */
const WEST = 77.0;
const EAST = 77.7;
const NORTH = 8.62;
const SOUTH = 8.0;
const W = 440;
const H = Math.round((W * ((NORTH - SOUTH) / (EAST - WEST)) * 110.6) / 110.3);

const x = (lon: number) => ((lon - WEST) / (EAST - WEST)) * W;
const y = (lat: number) => ((NORTH - lat) / (NORTH - SOUTH)) * H;

/**
 * The district, as a run of points along its real edges.
 *
 * Still drawn rather than traced from a survey -- the reason the rest of this
 * file gives for not using map tiles applies to boundary data too -- but
 * drawn from where the edges actually run instead of from fourteen points
 * that rounded into an egg. The sea is three quarters of this outline and it
 * is the part that gives the district its shape: a long coast falling
 * south-east from the Kerala border, the cape at the bottom of it, a short
 * eastern shore, and the hills across the top.
 *
 * Clockwise from where the Kerala border meets the sea in the north-west.
 */
const OUTLINE: Array<[number, number]> = [
  [77.095, 8.37], // Neerodi, where the border reaches the coast
  // --- the Arabian Sea, north-west down to the cape ---
  [77.135, 8.312], // Thengapattanam
  [77.18, 8.258], // Midalam
  [77.225, 8.205], // Colachel
  [77.272, 8.155], // Mandaikadu
  [77.3, 8.128], // Manavalakurichi
  [77.33, 8.108], // the Muttom headland, the one kink in a straight coast
  [77.39, 8.093], // Kadiapattinam
  [77.45, 8.082], // Rajakkamangalam
  [77.51, 8.078], // Kovalam
  // The cape, a touch beyond the town that sits on it: the smoothing below
  // cuts every corner inward, and this is the sharpest corner on the map --
  // at the town's own coordinate the curve passes inside it and the pin ends
  // up in the sea.
  [77.549, 8.0735],
  // --- the eastern shore, up towards Tirunelveli ---
  [77.577, 8.12], // Leepuram
  [77.597, 8.19], // Vattakottai
  [77.605, 8.265],
  // --- the land border, north ---
  [77.58, 8.33],
  [77.545, 8.395],
  // --- the Western Ghats across the top ---
  [77.47, 8.455],
  [77.4, 8.52],
  [77.345, 8.565], // the northern tip, up in the hills
  [77.27, 8.54],
  [77.205, 8.48],
  [77.145, 8.425],
];

/**
 * A closed path through the points with the corners taken off.
 *
 * Each corner is cut back by a fraction of the two edges meeting at it and
 * bridged with one quadratic; everything between corners stays straight. The
 * obvious alternative -- a curve through the midpoints of every edge -- rounds
 * the whole outline evenly, which turns a cape into an egg: the sharpest
 * corner on this map is the tip at Kanyakumari, and it is the one corner that
 * has to survive.
 */
function roundedLoop(points: Array<[number, number]>, cut = 0.11): string {
  const p = points.map(([lon, lat]) => [x(lon), y(lat)] as const);
  const at = (i: number) => p[(i + p.length) % p.length];
  const lerp = (a: readonly number[], b: readonly number[], t: number) => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
  const f = (n: number) => n.toFixed(1);

  const first = lerp(at(0), at(1), cut);
  let d = `M${f(first[0])} ${f(first[1])}`;

  for (let i = 1; i <= p.length; i++) {
    const v = at(i);
    const into = lerp(v, at(i - 1), cut);
    const out = lerp(v, at(i + 1), cut);
    d += ` L${f(into[0])} ${f(into[1])} Q${f(v[0])} ${f(v[1])} ${f(out[0])} ${f(out[1])}`;
  }

  return `${d}Z`;
}

/**
 * Where the pins go, and where each label sits relative to its pin.
 *
 * Six rather than five, now the outline has a west coast long enough to put
 * one on: Colachel was the gap in it. Each label is placed so that it lands
 * on the land and clear of its neighbours -- the halo behind this type is
 * the cream of the land, so a label that drifts into the sea shows as a pale
 * box on the photograph, which is what "Muttom" was doing.
 *
 * Under the pin where there is room beneath it, beside it where there is
 * not. Kanyakumari is above and to the left of its pin because below the
 * cape there is nothing but sea.
 */
/** `as const` would narrow `anchor` to whichever side the six happen to use
 *  today, and the plate below branches on all three -- so moving one label to
 *  the other side of its pin broke the build rather than the layout. */
type Place = {
  name: string;
  lat: number;
  lon: number;
  dx: number;
  dy: number;
  anchor: 'start' | 'middle' | 'end';
  /** Over the water, so the name needs a plate under it to be read. */
  afloat?: boolean;
};

const PLACES: Place[] = [
  { name: 'Marthandam', lat: 8.307, lon: 77.222, dx: 0, dy: 16, anchor: 'middle' },
  { name: 'Thuckalay', lat: 8.245, lon: 77.313, dx: 0, dy: 16, anchor: 'middle' },
  // To seaward, like Muttom below it: inland it runs into Nagercoil's
  // name, and the two coastal names reading out over the water is what a
  // chart does anyway.
  { name: 'Colachel', lat: 8.179, lon: 77.256, dx: -12, dy: 5, anchor: 'end', afloat: true },
  { name: 'Nagercoil', lat: 8.178, lon: 77.428, dx: 0, dy: 17, anchor: 'middle' },
  // Out over the water, which is where a chart puts the name of a place on a
  // headland: there is no land beside Muttom to put it on, and every inland
  // position collides with Colachel above it or Kanyakumari across from it.
  { name: 'Muttom', lat: 8.126, lon: 77.316, dx: -12, dy: 11, anchor: 'end', afloat: true },
  { name: 'Kanyakumari', lat: 8.078, lon: 77.541, dx: -10, dy: -24, anchor: 'end' },
];

/** The run between them, in the order somebody would actually drive it. */
const ROUTE = ['Marthandam', 'Thuckalay', 'Colachel', 'Muttom', 'Nagercoil', 'Kanyakumari'];

function routePath(): string {
  const stops = ROUTE.map((name) => {
    const place = PLACES.find((p) => p.name === name)!;
    return [x(place.lon), y(place.lat)] as const;
  });

  // Bowed slightly rather than ruler-straight: roads here follow the coast,
  // and a straight line between two towns reads as a flight path.
  let d = `M${stops[0][0].toFixed(1)} ${stops[0][1].toFixed(1)}`;
  for (let i = 1; i < stops.length; i++) {
    const [ax, ay] = stops[i - 1];
    const [bx, by] = stops[i];
    const cx = (ax + bx) / 2 + (by - ay) * 0.1;
    const cy = (ay + by) / 2 - (bx - ax) * 0.1;
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  return d;
}

/**
 * The three seas, where the district meets them.
 *
 * The one thing everybody knows about this place is that three of them meet
 * at the bottom of it, and the map was not saying so. Set in the margin
 * rather than over the water's edge, and turned to run along the coast the
 * way a chart sets them, which also keeps them out of the land.
 */
const SEAS = [
  { name: 'Arabian Sea', lat: 8.28, lon: 77.045, turn: -90 },
  { name: 'Bay of Bengal', lat: 8.3, lon: 77.665, turn: 90 },
  { name: 'Indian Ocean', lat: 8.03, lon: 77.33, turn: 0 },
];

/**
 * The Western Ghats across the north, as the hatching a chart would use.
 *
 * The top third of this district is hills and nobody is delivered a car up
 * there, so it was drawn as a wide blank -- which read as the map having
 * nothing to say rather than as the ground having nothing on it. Three
 * strokes of a ridge are enough to tell somebody why the towns are all
 * along the bottom.
 */
const RIDGES: Array<[number, number, number]> = [
  // longitude, latitude, width in degrees. Two rows following the line of
  // the hills rather than scattered: a range reads as a range only when the
  // peaks queue up along it.
  [77.2, 8.455, 0.03],
  [77.238, 8.482, 0.034],
  [77.28, 8.503, 0.036],
  [77.325, 8.517, 0.034],
  [77.37, 8.513, 0.032],
  [77.412, 8.487, 0.032],
  [77.45, 8.455, 0.03],
  [77.487, 8.42, 0.028],
  [77.262, 8.447, 0.026],
  [77.305, 8.462, 0.028],
  [77.35, 8.47, 0.026],
  [77.393, 8.455, 0.026],
  [77.432, 8.425, 0.024],
];

function ridgePath([lon, lat, span]: [number, number, number]): string {
  const left = x(lon - span / 2);
  const right = x(lon + span / 2);
  const base = y(lat);
  const peak = base - (right - left) * 0.52;
  const mid = (left + right) / 2;
  return `M${left.toFixed(1)} ${base.toFixed(1)}L${mid.toFixed(1)} ${peak.toFixed(1)}L${right.toFixed(1)} ${base.toFixed(1)}`;
}

const ROUTE_D = routePath();
const LAND_D = roundedLoop(OUTLINE);

export function DistrictMap({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const uid = useId().replace(/:/g, '');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={style}
      role="img"
      aria-label="Kanyakumari district, with Marthandam, Thuckalay, Colachel, Muttom, Nagercoil and Kanyakumari marked"
    >
      <defs>
        <linearGradient id={`land-${uid}`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#f4e6c8" />
        </linearGradient>
        {/* Higher ground. The top third of this district is the Ghats and it
            was the same flat cream as the coastal plain, which is why the
            ridge marks looked scattered on it rather than drawn on hills. */}
        <linearGradient id={`hills-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a00" stopOpacity="0.17" />
          <stop offset="55%" stopColor="#8a5a00" stopOpacity="0.045" />
          <stop offset="100%" stopColor="#8a5a00" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`land-clip-${uid}`}>
          <path d={LAND_D} />
        </clipPath>
        <filter id={`lift-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#05070f" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* The seas, first, so everything else sits over them. */}
      {SEAS.map((sea) => (
        <text
          key={sea.name}
          className="map-sea"
          x={x(sea.lon).toFixed(1)}
          y={y(sea.lat).toFixed(1)}
          textAnchor="middle"
          transform={sea.turn ? `rotate(${sea.turn} ${x(sea.lon).toFixed(1)} ${y(sea.lat).toFixed(1)})` : undefined}
        >
          {sea.name}
        </text>
      ))}

      <g className="map-land" filter={`url(#lift-${uid})`}>
        {/* Two strokes outside the fill, fading outwards: the ring a chart
            draws round a coast. It is what stops the land reading as a shape
            cut out of the page and makes it read as land with sea round it --
            and it is drawn with the fill so the drop shadow takes them all
            together. */}
        <path d={LAND_D} fill="none" stroke="#d4af37" strokeWidth="13" strokeOpacity="0.1" />
        <path d={LAND_D} fill="none" stroke="#d4af37" strokeWidth="7" strokeOpacity="0.16" />
        <path d={LAND_D} fill={`url(#land-${uid})`} />
        <path d={LAND_D} fill="none" stroke="#d4af37" strokeWidth="2" strokeOpacity="0.55" />
      </g>

      {/* The Ghats across the top. Clipped to the land, so a ridge drawn a
          little wide does not end up out at sea. */}
      <g clipPath={`url(#land-clip-${uid})`} aria-hidden="true">
        <rect x="0" y="0" width={W} height={H * 0.62} fill={`url(#hills-${uid})`} />
      </g>

      <g className="map-ridges" clipPath={`url(#land-clip-${uid})`} aria-hidden="true">
        {RIDGES.map((r) => (
          <path
            key={`${r[0]}-${r[1]}`}
            d={ridgePath(r)}
            fill="none"
            stroke="#8a5a00"
            strokeOpacity="0.34"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* The run between the towns. Dashed, because it is a route rather than
          a border -- a solid line around this shape would read as one. */}
      <path
        className="map-route"
        d={ROUTE_D}
        fill="none"
        stroke="#0a0e20"
        strokeWidth="2"
        strokeDasharray="7 6"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />

      {/* The car along it, as one group so the motion path moves the drawing
          rather than each stroke of it. */}
      <g className="map-car" aria-hidden="true">
        <g transform="translate(-11 -7)">
          <rect x="0" y="4" width="22" height="8" rx="3" fill="#0a0e20" />
          <path d="M4.5 4.2l2.4-3.1A2.4 2.4 0 0 1 8.8 0h4.4a2.4 2.4 0 0 1 1.9 1.1l2.4 3.1z" fill="#0a0e20" />
          <circle cx="6" cy="12.4" r="2.1" fill="#14100d" />
          <circle cx="16" cy="12.4" r="2.1" fill="#14100d" />
          <rect x="1.5" y="6" width="19" height="2" rx="1" fill="#d4af37" opacity="0.85" />
        </g>
      </g>

      {PLACES.map((place, i) => {
        const px = x(place.lon);
        const py = y(place.lat);

        return (
          <g
            key={place.name}
            className="map-pin"
            style={{ '--pin-delay': `${i * 120}ms` } as React.CSSProperties}
          >
            {/* Drawn from its point, so the drop animation lands the tip on
                the town rather than scaling the whole thing off it. */}
            <g transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
              <g className="map-pin-mark">
                <path
                  d="M0 0c0-0.2-7.5-6.8-7.5-11.4a7.5 7.5 0 1 1 15 0C7.5-6.8 0-0.2 0 0z"
                  fill="#d4af37"
                  stroke="#0a0e20"
                  strokeWidth="1.2"
                />
                <circle cy="-11.4" r="2.9" fill="#0a0e20" />
              </g>
              {/* A plate behind the name rather than a halo around it.
                  The halo was the land's own cream, which is invisible on
                  the land and a ragged white smear anywhere else -- and one
                  of these names has to sit out at sea, because Muttom is on
                  a headland with no room beside it. Sized from the length of
                  the word: a rect cannot measure the text it sits behind,
                  and Poppins at this weight runs close enough to 7.4 to the
                  character for a plate nobody is meant to notice. */}
              {place.afloat ? (
                <rect
                  className="map-plate"
                  x={place.dx - (place.anchor === 'end' ? place.name.length * 7.4 + 13 : place.anchor === 'middle' ? (place.name.length * 7.4 + 13) / 2 : 0)}
                  y={place.dy - 12}
                  width={place.name.length * 7.4 + 13}
                  height={17}
                  rx={8.5}
                />
              ) : null}
              <text
                className="map-label"
                x={place.dx + (place.afloat ? (place.anchor === 'end' ? -6.5 : place.anchor === 'start' ? 6.5 : 0) : 0)}
                y={place.dy}
                textAnchor={place.anchor}
                fill="#0a0e20"
              >
                {place.name}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/** The path the car runs, for the stylesheet's offset-path. */
export const DISTRICT_ROUTE_D = ROUTE_D;
