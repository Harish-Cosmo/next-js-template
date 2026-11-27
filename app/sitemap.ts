import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/**
 * The sitemap.
 *
 * Add every public route here by hand. Nothing does it automatically, and a
 * sitemap that lists a route which does not exist is worse than one that is
 * missing a route.
 *
 * `updated` is the date the page's content last really changed. Never use the
 * build date: a lastmod that moves on every deploy teaches crawlers to ignore
 * it.
 */
export const dynamic = 'force-static';

const ROUTES = [
  {
    path: '/',
    updated: '2026-01-01',
    priority: 1,
    changeFrequency: 'weekly' as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: siteUrl(route.path),
    lastModified: route.updated,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
