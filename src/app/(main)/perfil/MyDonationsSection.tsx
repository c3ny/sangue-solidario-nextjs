import donationsService from "@/features/Solicitations/services/donations.service";
import { DonationDashboardCard } from "./DonationDashboardCard";
import styles from "./styles.module.scss";

interface MyDonationsSectionProps {
  userId: string;
}

export async function MyDonationsSection({ userId }: MyDonationsSectionProps) {
  const result = await donationsService.getMyDonations(userId, { limit: 50 });
  const donations = result.data;

  return (
    <section className={styles.infoSection} style={{ marginTop: "1.5rem" }}>
      <h2 className={styles.sectionTitle}>
        Minhas Solicitações{" "}
        <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: 400 }}>
          ({result.metadata.total})
        </span>
      </h2>

      {donations.length === 0 ? (
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          Você ainda não criou nenhuma solicitação.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          {donations.map((donation) => (
            <DonationDashboardCard
              key={String(donation.id)}
              donation={donation}
            />
          ))}
        </div>
      )}
    </section>
  );
}
