'use client';

import { useEffect, useState } from 'react';

/**
 * Subscribe to a media query.
 *
 * Starts false on the server, so the first paint is deterministic. Only use
 * this for behaviour that cannot be expressed in CSS; prefer a CSS media
 * query for layout and styling.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
