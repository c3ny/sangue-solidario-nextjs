import { Metadata } from "next";
import {
  BsBuilding,
  BsGeoAlt,
  BsTelephone,
  BsEnvelope,
  BsGlobe,
  BsClock,
  BsDropletFill,
  BsCalendar3,
  BsCheckCircleFill,
  BsWhatsapp,
  BsInfoCircle,
  BsMegaphone,
  BsArrowRight,
} from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./styles.module.scss";
import {
  IInstitution,
  InstitutionStatus,
} from "@/features/Institution/interfaces/Institution.interface";
// company.service importado dinamicamente em getInstitution para evitar bundle no client
import {
  ICampaign,
  CampaignStatus,
} from "@/features/Campaign/interfaces/Campaign.interface";
import { InfoCard } from "@/components/InfoCard";
import { logger } from "@/utils/logger";

export const metadata: Metadata = {
  title: "Perfil da Instituição - Sangue Solidário",
  description: "Visualize informações e agende doação de sangue",
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getInstitution(slug: string): Promise<IInstitution | null> {
  try {
    const { getCompanyBySlug } = await import("@/features/Institution/services/company.service");
    return await getCompanyBySlug(slug);
  } catch (error) {
    logger.error("Error fetching institution:", error);
    return null;
  }
}

async function getInstitutionCampaigns(
  institutionId: string
): Promise<ICampaign[]> {
  try {
    const { getCampaignsByInstitution } = await import("@/features/Campaign/services/campaign.service");
    return await getCampaignsByInstitution(institutionId);
  } catch (error) {
    logger.error("Error fetching campaigns:", error);
    return [];
  }
}

function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
}

function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function calculateCampaignProgress(campaign: ICampaign): number {
  if (!campaign.targetDonations) return 0;
  return Math.min(
    (campaign.currentDonations / campaign.targetDonations) * 100,
    100
  );
}

function getCampaignStatusLabel(status: CampaignStatus): string {
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
}

function getCampaignStatusClass(status: CampaignStatus): string {
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
}

