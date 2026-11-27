import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The site-wide share card.
 *
 * Generated at build time, so it ships as a static asset and costs nothing at
 * request time. Keep it to a name, one line and a mark: a share card has one
 * glance to work.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontSize: 34,
            fontWeight: 700,
            color: '#000000',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 56,
              height: 56,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              background: '#000000',
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {siteConfig.shortName.charAt(0).toUpperCase()}
          </div>
          {siteConfig.name}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#000000',
              maxWidth: 900,
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              display: 'flex',
              width: 160,
              height: 8,
              borderRadius: 9999,
              background: siteConfig.brand.accent,
            }}
          />
        </div>

        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(0,0,0,0.58)' }}>
          {siteConfig.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    { ...size },
  );
}
