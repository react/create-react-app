import { Link } from 'react-router-dom';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * A link whose destination is typed into the admin panel.
 *
 * Which element it needs depends on what was typed, and the person typing it
 * should not have to know: "/cars" is a route and must not reload the whole
 * app, "#fleet" is a place on the page already open, and "https://", "tel:"
 * or "mailto:" leaves the site entirely.
 *
 * This existed as a plain <a> before, which is why the two buttons under the
 * headline did nothing: they pointed at #fleet and #enquire, and neither
 * section is on the home page -- the fleet is /cars and the form is /contact.
 */
/**
 * Anything else an anchor takes rides through untouched -- `tabIndex`,
 * `aria-hidden`, the `data-` attributes a rail marks its cards with. Without
 * this a caller that needed one of them had to drop to a plain Link and lose
 * the "what did the owner type" decision above.
 */
type Extra = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children' | 'onClick'>;

export function ContentLink({
  to,
  className,
  children,
  onClick,
  ...rest
}: {
  to: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
} & Extra) {
  if (/^(https?:|tel:|mailto:)/i.test(to)) {
    return (
      <a
        href={to}
        className={className}
        onClick={onClick}
        target={/^https?:/i.test(to) ? '_blank' : undefined}
        rel={/^https?:/i.test(to) ? 'noopener noreferrer' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // A bare #hash belongs to the page that is open; the browser handles it.
  if (to.startsWith('#')) {
    return (
      <a href={to} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
