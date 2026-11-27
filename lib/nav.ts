/**
 * Navigation.
 *
 * Only link to routes that exist. A dead link is a worse first impression
 * than one fewer item in the header.
 */

export const mainNav = [
  { href: '/#architecture', label: 'Architecture' },
  { href: '/#next-steps', label: 'Next steps' },
] as const;

export const footerNav = [
  { href: '/#architecture', label: 'Architecture' },
  { href: '/#next-steps', label: 'Next steps' },
] as const;
