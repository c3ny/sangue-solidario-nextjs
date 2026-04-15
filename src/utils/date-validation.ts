/**
 * Central date parsing + validation helpers.
 *
 * Accepts DD/MM/YYYY, DDMMYYYY (8 digits) or YYYY-MM-DD; returns Date (or null
 * on parse failure). All comparison helpers normalize to UTC midnight so that
 * "hoje" == "hoje" regardless of client timezone.
 */

function stripToUtcMidnight(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function parseFlexibleDate(input: string): Date | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();

  // YYYY-MM-DD
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) {
    const [, y, m, d] = iso;
    const date = new Date(Date.UTC(+y, +m - 1, +d));
    return isNaN(date.getTime()) ? null : date;
  }

  // DD/MM/YYYY
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (br) {
    const [, d, m, y] = br;
    const date = new Date(Date.UTC(+y, +m - 1, +d));
    return isNaN(date.getTime()) ? null : date;
  }

  // DDMMYYYY (8 digits, no separators)
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 8) {
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4);
    const date = new Date(Date.UTC(+y, +m - 1, +d));
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function todayUtc(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

/** Hoje em YYYY-MM-DD (útil para atributo HTML `min` em <input type="date">). */
export function todayISO(): string {
  return todayUtc().toISOString().slice(0, 10);
}

/** true se birthDate corresponde a 18+ anos completos hoje. */
export function isAtLeast18(birthDate: string): boolean {
  const d = parseFlexibleDate(birthDate);
  if (!d) return false;

  const today = todayUtc();
  const eighteenYearsAgo = new Date(
    Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate()),
  );
  return stripToUtcMidnight(d).getTime() <= eighteenYearsAgo.getTime();
}

/** true se date ≥ hoje. */
export function isFutureOrToday(date: string): boolean {
  const d = parseFlexibleDate(date);
  if (!d) return false;
  return stripToUtcMidnight(d).getTime() >= todayUtc().getTime();
}

/** true se date ≤ hoje. */
export function isPastOrToday(date: string): boolean {
  const d = parseFlexibleDate(date);
  if (!d) return false;
  return stripToUtcMidnight(d).getTime() <= todayUtc().getTime();
}

/** true se end ≥ start (strict: start must be valid). */
export function isEndAfterOrEqualStart(start: string, end: string): boolean {
  const s = parseFlexibleDate(start);
  const e = parseFlexibleDate(end);
  if (!s || !e) return false;
  return stripToUtcMidnight(e).getTime() >= stripToUtcMidnight(s).getTime();
}

/** true se end > start (strict). Usado para entryDate < expiryDate em lotes. */
export function isEndAfterStart(start: string, end: string): boolean {
  const s = parseFlexibleDate(start);
  const e = parseFlexibleDate(end);
  if (!s || !e) return false;
  return stripToUtcMidnight(e).getTime() > stripToUtcMidnight(s).getTime();
}

/** Converte qualquer formato aceito para YYYY-MM-DD. Retorna "" se inválido. */
export function toISODate(input: string): string {
  const d = parseFlexibleDate(input);
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

/** Converte YYYY-MM-DD ou DDMMYYYY para DD/MM/YYYY. Retorna "" se inválido. */
export function toBRDate(input: string): string {
  const d = parseFlexibleDate(input);
  if (!d) return "";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy}`;
}
