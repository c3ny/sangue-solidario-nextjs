/**
 * Default avatars served from /public/avatars/.
 * The "name" is the value persisted as the user's avatarPath after the
 * "/avatars/" prefix; the "path" is what <Image> consumes.
 */
export interface DefaultAvatar {
  name: string;
  path: string;
  label: string;
}

export const DEFAULT_DONOR_AVATARS: readonly DefaultAvatar[] = [
  { name: "donor-1", path: "/avatars/donor-1.svg", label: "Vermelho" },
  { name: "donor-2", path: "/avatars/donor-2.svg", label: "Azul" },
  { name: "donor-3", path: "/avatars/donor-3.svg", label: "Verde" },
  { name: "donor-4", path: "/avatars/donor-4.svg", label: "Roxo" },
];

export const DEFAULT_COMPANY_AVATARS: readonly DefaultAvatar[] = [
  { name: "company-1", path: "/avatars/company-1.svg", label: "Vermelho" },
  { name: "company-2", path: "/avatars/company-2.svg", label: "Azul" },
  { name: "company-3", path: "/avatars/company-3.svg", label: "Verde" },
  { name: "company-4", path: "/avatars/company-4.svg", label: "Roxo" },
];

const VALID_DEFAULT_NAMES = new Set<string>([
  ...DEFAULT_DONOR_AVATARS.map((a) => a.name),
  ...DEFAULT_COMPANY_AVATARS.map((a) => a.name),
]);

export function isValidDefaultAvatarName(name: string): boolean {
  return VALID_DEFAULT_NAMES.has(name);
}

export function getDefaultAvatarPath(name: string): string {
  return `/avatars/${name}.svg`;
}

export function getDefaultAvatarsForPersonType(
  personType?: string,
): readonly DefaultAvatar[] {
  return personType === "COMPANY" ? DEFAULT_COMPANY_AVATARS : DEFAULT_DONOR_AVATARS;
}

/**
 * Resolves an avatarPath to a value usable by <Image src={...}>.
 *
 * Cases:
 *  - empty/undefined: returns ""
 *  - absolute http(s) URL (Cloudinary): returned as-is
 *  - "/avatars/..." (default avatar in /public): returned as-is
 *  - other (legacy: relative path served by users-service): prefixed
 */
export function resolveAvatarUrl(
  avatarPath?: string | null,
  baseUrl?: string,
): string {
  if (!avatarPath) return "";
  if (avatarPath.startsWith("http://") || avatarPath.startsWith("https://")) {
    return avatarPath;
  }
  if (avatarPath.startsWith("/avatars/")) return avatarPath;
  const base = baseUrl ?? process.env.NEXT_PUBLIC_USERS_SERVICE_URL ?? "";
  return `${base}${avatarPath}`;
}
