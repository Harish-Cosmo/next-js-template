#!/usr/bin/env node
/**
 * Project setup.
 *
 *   npm run setup              interactive questionnaire
 *   npm run setup -- --defaults  accept every default (CI / agents)
 *
 * Writes:
 *   config/project.json        site identity, SEO, brand, features
 *   app/theme.generated.css    design tokens derived from the brand answers
 *   .env.local                 deployment overrides (never committed)
 *
 * No dependencies. Node 20+.
 */

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'config', 'project.json');
const THEME_PATH = path.join(ROOT, 'app', 'theme.generated.css');
const ENV_PATH = path.join(ROOT, '.env.local');

const useDefaults = process.argv.includes('--defaults');
const rl = createInterface({ input, output });

process.on('SIGINT', () => {
  rl.close();
  process.exit(0);
});

/* ── Input helpers ─────────────────────────────────────────────── */

async function ask(question, defaultValue = '', validate) {
  if (useDefaults) return defaultValue;

  for (;;) {
    const suffix = defaultValue ? ` (${defaultValue})` : '';
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    const value = answer || defaultValue;

    if (validate) {
      const error = validate(value);
      if (error) {
        console.log(`  ${error}`);
        continue;
      }
    }

    return value;
  }
}

async function askYesNo(question, defaultValue = true) {
  if (useDefaults) return defaultValue;

  for (;;) {
    const suffix = defaultValue ? 'Y/n' : 'y/N';
    const answer = (await rl.question(`${question} [${suffix}]: `)).trim().toLowerCase();
    if (!answer) return defaultValue;
    if (answer.startsWith('y')) return true;
    if (answer.startsWith('n')) return false;
    console.log('  Answer y or n.');
  }
}

async function askChoice(question, choices, defaultValue) {
  if (useDefaults) return defaultValue;

  console.log(`\n${question}`);
  choices.forEach((choice, index) => {
    console.log(`  ${index + 1}. ${choice}`);
  });

  for (;;) {
    const answer = (await rl.question(`Choose 1-${choices.length} (${defaultValue}): `)).trim();
    const value = answer || defaultValue;

    if (choices.includes(value)) return value;

    const index = Number(value);
    if (Number.isInteger(index) && index >= 1 && index <= choices.length) {
      return choices[index - 1];
    }

    console.log('  Enter a number from the list.');
  }
}

/* ── Validation ────────────────────────────────────────────────── */

const nonEmpty = (value) => (value.trim() ? null : 'This cannot be empty.');

const isUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? null
      : 'Use an http:// or https:// URL.';
  } catch {
    return 'Enter a valid URL, e.g. https://example.com.';
  }
};

const isHex = (value) =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
    ? null
    : 'Enter a hex colour, e.g. #4361EE.';

const maxLength = (max) => (value) =>
  value.length <= max ? null : `Keep this to ${max} characters or fewer (currently ${value.length}).`;

const isRadius = (value) =>
  /^\d*\.?\d+(rem|px|em)$/.test(value)
    ? null
    : 'Enter a CSS length, e.g. 0.75rem or 12px.';

const isFontStack = (value) =>
  /[;}]/.test(value) ? 'Remove ; and } from the font stack.' : null;

/* ── Colour helpers ────────────────────────────────────────────── */

function normalizeHex(hex) {
  const raw = hex.replace('#', '');
  if (raw.length === 3) {
    return `#${raw.split('').map((c) => c + c).join('')}`;
  }
  return `#${raw}`;
}

