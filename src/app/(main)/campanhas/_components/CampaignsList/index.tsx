"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BsCalendar3,
  BsGeoAlt,
  BsDropletFill,
  BsBuilding,
  BsSearch,
  BsFunnel,
} from "react-icons/bs";
import {
  ICampaign,
  CampaignStatus,
} from "@/features/Campaign/interfaces/Campaign.interface";
import styles from "./styles.module.scss";

export interface ICampaignsListProps {
  initialCampaigns: ICampaign[];
}

export const CampaignsList = ({ initialCampaigns }: ICampaignsListProps) => {
  const [campaigns] = useState<ICampaign[]>(initialCampaigns);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">(
    "ALL"
  );

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
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.location.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
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

          <div className={styles.statusFilter}>
            <BsFunnel className={styles.filterIcon} />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CampaignStatus | "ALL")
              }
              className={styles.filterSelect}
            >
              <option value="ALL">Todas</option>
              <option value={CampaignStatus.ACTIVE}>Ativas</option>
              <option value={CampaignStatus.COMPLETED}>Concluídas</option>
              <option value={CampaignStatus.CANCELLED}>Canceladas</option>
            </select>
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

                    <div className={styles.metaItem}>
                      <BsBuilding className={styles.metaIcon} />
                      <span>{campaign.organizerName}</span>
                    </div>

                    {campaign.bloodType && (
                      <div className={styles.metaItem}>
                        <BsDropletFill className={styles.metaIcon} />
                        <span>Tipo: {campaign.bloodType}</span>
                      </div>
                    )}
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
};
