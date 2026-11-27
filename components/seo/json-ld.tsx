/**
 * Render JSON-LD. A server component: no client JavaScript ships for it.
 *
 * The `<` escape prevents a string value from closing the script tag early.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
