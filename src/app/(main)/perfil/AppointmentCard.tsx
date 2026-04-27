"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsCalendar3, BsClock, BsDroplet, BsEye, BsXCircle } from "react-icons/bs";
import {
  IAppointment,
  AppointmentStatus,
} from "@/features/Institution/interfaces/Appointment.interface";
import { cancelAppointmentAction } from "@/actions/appointments/appointments-actions";
import { Modal } from "@/components/Modal";
import styles from "./AppointmentCard.module.scss";

interface AppointmentCardProps {
  appointment: IAppointment;
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: "Pendente",
  [AppointmentStatus.CONFIRMED]: "Confirmado",
  [AppointmentStatus.COMPLETED]: "Concluído",
  [AppointmentStatus.CANCELLED]: "Cancelado",
  [AppointmentStatus.NO_SHOW]: "Não compareceu",
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]: styles.statusPending,
  [AppointmentStatus.CONFIRMED]: styles.statusConfirmed,
  [AppointmentStatus.COMPLETED]: styles.statusCompleted,
  [AppointmentStatus.CANCELLED]: styles.statusCancelled,
  [AppointmentStatus.NO_SHOW]: styles.statusNoShow,
};

function formatDate(value: string): string {
  // value is "YYYY-MM-DD" — parse without timezone shift.
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<AppointmentStatus>(
    appointment.status,
  );

  const canCancel =
    localStatus === AppointmentStatus.PENDING ||
    localStatus === AppointmentStatus.CONFIRMED;

  const handleConfirmCancel = () => {
    setError("");
    startTransition(async () => {
      const result = await cancelAppointmentAction(appointment.id);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setLocalStatus(result.appointment.status);
      setConfirmOpen(false);
      router.refresh();
    });
  };

  return (
    <article className={styles.card}>
      <div className={styles.info}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>Agendamento de doação</h3>
          <span
            className={`${styles.statusBadge} ${STATUS_CLASS[localStatus]}`}
          >
            {STATUS_LABEL[localStatus]}
          </span>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <BsCalendar3 /> {formatDate(appointment.scheduledDate)}
          </span>
          <span className={styles.metaItem}>
            <BsClock /> {appointment.scheduledTime}
          </span>
          <span className={styles.metaItem}>
            <BsDroplet /> {appointment.bloodType}
          </span>
        </div>

        {appointment.notes && (
          <p className={styles.notes}>{appointment.notes}</p>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.actions}>
        {appointment.campaignId && (
          <Link
            href={`/campanha/${appointment.campaignId}`}
            className={`${styles.actionButton} ${styles.outline}`}
          >
            <BsEye /> Ver campanha
          </Link>
        )}
        {canCancel && (
          <button
            type="button"
            className={`${styles.actionButton} ${styles.danger}`}
            onClick={() => setConfirmOpen(true)}
            disabled={isPending}
          >
            <BsXCircle /> {isPending ? "Cancelando..." : "Cancelar"}
          </button>
        )}
      </div>

      <Modal
        isOpen={confirmOpen}
        onClose={() => (isPending ? null : setConfirmOpen(false))}
        title="Cancelar agendamento"
        size="small"
      >
        <p style={{ margin: 0, color: "#495057", lineHeight: 1.5 }}>
          Tem certeza que deseja cancelar este agendamento? Esta ação não pode
          ser desfeita.
        </p>
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.modalCancel}
            onClick={() => setConfirmOpen(false)}
            disabled={isPending}
          >
            Voltar
          </button>
          <button
            type="button"
            className={styles.modalConfirm}
            onClick={handleConfirmCancel}
            disabled={isPending}
          >
            {isPending ? "Cancelando..." : "Sim, cancelar"}
          </button>
        </div>
      </Modal>
    </article>
  );
}
