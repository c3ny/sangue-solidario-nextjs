"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsArrowRight,
  BsChevronRight,
  BsMegaphone,
  BsDroplet,
} from "react-icons/bs";
import styles from "./styles.module.scss";

export type BloodDonationItem =
  | {
      type: "campaign";
      id: string;
      href: string;
      name: string;
      creator: string;
      organizerLogo?: string;
      startDate: string;
      endDate: string;
      currentDonations: number;
      goalDonations: number;
      isActive: boolean;
    }
  | {
      type: "hemocentro";
      id: string;
      href: string;
      name: string;
      logo?: string;
      city: string;
      state: string;
    };

type Filter = "all" | "campaign" | "hemocentro";

interface BloodDonationClientProps {
  campaigns: Extract<BloodDonationItem, { type: "campaign" }>[];
  hemocentros: Extract<BloodDonationItem, { type: "hemocentro" }>[];
}

const HOME_LIMIT = 5;
const MONTH_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatDateRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const fmt = (d: Date) => `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

const VIEW_ALL_HREF: Record<Filter, string> = {
  all: "/campanhas",
  campaign: "/campanhas",
  hemocentro: "/encontrar-hemocentros",
};

export function BloodDonationClient({
  campaigns,
  hemocentros,
}: BloodDonationClientProps) {
  const [filter, setFilter] = useState<Filter>("all");

  // Campanhas primeiro, depois hemocentros — limitado a 5 quando "all"
  const allItems: BloodDonationItem[] = useMemo(
    () => [...campaigns, ...hemocentros].slice(0, HOME_LIMIT),
    [campaigns, hemocentros]
  );

  const visibleItems = useMemo(() => {
    if (filter === "all") return allItems;
    return allItems.filter((item) => item.type === filter);
  }, [allItems, filter]);

  const renderChip = (id: Filter, label: string) => (
    <button
      key={id}
      type="button"
      role="tab"
      aria-selected={filter === id}
      className={`${styles.chip} ${filter === id ? styles.chipActive : ""}`}
      onClick={() => setFilter(id)}
    >
      {label}
    </button>
  );

  return (
    <section className={styles.section} aria-label="Campanhas para doação de sangue">
      <div className={styles.header}>
        <h2 className={styles.title}>Campanhas para doação de sangue</h2>
        <Link href={VIEW_ALL_HREF[filter]} className={styles.viewAll}>
          Ver todos <BsArrowRight />
        </Link>
      </div>

      <div className={styles.chips} role="tablist" aria-label="Filtrar por tipo">
        {renderChip("all", "Todos")}
        {renderChip("campaign", "Campanhas")}
        {renderChip("hemocentro", "Hemocentros")}
      </div>

      {visibleItems.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum item encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className={styles.list} role="list">
          {visibleItems.map((item, i) =>
            item.type === "campaign" ? (
              <CampaignCard key={`${item.type}-${item.id}`} item={item} index={i} />
            ) : (
              <HemocentroCard key={`${item.type}-${item.id}`} item={item} index={i} />
            )
          )}
        </div>
      )}
    </section>
  );
}

function CampaignCard({
  item,
  index,
}: {
  item: Extract<BloodDonationItem, { type: "campaign" }>;
  index: number;
}) {
  const hasGoal = item.goalDonations > 0;
  const percent = hasGoal
    ? Math.min(100, Math.round((item.currentDonations / item.goalDonations) * 100))
    : 0;

  return (
    <Link
      href={item.href}
      className={styles.card}
      role="listitem"
      style={{ animationDelay: `${0.05 + index * 0.05}s` }}
    >
      <div className={`${styles.cardIcon} ${styles.cardIconCampaign}`}>
        {item.organizerLogo ? (
          <Image
            src={item.organizerLogo}
            alt={item.creator}
            width={52}
            height={52}
            className={styles.cardIconImage}
          />
        ) : (
          <BsMegaphone size={20} />
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTopRow}>
          <span className={styles.cardTitle}>{item.name}</span>
          <span className={`${styles.badge} ${styles.badgeCampaign}`}>Campanha</span>
          {item.isActive && (
            <span className={`${styles.badge} ${styles.badgeActive}`}>Ativa</span>
          )}
        </div>
        <div className={styles.cardMeta}>
          <span>{item.creator}</span>
          <span className={styles.separator} aria-hidden />
          <span>{formatDateRange(item.startDate, item.endDate)}</span>
        </div>
        {hasGoal && (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>
            <span className={styles.progressLabel}>
              {item.currentDonations} / {item.goalDonations}
            </span>
          </div>
        )}
      </div>
      <BsChevronRight className={styles.cardArrow} size={18} />
    </Link>
  );
}

function HemocentroCard({
  item,
  index,
}: {
  item: Extract<BloodDonationItem, { type: "hemocentro" }>;
  index: number;
}) {
  return (
    <Link
      href={item.href}
      className={styles.card}
      role="listitem"
      style={{ animationDelay: `${0.05 + index * 0.05}s` }}
    >
      <div className={`${styles.cardIcon} ${styles.cardIconHemocentro}`}>
        {item.logo ? (
          <Image
            src={item.logo}
            alt={item.name}
            width={52}
            height={52}
            className={styles.cardIconImage}
          />
        ) : (
          <BsDroplet size={20} />
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardTopRow}>
          <span className={styles.cardTitle}>{item.name}</span>
          <span className={`${styles.badge} ${styles.badgeHemocentro}`}>
            Hemocentro
          </span>
        </div>
        <div className={styles.cardMeta}>
          <span>
            {item.city}
            {item.state ? `/${item.state}` : ""}
          </span>
        </div>
      </div>
      <BsChevronRight className={styles.cardArrow} size={18} />
    </Link>
  );
}
