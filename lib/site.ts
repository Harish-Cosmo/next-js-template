import project from '@/config/project.json';

/**
 * Site identity.
 *
 * `config/project.json` is the committed source of truth. Environment
 * variables only override values that change per deployment. Keeping both
 * means an agent can read one JSON file to learn who the site is, while a
 * preview deployment can point at a different URL without editing code.
 */

const env = process.env;

const url = (env.NEXT_PUBLIC_SITE_URL ?? project.site.url).replace(/\/+$/, '');

export const siteConfig = {
  name: env.NEXT_PUBLIC_SITE_NAME ?? project.site.name,
  shortName: project.site.shortName,
  description: project.site.description,
  tagline: project.site.tagline,
  seoTitle: project.seo.title,
  seoDescription: project.seo.description,
  url,
  locale: project.site.locale,
  lang: project.site.locale.split('_')[0] ?? 'en',
  twitter: project.site.twitter,
  github: project.site.github,
  sameAs: project.site.sameAs,
  indexable: env.NEXT_PUBLIC_SITE_INDEXABLE
    ? env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false'
    : project.site.indexable,
  themeColor: project.brand.themeColor,
  brand: project.brand,
  features: project.features,
  deployment: project.deployment,
} as const;

/**
 * Strip a trailing slash so links match `trailingSlash: false`. The root
 * stays `/`; stripping it would produce an empty path.
 */
export function normalizePath(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return clean;
  return clean.replace(/\/+$/, '') || '/';
}

/** Absolute URL on this origin: canonicals, OG tags, sitemap entries. */
export function siteUrl(path: string = '/'): string {
  return new URL(normalizePath(path), siteConfig.url).toString();
}

/** Alias kept for readability in metadata code. */
export const absoluteUrl = siteUrl;
