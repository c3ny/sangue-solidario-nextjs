/**
 * Calculo de elegibilidade para proxima doacao de sangue total
 * conforme regras Anvisa:
 *   - MALE: intervalo minimo de 60 dias
 *   - FEMALE: intervalo minimo de 90 dias
 *
 * Se `lastDonationDate` e null significa que o usuario nunca doou —
 * pode doar a qualquer momento.
 */

export type DonorGender = "MALE" | "FEMALE";

export interface NextDonationInfo {
  /** true quando o doador esta liberado para doar agora. */
  eligible: boolean;
  /** Data a partir da qual pode doar (null se eligible=true). */
  eligibleAt: Date | null;
  /** Dias restantes ate eligible (0 quando eligible=true). */
  daysRemaining: number;
  /** Dias do intervalo minimo aplicado. */
  intervalDays: number;
}

const MALE_INTERVAL_DAYS = 60;
const FEMALE_INTERVAL_DAYS = 90;

export function getNextDonationInfo(
  gender: DonorGender,
  lastDonationDate: string | Date | null | undefined,
  now: Date = new Date()
): NextDonationInfo {
  const intervalDays =
    gender === "MALE" ? MALE_INTERVAL_DAYS : FEMALE_INTERVAL_DAYS;

  if (!lastDonationDate) {
    return {
      eligible: true,
      eligibleAt: null,
      daysRemaining: 0,
      intervalDays,
    };
  }

  const last =
    typeof lastDonationDate === "string"
      ? new Date(lastDonationDate)
      : lastDonationDate;

  const eligibleAt = new Date(last);
  eligibleAt.setDate(eligibleAt.getDate() + intervalDays);

  const msRemaining = eligibleAt.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  return {
    eligible: daysRemaining === 0,
    eligibleAt: daysRemaining === 0 ? null : eligibleAt,
    daysRemaining,
    intervalDays,
  };
}

export function formatNextDonationDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
