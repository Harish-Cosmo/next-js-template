import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { footerNav } from '@/lib/nav';
import { Container } from '@/components/ui/container';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/10 py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-subtle">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-4" aria-label="Footer">
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-subtle transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
