/**
 * Bilingual text component — renders both EN and BM spans.
 * Visibility is controlled by CSS rules that key off <html lang="en|ms">.
 * No client JS, no context, no flash — works in server components too.
 */
export default function T({ en, ms }: { en: string; ms: string }) {
  return (
    <>
      <span data-lang="en">{en}</span>
      <span data-lang="ms">{ms}</span>
    </>
  );
}
