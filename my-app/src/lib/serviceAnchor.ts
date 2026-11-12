/**
 * Where a service lives now that it has no page of its own.
 *
 * Every service used to have its own page and the content file still carries
 * the path it was at -- `/wedding-cars`. Those pages are gone; /services
 * carries all six in full, one section each. That path is now an identifier:
 * it names the section, and it names the drawing the section is illustrated
 * with. It is not somewhere to navigate to.
 *
 * Kept in one place because three components turn it into an anchor and they
 * have to agree, or the home page links to a section id the services page
 * never wrote.
 */

/** "/wedding-cars" -> "wedding-cars", the id of its section on /services. */
export function anchorFor(to: string): string {
  return to.replace(/^\/+/, '').replace(/[^a-z0-9-]/gi, '-');
}

/** Where to send somebody who asked about one service. */
export function serviceHref(to: string): string {
  return `/services#${anchorFor(to)}`;
}
