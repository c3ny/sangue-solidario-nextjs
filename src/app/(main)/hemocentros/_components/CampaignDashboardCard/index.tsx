"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BsCalendar3,
  BsGeoAlt,
  BsDroplet,
  BsEye,
  BsPencilSquare,
  BsXCircle,
} from "react-icons/bs";
import { ICampaign, CampaignStatus } from "@/features/Campaign/interfaces/Campaign.interface";
import { updateCampaignAction } from "@/actions/campaign/campaign-actions";
import styles from "./styles.module.scss";

interface CampaignDashboardCardProps {
  campaign: ICampaign;
}

const STATUS_LABEL: Record<CampaignStatus, string> = {
  [CampaignStatus.ACTIVE]: "Ativa",
  [CampaignStatus.COMPLETED]: "Concluída",
  [CampaignStatus.CANCELLED]: "Cancelada",
};

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const format = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return `${format(start)} – ${format(end)}`;
}

export function CampaignDashboardCard({ campaign }: CampaignDashboardCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const hasTarget =
    typeof campaign.targetDonations === "number" && campaign.targetDonations > 0;
  const percentage = hasTarget
    ? Math.min(100, Math.round((campaign.currentDonations / campaign.targetDonations!) * 100))
    : 0;

  const handleCancel = () => {
    if (
      !confirm(
        "Encerrar esta campanha antes da data final? Ela ficará marcada como cancelada e não poderá ser reaberta."
      )
    )
      return;

    setError("");
    startTransition(async () => {
      try {
        await updateCampaignAction(campaign.id, {
          status: CampaignStatus.CANCELLED,
        });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao encerrar");
      }
    });
  };

  const statusClass =
    campaign.status === CampaignStatus.ACTIVE
      ? styles.statusActive
      : campaign.status === CampaignStatus.COMPLETED
      ? styles.statusCompleted
      : styles.statusCancelled;

  return (
    <article className={styles.card}>
      {campaign.bannerImage ? (
        <div className={styles.bannerWrapper}>
          <Image
            src={campaign.bannerImage}
            alt={campaign.title}
            fill
            sizes="88px"
            className={styles.banner}
          />
        </div>
      ) : (
        <div className={styles.bannerPlaceholder} aria-hidden>
          <BsDroplet />
        </div>
      )}

      <div className={styles.info}>
        <div className={styles.topRow}>
          <h3 className={styles.title}>{campaign.title}</h3>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {STATUS_LABEL[campaign.status]}
          </span>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <BsGeoAlt /> {campaign.location.city}/{campaign.location.uf}
          </span>
          <span className={styles.metaItem}>
            <BsCalendar3 /> {formatDateRange(campaign.startDate, campaign.endDate)}
          </span>
          {campaign.bloodType && (
            <span className={styles.metaItem}>
              <BsDroplet /> {campaign.bloodType}
            </span>
          )}
        </div>

        {hasTarget && (
          <div className={styles.progress}>
            <div className={styles.progressText}>
              {campaign.currentDonations} / {campaign.targetDonations} doações
              <span className={styles.progressPercent}>{percentage}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Link
          href={`/campanha/${campaign.id}`}
          className={`${styles.actionButton} ${styles.outline}`}
        >
          <BsEye /> Visualizar
        </Link>
        {campaign.status === CampaignStatus.ACTIVE && (
          <>
            <Link
              href={`/campanha/${campaign.id}/editar`}
              className={`${styles.actionButton} ${styles.primary}`}
            >
              <BsPencilSquare /> Editar
            </Link>
            <button
              type="button"
              onClick={handleCancel}
              className={`${styles.actionButton} ${styles.danger}`}
              disabled={isPending}
            >
              <BsXCircle /> {isPending ? "Encerrando..." : "Encerrar"}
            </button>
          </>
        )}
      </div>
      {error && (
        <div
          style={{
            gridColumn: "1 / -1",
            color: "#b00020",
            fontSize: "0.85rem",
            marginTop: "0.25rem",
          }}
        >
          {error}
        </div>
      )}
    </article>
  );
}
