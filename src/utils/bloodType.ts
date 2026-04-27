export const BLOOD_TYPE_UNKNOWN = "UNKNOWN" as const;

export const KNOWN_BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type KnownBloodType = (typeof KNOWN_BLOOD_TYPES)[number];
export type BloodTypeValue = KnownBloodType | typeof BLOOD_TYPE_UNKNOWN;

export function isUnknownBloodType(value?: string | null): boolean {
  return value === BLOOD_TYPE_UNKNOWN;
}

export function formatBloodType(value?: string | null): string {
  if (!value) return "—";
  if (isUnknownBloodType(value)) return "Não sei";
  return value;
}
