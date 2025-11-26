import {
  BsDroplet,
  BsGeoAlt,
  BsCalendarCheck,
  BsHeart,
  BsInfoCircle,
} from "react-icons/bs";
import dynamicImport from "next/dynamic";
import donationsService from "@/features/Solicitations/services/donations.service";
import { Button } from "@/components/Button";
import { MapLoading } from "@/components/MapLoading";
import styles from "./styles.module.scss";
import { APIService } from "@/service/api/api";
import { OpenMapsButton } from "@/components/OpenMapsButton";

const ViewSolicitationMapSection = dynamicImport(
  () => import("@/features/ViewSolicitations/components/Map"),
  {
    loading: () => (
      <MapLoading
        width="100%"
        height="400px"
        message="Carregando mapa da solicitação..."
      />
    ),
  }
);

export default async function VisualizarSolicitacao({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const apiService = new APIService();
  const solicitation = await donationsService.getDonation(id);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));
  };

  if (!solicitation) {
    return (
      <main className={styles.container}>
        <div className={styles.errorContainer}>
          <h1>Solicitação não encontrada</h1>
          <p>A solicitação que você está procurando não existe.</p>
        </div>
      </main>
    );
  }

  const cardsInformations = [
    {
      icon: <BsDroplet />,
      title: "Tipo Sanguíneo",
      value: solicitation.bloodType,
    },
    {
      icon: <BsInfoCircle />,
      title: "Quantidade",
      value: solicitation.quantity,
    },
    {
      icon: <BsCalendarCheck />,
      title: "Prazo",
      value: `${formatDate(solicitation.startDate)} a ${formatDate(
        solicitation.finishDate
      )}`,
    },
  ];

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <div className={styles.badge}>
                <BsHeart className={styles.badgeIcon} />
                <span>Doação Urgente</span>
              </div>
              <h1 className={styles.heroTitle}>
                Ajude{" "}
                <span className={styles.highlight}>{solicitation.name}</span>
              </h1>
              <p className={styles.heroDescription}>{solicitation.content}</p>
              <div className={styles.heroActions}>
                <Button variant="primary" iconBefore={<BsHeart />}>
                  Quero Ajudar
                </Button>
              </div>
            </div>
            <div className={styles.heroImage}>
              <img
                src={
                  apiService.getDonationFileServiceUrl(
                    solicitation.image || ""
                  ) || "/assets/images/placeholder.jpg"
                }
                alt={solicitation.name}
                className={styles.solicitationImage}
              />
            </div>
          </div>
        </section>

        <section className={styles.infoGrid}>
          {cardsInformations.map((card) => (
            <div className={styles.infoCard} key={card.title}>
              <div className={styles.infoCardIcon}>{card.icon}</div>
              <div className={styles.infoCardContent}>
                <h3 className={styles.infoCardTitle}>{card.title}</h3>
                <p className={styles.infoCardValue}>{card.value}</p>
              </div>
            </div>
          ))}
        </section>

        <section className={styles.locationSection}>
          <div className={styles.locationContent}>
            <div className={styles.locationInfo}>
              <div className={styles.sectionHeader}>
                <BsGeoAlt className={styles.sectionIcon} />
                <h2 className={styles.sectionTitle}>Local de Doação</h2>
              </div>
              <div className={styles.locationDetails}>
                <h3 className={styles.locationAddress}>
                  {solicitation.location?.address}
                </h3>
                <p className={styles.locationDistrict}>
                  {solicitation.location?.name}
                </p>

                <div className={styles.divider} />

                <div className={styles.donationDetails}>
                  <h4 className={styles.detailsTitle}>
                    Informações Importantes:
                  </h4>
                  <ul className={styles.detailsList}>
                    <li>
                      <BsDroplet className={styles.detailIcon} />
                      Sangue solicitado:{" "}
                      <strong>{solicitation.bloodType}</strong>
                    </li>
                    <li>
                      <BsInfoCircle className={styles.detailIcon} />
                      Quantidade necessária:{" "}
                      <strong>{solicitation.quantity} bolsas</strong>
                    </li>
                    <li>
                      <BsCalendarCheck className={styles.detailIcon} />
                      Prazo para doação:{" "}
                      <strong>
                        {formatDate(solicitation.startDate)} a{" "}
                        {formatDate(solicitation.finishDate)}
                      </strong>
                    </li>
                  </ul>
                </div>

                <OpenMapsButton
                  variant="secondary"
                  fullWidth
                  address={solicitation.location?.address || ""}
                  latitude={solicitation.location?.latitude}
                  longitude={solicitation.location?.longitude}
                />
              </div>
            </div>

            <div className={styles.mapContainer}>
              <ViewSolicitationMapSection
                marker={{
                  location: solicitation.location ?? {
                    latitude: 0,
                    longitude: 0,
                  },
                  tooltip: solicitation.name,
                }}
                center={solicitation.location}
              />
            </div>
          </div>
        </section>

        {/* <section className={styles.contactCard}>
          <div className={styles.contactContent}>
            <BsTelephone className={styles.contactIcon} />
            <div className={styles.contactText}>
              <h3 className={styles.contactTitle}>
                Precisa de mais informações?
              </h3>
              <p className={styles.contactDescription}>
                Entre em contato conosco para esclarecer dúvidas sobre o
                processo de doação.
              </p>
            </div>
            <Button variant="primary" iconBefore={<BsTelephone />}>
              (15) 99999-9999
            </Button>
          </div>
        </section> */}
      </div>
    </main>
  );
}
