// Escapes `<` so embedding this in a <script> tag can never be broken out of
// by content containing "</script>" — schema.org JSON-LD is otherwise just
// plain JSON, and < round-trips to "<" for any JSON-LD consumer.
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
