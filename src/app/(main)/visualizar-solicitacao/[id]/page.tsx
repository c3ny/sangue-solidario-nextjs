import {
  BsDroplet,
  BsGeoAlt,
  BsClock,
  BsCalendarCheck,
  BsTelephone,
  BsHeart,
  BsInfoCircle,
} from "react-icons/bs";
import dynamicImport from "next/dynamic";
import donationsService from "@/features/Solicitations/services/donations.service";
import { Button } from "@/components/Button";
import { MapLoading } from "@/components/MapLoading";
import styles from "./styles.module.scss";

const ViewSolicitationMapSection = dynamicImport(
  () => import("@/features/ViewSolicitations/components/Map"),
  {
    ssr: false,
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

  const solicitation = await donationsService.getDonation(id);

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
      value: "25/02 a 28/02/2025",
    },
    {
      icon: <BsTelephone />,
      title: "Contato",
      value: "(15) 99999-9999",
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
              <p className={styles.heroDescription}>
                Olá, me chamo {solicitation.name}, tenho leucemia e dependo de
                transfusões de <strong>sangue {solicitation.bloodType}</strong>{" "}
                para continuar meu tratamento. Os estoques estão baixos, e sua
                doação pode fazer toda a diferença para mim e muitos outros.
                Doar é rápido, seguro e salva vidas. Procure um hemocentro e
                ajude a dar esperança a quem mais precisa. Obrigado! ❤️
              </p>
              <div className={styles.heroActions}>
                <Button variant="primary" iconBefore={<BsHeart />}>
                  Quero Ajudar
                </Button>
                <Button variant="outline" iconBefore={<BsTelephone />}>
                  Entrar em Contato
                </Button>
              </div>
            </div>
            <div className={styles.heroImage}>
              <img
                src={solicitation.image || "/assets/images/placeholder.jpg"}
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
                  Av. Comendador Pereira Inácio, 564
                </h3>
                <p className={styles.locationDistrict}>
                  Jardim Vergueiro, Sorocaba/SP
                </p>

                <div className={styles.divider} />

                <div className={styles.scheduleInfo}>
                  <BsClock className={styles.scheduleIcon} />
                  <div>
                    <p className={styles.scheduleTitle}>
                      Horário de Funcionamento
                    </p>
                    <p className={styles.scheduleTime}>
                      Segunda a Sexta, das 8h às 17h
                    </p>
                  </div>
                </div>

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
                      <strong>25/02/2025 a 28/02/2025</strong>
                    </li>
                  </ul>
                </div>

                <Button variant="secondary" iconAfter={<BsGeoAlt />} fullWidth>
                  Ver Rotas no Maps
                </Button>
              </div>
            </div>

            <div className={styles.mapContainer}>
              <ViewSolicitationMapSection
                marker={{
                  location: solicitation.location,
                  tooltip: solicitation.name,
                }}
                center={solicitation.location}
              />
            </div>
          </div>
        </section>

        <section className={styles.contactCard}>
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
        </section>
      </div>
    </main>
  );
}
