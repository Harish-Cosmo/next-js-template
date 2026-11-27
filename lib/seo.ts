import type { Metadata } from 'next';
import { siteConfig, siteUrl } from '@/lib/site';

/**
 * Every page's metadata, built from one function.
 *
 * Why: in Next.js a page-level `openGraph` or `twitter` object replaces the
 * layout's whole object. Setting only a canonical on a page is how pages end
 * up inheriting the home page's `og:url` and losing their share image.
 * `pageMetadata` builds the complete set every time.
 */
const SHARE_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: siteConfig.seoTitle,
};

type PageMetadataInput = {
  /** The full title tag, brand suffix included. Used as-is. */
  title: string;
  /** 155 characters or fewer, so search results show it whole. */
  description: string;
  /** This page's path, e.g. '/pricing'. Becomes the canonical and og:url. */
  path: string;
  type?: 'website' | 'article';
  published?: string;
  modified?: string;
  robots?: Metadata['robots'];
  image?: {
    path: string;
    width: number;
    height: number;
    alt: string;
  };
};

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  published,
  modified,
  robots,
  image,
}: PageMetadataInput): Metadata {
  const url = siteUrl(path);

  const shareImage = image
    ? {
        url: siteUrl(image.path),
        width: image.width,
        height: image.height,
        alt: image.alt,
      }
    : {
        ...SHARE_IMAGE,
        url: siteUrl(SHARE_IMAGE.url),
      };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title,
      description,
      images: [shareImage],
      ...(type === 'article' && { publishedTime: published, modifiedTime: modified }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [shareImage.url],
      ...(siteConfig.twitter ? { site: siteConfig.twitter } : {}),
    },
    robots:
      robots ??
      (siteConfig.indexable
        ? { index: true, follow: true }
        : { index: false, follow: false }),
  };
}
