/**
 * The site's line icons, by name.
 *
 * Named rather than imported one by one because the names come out of the
 * panel: a figure under the hero and a claim in "why hire from us" each carry
 * an icon name the owner typed, and a component cannot import a module whose
 * path is only known at runtime. An unknown name falls back to the dot, so a
 * typo in the panel is a plain bullet rather than a blank space or a crash.
 *
 * One stroke weight, one cap style, one 24-unit box for all of them, which is
 * what makes a row of them read as a set. They inherit colour, so the same
 * icon works gold on navy and navy on cream without a second copy.
 */

export const ICON_NAMES = [
  'users',
  'car',
  'bike',
  'pin',
  'support',
  'clock',
  'shield',
  'star',
  'calendar',
  'wallet',
  'key',
  'road',
  'dot',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

/** True when the panel's word names a drawing, so callers can fall back. */
export function isIcon(name: string | undefined): name is IconName {
  return typeof name === 'string' && (ICON_NAMES as readonly string[]).includes(name);
}

const PATHS: Record<IconName, string> = {
  users: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.3a3.5 3.5 0 0 1 0 6.8',
  car: 'M4 16.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2M17 16.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2M3.5 16.5h17v-3.2a2 2 0 0 0-.6-1.4l-1-1-1.6-3.6A2 2 0 0 0 15.5 6h-7a2 2 0 0 0-1.8 1.2L5.1 10.9l-1 1a2 2 0 0 0-.6 1.4ZM5.2 11h13.6M7 13.8h.01M17 13.8h.01',
  bike: 'M6 18.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 18.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM9 15.5h5l-3-6H8.5M14 9.5h3l1 6M11.5 6h2.5',
  pin: 'M12 21s6.5-5.6 6.5-10.3a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21ZM12 13a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  support: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2ZM20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2ZM19 16.5v.5a3 3 0 0 1-3 3h-2',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.2V12l3 1.8',
  shield: 'M12 21s7-3.2 7-8.4V6.2L12 3.5 5 6.2v6.4C5 17.8 12 21 12 21ZM9.2 12.1l2 2 3.6-3.9',
  star: 'M12 3.8l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 10l5.9-.9Z',
  calendar: 'M4.5 9.5h15M6.5 5.5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2ZM8.5 3.5v4M15.5 3.5v4M8.5 13h.01M12 13h.01M15.5 13h.01',
  wallet: 'M19 9.5V7.8a2 2 0 0 0-2-2H5.5a1.5 1.5 0 0 1 0-3H16M3.5 4.3v12.9a2 2 0 0 0 2 2H17a2 2 0 0 0 2-2V15M20.5 9.5h-4a2.75 2.75 0 0 0 0 5.5h4a.5.5 0 0 0 .5-.5v-4.5a.5.5 0 0 0-.5-.5Z',
  key: 'M20.5 4.5 12.8 12.2M17.5 7.5l2 2M15.5 9.5l2 2M9.6 14.4a4.1 4.1 0 1 1-5.8 5.8 4.1 4.1 0 0 1 5.8-5.8Z',
  road: 'M8.5 3.5 5 20.5M15.5 3.5 19 20.5M12 4.5v2.5M12 10.8v2.5M12 17v2.5',
  dot: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
};

/** Icons whose shape is a filled area rather than an outline. */
const FILLED: ReadonlySet<IconName> = new Set<IconName>(['dot']);

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: string | undefined;
  size?: number;
  className?: string;
}) {
  const key: IconName = isIcon(name) ? name : 'dot';
  const filled = FILLED.has(key);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={PATHS[key]} />
    </svg>
  );
}
