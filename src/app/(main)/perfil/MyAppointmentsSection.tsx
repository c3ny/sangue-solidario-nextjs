import { getMyAppointmentsAction } from "@/actions/appointments/appointments-actions";
import { AppointmentCard } from "./AppointmentCard";
import styles from "./styles.module.scss";

export async function MyAppointmentsSection() {
  const appointments = await getMyAppointmentsAction();

  // Most recent first (by scheduled_date desc, then time desc).
  const sorted = [...appointments].sort((a, b) => {
    const dateCmp = b.scheduledDate.localeCompare(a.scheduledDate);
    if (dateCmp !== 0) return dateCmp;
    return b.scheduledTime.localeCompare(a.scheduledTime);
  });

  return (
    <section className={styles.infoSection} style={{ marginTop: "1.5rem" }}>
      <h2 className={styles.sectionTitle}>
        Meus Agendamentos{" "}
        <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: 400 }}>
          ({sorted.length})
        </span>
      </h2>

      {sorted.length === 0 ? (
        <p style={{ color: "#666", marginTop: "0.5rem" }}>
          Você ainda não agendou nenhuma doação.
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
          {sorted.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </section>
  );
}
