import Link from "next/link";
import type { AppointmentActionError } from "@/actions/appointments/appointments-actions";

interface AppointmentErrorMessageProps {
  error: AppointmentActionError;
}

/**
 * Renders an appointment-related error with contextual rich content
 * (e.g. a Link to /perfil when the user already has an active appointment).
 *
 * Falls back to plain text for unknown codes / network failures.
 */
export function AppointmentErrorMessage({ error }: AppointmentErrorMessageProps) {
  if (error.code === "DONOR_ALREADY_BOOKED") {
    return (
      <span>
        Você já tem um agendamento ativo. Cancele-o no seu{" "}
        <Link href="/perfil" style={{ textDecoration: "underline", fontWeight: 600 }}>
          Perfil
        </Link>{" "}
        antes de criar um novo.
      </span>
    );
  }

  return <span>{error.message}</span>;
}
