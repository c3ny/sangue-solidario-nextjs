"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsCalendar3, BsDroplet, BsEye, BsXCircle } from "react-icons/bs";
import {
  Solicitation,
  SolicitationStatus,
} from "@/features/Solicitations/interfaces/Solicitations.interface";
import { closeDonation } from "./actions";
import styles from "./DonationDashboardCard.module.scss";

interface DonationDashboardCardProps {
  donation: Solicitation;
}

const STATUS_LABEL: Record<SolicitationStatus, string> = {
  [SolicitationStatus.PENDING]: "Pendente",
  [SolicitationStatus.APPROVED]: "Aprovada",
  [SolicitationStatus.COMPLETED]: "Concluída",
  [SolicitationStatus.CANCELED]: "Cancelada",
};

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatRange(start?: string, end?: string): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function DonationDashboardCard({ donation }: DonationDashboardCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const status = donation.status ?? SolicitationStatus.PENDING;
  const isOpen =
    status === SolicitationStatus.PENDING ||
    status === SolicitationStatus.APPROVED;

  const statusClass =
    status === SolicitationStatus.COMPLETED
      ? styles.statusCompleted
      : status === SolicitationStatus.CANCELED
      ? styles.statusCancelled
      : styles.statusActive;

  const handleClose = () => {
    if (
      !confirm(
        "Encerrar esta solicitação? Ela ficará marcada como concluída e não poderá ser reaberta."
      )
    )
      return;

    setError("");
    startTransition(async () => {
      const result = await closeDonation(String(donation.id));
      if (result.success) {
        router.refresh();
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <article className={styles.card}>
      <div className={styles.info}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{donation.name || "Solicitação"}</h3>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {STATUS_LABEL[status]}
          </span>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <BsDroplet /> {donation.bloodType}
          </span>
          {donation.quantity ? (
            <span className={styles.metaItem}>
              {donation.quantity} bolsa(s)
            </span>
          ) : null}
          <span className={styles.metaItem}>
            <BsCalendar3 /> {formatRange(donation.startDate, donation.finishDate)}
          </span>
        </div>

        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.actions}>
        <Link
          href={`/visualizar-solicitacao/${donation.id}`}
          className={`${styles.actionButton} ${styles.outline}`}
        >
          <BsEye /> Visualizar
        </Link>
        {isOpen && (
          <button
            type="button"
            className={`${styles.actionButton} ${styles.danger}`}
            onClick={handleClose}
            disabled={isPending}
          >
            <BsXCircle /> {isPending ? "Encerrando..." : "Encerrar"}
          </button>
        )}
      </div>
    </article>
  );
}
