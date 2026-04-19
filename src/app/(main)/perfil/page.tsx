import { getCurrentUser } from "@/utils/auth";
import { logout } from "@/app/(auth)/logout-action";
import {
  BsPerson,
  BsEnvelope,
  BsBoxArrowRight,
  BsTelephone,
  BsGeoAlt,
  BsCardText,
  BsCalendarCheck,
  BsExclamationTriangle,
} from "react-icons/bs";
import { ProfileClient } from "./ProfileClient";
import { EditProfileTrigger } from "./EditProfileTrigger";
import { MyDonationsSection } from "./MyDonationsSection";
import { ServerAuthWrapper } from "@/components/ServerAuthWrapper";
import styles from "./styles.module.scss";
import { APIService } from "@/service/api/api";
import { LoginService } from "@/features/Login/service/login.service";
import { maskEmail } from "@/utils/emailMask";
import { maskPhone } from "@/utils/masks";
import { formatBloodType } from "@/utils/bloodType";
import {
  formatNextDonationDate,
  getNextDonationInfo,
} from "@/utils/donation-interval";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export const metadata = {
  title: "Meu Perfil - Sangue Solidário",
  description: "Visualize e gerencie suas informações de perfil",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function ProfileContent() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    throw new Error("User not found");
  }

  if (currentUser.isProfileComplete === false) {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("user");
    return redirect("/");
  }

  const loginService = new LoginService();
  const user = await loginService.getUserById(currentUser.id);

  if (!user) {
    return redirect("/login?reason=session_expired");
  }

  if (user.isProfileComplete === false) {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    cookieStore.delete("user");
    return redirect("/");
  }

  if (user.personType === "COMPANY") {
    return redirect("/hemocentros");
  }

  const isDonor = user.personType === "DONOR";
  const donor = isDonor
    ? await loginService.getDonorProfile(user.id)
    : null;

  const needsBackfill =
    isDonor && (!donor || donor.gender === null);

  const nextDonation =
    isDonor && donor && donor.gender
      ? getNextDonationInfo(donor.gender, donor.lastDonationDate)
      : null;

  const apiService = new APIService();

  return (
    <main className={styles.container}>
      <div className={styles.profileWrapper}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <ProfileClient
              user={{
                id: user.id,
                name: user.name || "",
                email: user.email || "",
                bloodType: user.bloodType,
                type: user.type,
                personType: user.personType,
                avatarPath: user.avatarPath
                  ? apiService.getUsersFileServiceUrl(user.avatarPath)
                  : "",
                isProfileComplete: user.isProfileComplete,
              }}
            />
            <h1 className={styles.userName}>{user.name}</h1>
          </div>
        </div>

        <div className={styles.profileContent}>
          <section className={styles.infoSection}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
              <EditProfileTrigger
                initialValues={{
                  name: user.name ?? "",
                  phone: user.phone ?? "",
                  city: user.city ?? "",
                  uf: user.uf ?? "",
                  zipcode: user.zipcode ?? "",
                  description: user.description ?? "",
                  gender: donor?.gender ?? null,
                  lastDonationDate: donor?.lastDonationDate ?? null,
                }}
                showDonorFields={isDonor}
              />
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <BsPerson />
                </div>
                <div className={styles.infoDetails}>
                  <span className={styles.infoLabel}>Nome Completo</span>
                  <span className={styles.infoValue}>{user.name}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <BsEnvelope />
                </div>
                <div className={styles.infoDetails}>
                  <span className={styles.infoLabel}>E-mail</span>
                  <span
                    className={`${styles.infoValue} ${
                      user.email ? styles.maskedEmail : ""
                    }`}
                  >
                    {user.email ? maskEmail(user.email) : "Não informado"}
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <BsTelephone />
                </div>
                <div className={styles.infoDetails}>
                  <span className={styles.infoLabel}>Telefone</span>
                  <span className={styles.infoValue}>
                    {user.phone ? maskPhone(user.phone) : "Não informado"}
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <BsGeoAlt />
                </div>
                <div className={styles.infoDetails}>
                  <span className={styles.infoLabel}>Cidade / UF</span>
                  <span className={styles.infoValue}>
                    {user.city || user.uf
                      ? `${user.city ?? ""}${user.city && user.uf ? " / " : ""}${user.uf ?? ""}`
                      : "Não informado"}
                  </span>
                </div>
              </div>

              {user.bloodType && (
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <span className={styles.bloodIcon}>🩸</span>
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>Tipo Sanguíneo</span>
                    <span className={styles.infoValue}>
                      {formatBloodType(user.bloodType)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {user.description && user.description.trim() !== "" && (
              <div style={{ marginTop: "1.25rem" }}>
                <span
                  className={styles.infoLabel}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >
                  <BsCardText />
                  Sobre você
                </span>
                <div className={styles.descriptionBlock}>
                  {user.description}
                </div>
              </div>
            )}
          </section>

          {isDonor && needsBackfill && (
            <section
              style={{
                background: "#fff3cd",
                border: "1px solid #ffeeba",
                borderRadius: 12,
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <BsExclamationTriangle style={{ color: "#856404" }} />
                <div>
                  <strong>Complete seus dados de doador</strong>
                  <div style={{ fontSize: "0.9rem", color: "#5a4a1f" }}>
                    Precisamos do seu sexo biológico e da data da última doação
                    para calcular quando você pode doar novamente.
                  </div>
                </div>
              </div>
              <EditProfileTrigger
                label="Completar dados"
                variant="primary"
                showDonorFields
                initialValues={{
                  name: user.name ?? "",
                  phone: user.phone ?? "",
                  city: user.city ?? "",
                  uf: user.uf ?? "",
                  zipcode: user.zipcode ?? "",
                  description: user.description ?? "",
                  gender: donor?.gender ?? null,
                  lastDonationDate: donor?.lastDonationDate ?? undefined,
                }}
              />
            </section>
          )}

          {nextDonation && (
            <section className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Próxima doação</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <BsCalendarCheck
                  style={{
                    fontSize: "1.5rem",
                    color: nextDonation.eligible ? "#28a745" : "#dc3545",
                  }}
                />
                <div>
                  {nextDonation.eligible ? (
                    <>
                      <strong style={{ color: "#28a745" }}>
                        Você pode doar agora
                      </strong>
                      <div
                        style={{ fontSize: "0.9rem", color: "#6c757d" }}
                      >
                        Intervalo mínimo: {nextDonation.intervalDays} dias (
                        {donor?.gender === "MALE" ? "homem" : "mulher"}).
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>
                        Disponível em{" "}
                        {formatNextDonationDate(nextDonation.eligibleAt!)}
                      </strong>
                      <div
                        style={{ fontSize: "0.9rem", color: "#6c757d" }}
                      >
                        Faltam {nextDonation.daysRemaining} dia
                        {nextDonation.daysRemaining === 1 ? "" : "s"} para o
                        intervalo mínimo de {nextDonation.intervalDays} dias
                        {" "}
                        ({donor?.gender === "MALE" ? "homem" : "mulher"}).
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          <MyDonationsSection userId={user.id} />

          <section className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
            <div className={styles.actionButtons}>
              <Link href="/solicitacoes" className={styles.actionButton}>
                <span>Ver Solicitações</span>
              </Link>
              <Link href="/criar-solicitacao" className={styles.actionButton}>
                <span>Criar Solicitação</span>
              </Link>
              <form action={logout}>
                <button type="submit" className={styles.logoutButton}>
                  <BsBoxArrowRight />
                  <span>Sair</span>
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ServerAuthWrapper>
      <ProfileContent />
    </ServerAuthWrapper>
  );
}
