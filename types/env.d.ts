declare namespace NodeJS {
  interface ProcessEnv {
    /** Absolute production URL. Overrides config/project.json. */
    NEXT_PUBLIC_SITE_URL?: string;
    /** Overrides the site name from config/project.json. */
    NEXT_PUBLIC_SITE_NAME?: string;
    /** "false" blocks indexing. */
    NEXT_PUBLIC_SITE_INDEXABLE?: string;
    /** Optional analytics id. */
    NEXT_PUBLIC_ANALYTICS_ID?: string;
  }
}
