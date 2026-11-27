import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { mainNav } from '@/lib/nav';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

/**
 * Header.
 *
 * No client JavaScript: the mobile menu is a <details> element, so it works
 * before hydration and costs nothing on the main thread.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">
            {siteConfig.shortName.charAt(0).toUpperCase()}
          </span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-body transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/#next-steps">Get started</Link>
          </Button>

          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-foreground/15 px-3 py-2 text-sm">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-foreground/10 bg-background p-2 shadow-lg">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-body hover:bg-foreground/5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </Container>
    </header>
  );
}
