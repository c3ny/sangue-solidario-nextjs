/**
 * Scrolls the viewport to the first field-id present in the errors object.
 * Field keys must match DOM `id` attributes of form inputs.
 * Falls back silently if no element matches.
 */
export function scrollToFirstError(
  errors: Record<string, string | undefined>,
  order?: string[]
): void {
  const keys = order ?? Object.keys(errors);
  const firstErrored = keys.find((k) => errors[k]);
  if (!firstErrored || typeof document === "undefined") return;

  const el = document.getElementById(firstErrored);
  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // Focus without scrolling again (we already scrolled)
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    el.focus({ preventScroll: true });
  }
}