function hexToRgb(hex) {
  const raw = normalizeHex(hex).slice(1);
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        hue = (red - green) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslTriplet({ h, s, l }) {
  return `${h} ${s}% ${l}%`;
}

function isDark(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance < 0.5;
}

function foregroundFor(hex) {
  return isDark(hex) ? '0 0% 100%' : '0 0% 0%';
}

function generateScale(hex) {
  const { h, s } = rgbToHsl(hexToRgb(hex));
  const lightness = [97, 93, 86, 76, 68, 60, 50, 40, 30, 20];
  return lightness.map((l) => hslTriplet({ h, s, l }));
}

function buildThemeCss({
  primary,
  accent,
  radius,
  fontSans,
  fontMono,
  neutralMode,
  darkMode,
}) {
  const primaryHsl = hslTriplet(rgbToHsl(hexToRgb(primary)));
  const accentHsl = hslTriplet(rgbToHsl(hexToRgb(accent)));
  const primaryForeground = foregroundFor(primary);
  const accentForeground = foregroundFor(accent);
  const scale = generateScale(accent);

  /* "standard" gives the secondary and muted surfaces a visible tint.
     "opacity" keeps them white and lets the foreground opacity do the work. */
  const standard = neutralMode === 'standard';
  const secondary = standard ? '0 0% 96%' : '0 0% 100%';
  const muted = standard ? '0 0% 96%' : '0 0% 100%';
  const mutedForeground = standard ? '0 0% 40%' : '0 0% 35%';
  const border = standard ? '0 0% 88%' : '0 0% 90%';

  const darkBlock = darkMode
    ? `
/*
 * Dark mode tokens. Add the \`.dark\` class to <html> to activate them.
 */
.dark {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --card: 0 0% 4%;
  --card-foreground: 0 0% 100%;
  --popover: 0 0% 4%;
  --popover-foreground: 0 0% 100%;
  --primary: 0 0% 100%;
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 10%;
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 10%;
  --muted-foreground: 0 0% 70%;
  --accent: ${accentHsl};
  --accent-foreground: ${accentForeground};
  --destructive: 0 62% 40%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 18%;
  --input: 0 0% 18%;
  --ring: ${accentHsl};
}
`
    : `
/* Dark mode is off for this project. Add a .dark block here if you ship it. */
`;

  return `/*
 * Design tokens.
 *
 * Generated by \`npm run setup\`. Editing by hand is fine; this is the single
 * place a brand value lives.
 *
 * Values are HSL triplets (no \`hsl()\` wrapper) so Tailwind can compose them
 * with opacity: \`hsl(var(--foreground) / 0.1)\`.
 */

:root {
  /* ── Semantic colours ── */
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 0%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 0%;
  --primary: ${primaryHsl};
  --primary-foreground: ${primaryForeground};
  --secondary: ${secondary};
  --secondary-foreground: 0 0% 0%;
  --muted: ${muted};
  --muted-foreground: ${mutedForeground};
  --accent: ${accentHsl};
  --accent-foreground: ${accentForeground};
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: ${border};
  --input: ${border};
  --ring: ${accentHsl};

  /* ── Shape ── */
  --radius: ${radius};

  /* ── Type ── */
  --font-sans: ${fontSans};
  --font-mono: ${fontMono};

  /* ── Brand scale (from the accent colour) ── */
  --brand-50: ${scale[0]};
  --brand-100: ${scale[1]};
  --brand-200: ${scale[2]};
  --brand-300: ${scale[3]};
  --brand-400: ${scale[4]};
  --brand-500: ${scale[5]};
  --brand-600: ${scale[6]};
  --brand-700: ${scale[7]};
  --brand-800: ${scale[8]};
  --brand-900: ${scale[9]};

  /* ── Motion ── */
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
}
${darkBlock}`;
}

/* ── Read existing config, so re-running is safe ───────────────── */

let existing = {};
try {
  existing = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
} catch {
  existing = {};
}

const site = existing.site ?? {};
const seo = existing.seo ?? {};
const brand = existing.brand ?? {};
const features = existing.features ?? {};
const deployment = existing.deployment ?? {};

const defaultName = site.name ?? 'Your Project';
const defaultShortName =
  site.shortName ?? defaultName.split(/\s+/)[0] ?? 'Project';

/* ── Questions ─────────────────────────────────────────────────── */

console.log('\nNext.js template setup');
console.log('Press Enter to accept a default. Ctrl+C to stop.\n');

const name = await ask('Site name', defaultName, nonEmpty);
const shortName = await ask('Short name (header mark, manifest)', defaultShortName, nonEmpty);
const description = await ask(
  'One-sentence description',
  site.description ?? 'A short description of what this project does.',
  nonEmpty,
);
const tagline = await ask(
  'Tagline (hero and share card)',
  site.tagline ?? 'A fast, findable, well-designed Next.js site.',
  nonEmpty,
);
const url = await ask(
  'Production URL',
  site.url ?? 'https://example.com',
  isUrl,
);
const seoTitle = await ask(
  'SEO title (full <title>, brand included)',
  seo.title ?? `${name} — ${tagline}`,
  nonEmpty,
);
const seoDescription = await ask(
  'SEO description (155 characters or fewer)',
  seo.description ??
    'A fast, accessible, SEO-ready Next.js starter with a design system and agent-friendly documentation.',
  maxLength(155),
);
const twitter = await ask(
  'X/Twitter handle (optional, include @)',
  site.twitter ?? '',
);
const github = await ask(
  'GitHub URL (optional)',
  site.github ?? '',
);
const sameAsRaw = await ask(
  'Profile URLs for schema sameAs (comma separated, optional)',
  (site.sameAs ?? []).join(', '),
);
const primary = await ask('Primary colour (hex)', brand.primary ?? '#000000', isHex);
const accent = await ask('Accent colour (hex)', brand.accent ?? '#4361EE', isHex);
const themeColor = await ask(
  'Browser theme colour (hex)',
  brand.themeColor ?? primary,
  isHex,
);
const radius = await ask('Corner radius', brand.radius ?? '0.75rem', isRadius);
const fontSans = await ask(
  'Body font stack',
  brand.fontSans ??
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  isFontStack,
);
const fontMono = await ask(
  'Monospace font stack',
  brand.fontMono ??
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  isFontStack,
);
const neutralMode = await askChoice(
  'Neutral style',
  ['opacity', 'standard'],
  brand.neutralMode ?? 'opacity',
);
const darkMode = await askYesNo('Ship dark mode tokens?', brand.darkMode ?? false);
const blog = await askYesNo('Will this project have a blog?', features.blog ?? false);
const docs = await askYesNo('Will this project have docs?', features.docs ?? false);
const auth = await askYesNo('Will this project have authentication?', features.auth ?? false);
const database = await askYesNo('Will this project have a database?', features.database ?? false);
const analytics = await askChoice(
  'Analytics',
  ['none', 'vercel', 'plausible', 'google'],
  features.analytics ?? 'none',
);
const target = await askChoice(
  'Deployment target',
  ['vercel', 'cloudflare', 'static', 'other'],
  deployment.target ?? 'vercel',
);
const indexable = await askYesNo('Allow search engines to index this site?', site.indexable ?? true);

rl.close();

/* ── Write config ──────────────────────────────────────────────── */

const project = {
  site: {
    name,
    shortName,
    description,
    tagline,
    url: url.replace(/\/+$/, ''),
    locale: site.locale ?? 'en_US',
    twitter,
    github,
    sameAs: sameAsRaw
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
    indexable,
  },
  seo: {
    title: seoTitle,
    description: seoDescription,
  },
  brand: {
    primary,
    accent,
    themeColor,
    radius,
    fontSans,
    fontMono,
    neutralMode,
    darkMode,
  },
  features: {
    blog,
    docs,
    auth,
    database,
    analytics,
  },
  deployment: {
    target,
    staticExport: target === 'static',
  },
};

await mkdir(path.dirname(CONFIG_PATH), { recursive: true });
await writeFile(CONFIG_PATH, `${JSON.stringify(project, null, 2)}\n`, 'utf8');

await writeFile(
  THEME_PATH,
  buildThemeCss({
    primary,
    accent,
    radius,
    fontSans,
    fontMono,
    neutralMode,
    darkMode,
  }),
  'utf8',
);

/* ── Write .env.local (optional, never overwrite silently) ─────── */

let writeEnv = true;
try {
  await readFile(ENV_PATH, 'utf8');
  writeEnv = await askYesNo(
    '\n.env.local already exists. Overwrite it?',
    false,
  );
} catch {
  writeEnv = true;
}

if (writeEnv) {
  const lines = [
    '# Generated by npm run setup. Do not commit.',
    `NEXT_PUBLIC_SITE_URL=${url.replace(/\/+$/, '')}`,
    `NEXT_PUBLIC_SITE_INDEXABLE=${indexable ? 'true' : 'false'}`,
  ];

  if (analytics !== 'none') {
    lines.push('NEXT_PUBLIC_ANALYTICS_ID=');
  }

  await writeFile(ENV_PATH, `${lines.join('\n')}\n`, 'utf8');
}

/* ── Summary ───────────────────────────────────────────────────── */

console.log('\nDone.\n');
console.log('  config/project.json      site identity, SEO, brand, features');
console.log('  app/theme.generated.css  design tokens');
if (writeEnv) console.log('  .env.local               deployment overrides');
console.log('\nNext:');
console.log('  npm install');
console.log('  npm run dev');
console.log('  read docs/SETUP.md for the post-setup checklist\n');
