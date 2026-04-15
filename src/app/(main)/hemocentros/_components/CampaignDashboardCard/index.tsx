"use client";

import Image from "next/image";
import Link from "next/link";
import { BsCalendar3, BsGeoAlt, BsDroplet, BsEye, BsPencilSquare } from "react-icons/bs";
import { ICampaign, CampaignStatus } from "@/features/Campaign/interfaces/Campaign.interface";
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
  const hasTarget =
    typeof campaign.targetDonations === "number" && campaign.targetDonations > 0;
  const percentage = hasTarget
    ? Math.min(100, Math.round((campaign.currentDonations / campaign.targetDonations!) * 100))
    : 0;

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
          <Link
            href={`/campanha/${campaign.id}/editar`}
            className={`${styles.actionButton} ${styles.primary}`}
          >
            <BsPencilSquare /> Editar
          </Link>
        )}
      </div>
    </article>
  );
}
