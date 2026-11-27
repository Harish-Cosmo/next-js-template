import { siteConfig, siteUrl } from '@/lib/site';

/**
 * JSON-LD builders.
 *
 * Rule: every value here must also be visible on the page. Structured data
 * that describes content a visitor cannot see is a spam signal, not an SEO
 * win.
 */

export type JsonLdNode = Record<string, unknown> & {
  '@context': 'https://schema.org';
  '@type': string;
};

export function organizationSchema(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    ...(siteConfig.sameAs.length > 0 && { sameAs: siteConfig.sameAs }),
    ...(siteConfig.github && { codeRepository: siteConfig.github }),
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.lang,
  };
}

export function webPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: siteUrl(path),
    isPartOf: { '@type': 'WebSite', url: siteConfig.url },
    inLanguage: siteConfig.lang,
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };
}

export function articleSchema({
  title,
  description,
  path,
  published,
  modified,
  author,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
  modified?: string;
  author?: string;
}): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: siteUrl(path),
    datePublished: published,
    ...(modified && { dateModified: modified }),
    author: {
      '@type': author ? 'Person' : 'Organization',
      name: author ?? siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
