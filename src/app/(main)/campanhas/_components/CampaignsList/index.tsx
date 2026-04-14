"use client";

import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsCalendar3,
  BsGeoAlt,
  BsDropletFill,
  BsBuilding,
  BsSearch,
} from "react-icons/bs";
import {
  ICampaign,
  CampaignStatus,
} from "@/features/Campaign/interfaces/Campaign.interface";
import styles from "./styles.module.scss";

export interface ICampaignsListProps {
  initialCampaigns: ICampaign[];
  organizerLogos?: Record<string, string>;
}

export const CampaignsList = memo(function CampaignsList({
  initialCampaigns,
  organizerLogos = {},
}: ICampaignsListProps) {
  const [campaigns] = useState<ICampaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusLabel = (status: CampaignStatus): string => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return "Ativa";
      case CampaignStatus.COMPLETED:
        return "Concluída";
      case CampaignStatus.CANCELLED:
        return "Cancelada";
      default:
        return status;
    }
  };

  const getStatusClass = (status: CampaignStatus): string => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return styles.statusActive;
      case CampaignStatus.COMPLETED:
        return styles.statusCompleted;
      case CampaignStatus.CANCELLED:
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  const getProgressPercentage = (campaign: ICampaign): number => {
    if (!campaign.targetDonations) return 0;
    return Math.min(
      (campaign.currentDonations / campaign.targetDonations) * 100,
      100
    );
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    return (
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Campanhas de Doação</h1>
          <p className={styles.pageSubtitle}>
            Encontre campanhas ativas e participe salvando vidas
          </p>
        </div>

        {/* Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.searchBox}>
            <BsSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por campanha, instituição ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

        </div>

        {/* Results Count */}
        <div className={styles.resultsCount}>
          {filteredCampaigns.length}{" "}
          {filteredCampaigns.length === 1
            ? "campanha encontrada"
            : "campanhas encontradas"}
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma campanha encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          <div className={styles.campaignsGrid}>
            {filteredCampaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campanha/${campaign.id}`}
                className={styles.campaignCard}
              >
                {/* Banner Image */}
                {campaign.bannerImage && (
                  <div className={styles.cardBanner}>
                    <Image
                      src={campaign.bannerImage}
                      alt={campaign.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      className={`${styles.statusBadge} ${getStatusClass(
                        campaign.status
                      )}`}
                    >
                      {getStatusLabel(campaign.status)}
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{campaign.title}</h3>
                  <p className={styles.cardDescription}>
                    {campaign.description}
                  </p>

                  {/* Meta Information */}
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <BsCalendar3 className={styles.metaIcon} />
                      <span>
                        {formatDate(campaign.startDate)} -{" "}
                        {formatDate(campaign.endDate)}
                      </span>
                    </div>

                    <div className={styles.metaItem}>
                      <BsGeoAlt className={styles.metaIcon} />
                      <span>
                        {campaign.location.city}, {campaign.location.uf}
                      </span>
                    </div>

                    {campaign.bloodType && (
                      <div className={styles.metaItem}>
                        <BsDropletFill className={styles.metaIcon} />
                        <span>Tipo: {campaign.bloodType}</span>
                      </div>
                    )}
                  </div>

                  {/* Organizado por */}
                  <div className={styles.organizerCard}>
                    <span className={styles.organizerLabel}>Organizado por</span>
                    <div className={styles.organizerInfo}>
                      <div className={styles.organizerAvatar}>
                        {(() => {
                          const logo =
                            organizerLogos[campaign.organizerId] ??
                            (campaign.organizerUsername
                              ? organizerLogos[campaign.organizerUsername]
                              : undefined);
                          return logo ? (
                            <Image
                              src={logo}
                              alt={campaign.organizerName}
                              fill
                              sizes="40px"
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <BsBuilding />
                          );
                        })()}
                      </div>
                      <div className={styles.organizerDetails}>
                        <span className={styles.organizerName}>
                          {campaign.organizerName}
                        </span>
                        {campaign.organizerUsername && (
                          <span className={styles.organizerUsername}>
                            @{campaign.organizerUsername}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {campaign.targetDonations && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>Progresso</span>
                        <span className={styles.progressCount}>
                          {campaign.currentDonations} /{" "}
                          {campaign.targetDonations} doações
                        </span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{
                            width: `${getProgressPercentage(campaign)}%`,
                          }}
                        ></div>
                      </div>
                      <span className={styles.progressPercentage}>
                        {Math.round(getProgressPercentage(campaign))}% concluído
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
});
