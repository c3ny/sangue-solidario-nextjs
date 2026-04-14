import Link from "next/link";
import Image from "next/image";
import { BsCalendar3, BsMegaphone } from "react-icons/bs";
import { ICampaign } from "@/features/Campaign/interfaces/Campaign.interface";
import styles from "./styles.module.scss";

interface CampaignCardProps {
  campaign: ICampaign;
}

function formatDateRange(start: string, end: string): string {
  const fmt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };
  return `${fmt(start)} - ${fmt(end)}`;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress =
    campaign.targetDonations && campaign.targetDonations > 0
      ? Math.min(
          100,
          Math.round(
            (campaign.currentDonations / campaign.targetDonations) * 100
          )
        )
      : null;

  return (
    <Link href={`/campanha/${campaign.id}`} className={styles.card}>
      <div className={styles.bannerWrapper}>
        {campaign.bannerImage ? (
          <Image
            src={campaign.bannerImage}
            alt={campaign.title}
            fill
            className={styles.bannerImage}
          />
        ) : (
          <BsMegaphone className={styles.bannerPlaceholder} />
        )}
      </div>

      <div className={styles.content}>
        <span className={styles.title}>{campaign.title}</span>
        <span className={styles.organizer}>{campaign.organizerName}</span>

        <span className={styles.dates}>
          <BsCalendar3 className={styles.dateIcon} />
          {formatDateRange(campaign.startDate, campaign.endDate)}
        </span>

        {progress !== null && (
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {campaign.currentDonations}/{campaign.targetDonations} doacoes
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
