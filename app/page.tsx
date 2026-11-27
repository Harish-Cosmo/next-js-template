import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { webPageSchema, websiteSchema } from '@/lib/schema';
import { JsonLd } from '@/components/seo/json-ld';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = pageMetadata({
  title: siteConfig.seoTitle,
  description: siteConfig.seoDescription,
  path: '/',
});

const pillars = [
  {
    title: 'Server-first',
    description:
      'Every page is a server component until a browser API is genuinely needed. Less JavaScript, faster first paint.',
  },
  {
    title: 'SEO wired in',
    description:
      'Metadata, canonicals, Open Graph, JSON-LD, sitemap and robots are one function away, not a checklist you forget.',
  },
  {
    title: 'Design tokens',
    description:
      'Colour, type, radius and motion live in one generated CSS file. Components read tokens, never hardcoded values.',
  },
  {
    title: 'Agent-friendly',
    description:
      'AGENTS.md, a setup questionnaire, task recipes and a single npm run check keep an agent productive.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Run setup',
    code: 'npm run setup',
    description:
      'Answer the questions about your site, brand, SEO and deployment. The script writes the config and theme tokens.',
  },
  {
    number: '02',
    title: 'Read the docs',
    code: 'docs/SETUP.md',
    description:
      'Finish the post-setup checklist: Search Console, favicon, OG image, analytics and the first real page.',
  },
  {
    number: '03',
    title: 'Verify',
    code: 'npm run check',
    description:
      'Typecheck, lint and a production build in one command. If it passes, the change is safe to ship.',
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          websiteSchema(),
          webPageSchema({
            title: siteConfig.seoTitle,
            description: siteConfig.seoDescription,
            path: '/',
          }),
        ]}
      />

      <section className="section-pad">
        <Container className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">
            Next.js 16 starter
          </p>
          <h1 className="mt-4 text-hero font-semibold">
            Ship a fast, findable site without the bloat.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-body">
            A barebones template with a server-first architecture, a token-based
            design system, technical SEO already wired in, and documentation that
            helps agents move fast.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="#next-steps">Get started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#architecture">See the architecture</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-subtle">
            This page is a placeholder. Replace the copy, then delete what you do
            not need.
          </p>
        </Container>
      </section>

      <Section id="architecture" className="border-t border-foreground/10">
        <SectionHeader
          eyebrow="Architecture"
          title="Everything has one obvious place."
          description="The structure is small on purpose. A new contributor or agent should be able to find the right file in one or two hops."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="surface surface-interactive p-5"
            >
              <h3 className="text-h2 font-semibold">{pillar.title}</h3>
              <p className="mt-2 text-sm text-body">{pillar.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="next-steps" className="border-t border-foreground/10">
        <SectionHeader
          eyebrow="Next steps"
          title="Make it yours in three commands."
          description="Setup writes your config, the checklist closes the gaps, and one command proves the build is healthy."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="surface p-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-subtle">
                {step.number}
              </p>
              <h3 className="mt-2 text-h2 font-semibold">{step.title}</h3>
              <code className="mt-3 block rounded-md bg-foreground/5 px-3 py-2 text-sm">
                {step.code}
              </code>
              <p className="mt-3 text-sm text-body">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