export default async function InstitutionProfile({ params }: PageProps) {
  const { slug } = await params;

  const institution = await getInstitution(slug);

  if (!institution) {
    notFound();
  }

  if (institution.status !== InstitutionStatus.ACTIVE) {
    return (
      <div className={styles.error}>
        <BsInfoCircle className={styles.errorIcon} />
        <h2>Instituição indisponível</h2>
        <p>Esta instituição não está aceitando agendamentos no momento</p>
      </div>
    );
  }

  const campaigns = await getInstitutionCampaigns(institution.id);

  return (
    <main className={styles.container}>
      {/* Banner Section */}
      {institution.bannerImage && (
        <div className={styles.banner}>
          <Image
            src={institution.bannerImage}
            alt={institution.institutionName}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerContent}>
              {institution.logoImage && (
                <div className={styles.logoWrapper}>
                  <Image
                    src={institution.logoImage}
                    alt={`Logo ${institution.institutionName}`}
                    width={100}
                    height={100}
                    className={styles.logo}
                  />
                </div>
              )}
              <div className={styles.bannerInfo}>
                <h1 className={styles.bannerTitle}>
                  {institution.institutionName}
                </h1>
                <p className={styles.bannerSubtitle}>/hemocentro/{slug}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.mainGrid}>
          <section className={styles.infoSection}>
            <div className={styles.infoCard}>
              <h2 className={styles.sectionTitle}>
                <BsBuilding className={styles.sectionIcon} />
                Sobre a Instituição
              </h2>
              <p className={styles.description}>{institution.description}</p>

              <div className={styles.contactSection}>
                <h3 className={styles.subsectionTitle}>Contato</h3>
                <div className={styles.contactList}>
                  <div className={styles.contactItem}>
                    <BsTelephone className={styles.contactIcon} />
                    <span>{formatPhone(institution.contact.phone)}</span>
                  </div>
                  {institution.contact.whatsapp && (
                    <div className={styles.contactItem}>
                      <BsWhatsapp className={styles.contactIcon} />
                      <a
                        href={`https://wa.me/${institution.contact.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                      >
                        {formatPhone(institution.contact.whatsapp)}
                      </a>
                    </div>
                  )}
                  <div className={styles.contactItem}>
                    <BsEnvelope className={styles.contactIcon} />
                    <a
                      href={`mailto:${institution.contact.email}`}
                      className={styles.contactLink}
                    >
                      {institution.contact.email}
                    </a>
                  </div>
                  {institution.contact.website && (
                    <div className={styles.contactItem}>
                      <BsGlobe className={styles.contactIcon} />
                      <a
                        href={institution.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                      >
                        Visitar site
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.locationSection}>
                <h3 className={styles.subsectionTitle}>
                  <BsGeoAlt className={styles.subsectionIcon} />
                  Localização
                </h3>
                <div className={styles.locationDetails}>
                  <p>{institution.location.address}</p>
                  {institution.location.neighborhood && (
                    <p>{institution.location.neighborhood}</p>
                  )}
                  <p>
                    {institution.location.city} - {institution.location.uf}
                  </p>
                  {institution.location.zipcode && (
                    <p>CEP: {institution.location.zipcode}</p>
                  )}
                </div>
              </div>

              <div className={styles.scheduleSection}>
                <h3 className={styles.subsectionTitle}>
                  <BsClock className={styles.subsectionIcon} />
                  Horário de Funcionamento
                </h3>
                <div className={styles.scheduleList}>
                  {institution.schedule.map((day, index) => (
                    <div key={index} className={styles.scheduleItem}>
                      <span className={styles.dayName}>{day.dayOfWeek}</span>
                      {day.isOpen ? (
                        <span className={styles.scheduleTime}>
                          {day.openTime} - {day.closeTime}
                        </span>
                      ) : (
                        <span className={styles.scheduleClosed}>Fechado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className={styles.actionsSection}>
            {institution.acceptsScheduling && (
              <div className={styles.ctaCard}>
                <h2 className={styles.ctaTitle}>Agende sua Doação</h2>
                <p className={styles.ctaDescription}>
                  Escolha o melhor dia e horário para você doar sangue
                </p>
                <Link
                  href={`/hemocentro/${slug}/agendamento`}
                  className={styles.ctaButton}
                >
                  <BsCalendar3 />
                  Fazer Agendamento
                </Link>
              </div>
            )}

            <InfoCard
              icon={BsCheckCircleFill}
              title="Dicas para doação"
              items={[
                "Estar bem alimentado",
                "Ter dormido bem na noite anterior",
                "Levar documento com foto",
                "Idade entre 16 e 69 anos",
              ]}
              variant="info"
              iconColor="info"
            />
          </aside>
        </div>

        {campaigns.length > 0 && (
          <section className={styles.campaignsSection}>
            <div className={styles.campaignsHeader}>
              <h2 className={styles.campaignsTitle}>
                <BsMegaphone className={styles.sectionIcon} />
                Campanhas de Doação
              </h2>
              <p className={styles.campaignsSubtitle}>
                Conheça as campanhas ativas e participe salvando vidas
              </p>
            </div>

            <div className={styles.campaignsGrid}>
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campanha/${campaign.id}`}
                  className={styles.campaignCard}
                >
                  {campaign.bannerImage && (
                    <div className={styles.campaignImage}>
                      <Image
                        src={campaign.bannerImage}
                        alt={campaign.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        className={`${styles.campaignStatus} ${getCampaignStatusClass(campaign.status)}`}
                      >
                        {getCampaignStatusLabel(campaign.status)}
                      </div>
                    </div>
                  )}

                  <div className={styles.campaignContent}>
                    <h3 className={styles.campaignTitle}>{campaign.title}</h3>
                    <p className={styles.campaignDescription}>
                      {campaign.description}
                    </p>

                    <div className={styles.campaignMeta}>
                      <div className={styles.campaignMetaItem}>
                        <BsCalendar3 className={styles.campaignMetaIcon} />
                        <span>
                          {formatShortDate(campaign.startDate)} -{" "}
                          {formatShortDate(campaign.endDate)}
                        </span>
                      </div>
                      {campaign.bloodType && (
                        <div className={styles.campaignMetaItem}>
                          <BsDropletFill className={styles.campaignMetaIcon} />
                          <span>{campaign.bloodType}</span>
                        </div>
                      )}
                    </div>

                    {campaign.targetDonations && (
                      <div className={styles.campaignProgress}>
                        <div className={styles.campaignProgressHeader}>
                          <span className={styles.campaignProgressLabel}>
                            Progresso
                          </span>
                          <span className={styles.campaignProgressCount}>
                            {campaign.currentDonations} /{" "}
                            {campaign.targetDonations}
                          </span>
                        </div>
                        <div className={styles.campaignProgressBar}>
                          <div
                            className={styles.campaignProgressFill}
                            style={{
                              width: `${calculateCampaignProgress(campaign)}%`,
                            }}
                          ></div>
                        </div>
                        <span className={styles.campaignProgressPercent}>
                          {Math.round(calculateCampaignProgress(campaign))}% da
                          meta
                        </span>
                      </div>
                    )}

                    <div className={styles.campaignCta}>
                      <span>Ver detalhes</span>
                      <BsArrowRight />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
