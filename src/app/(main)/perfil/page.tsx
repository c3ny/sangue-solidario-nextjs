import { getCurrentUser } from "@/utils/auth";
import { logout } from "@/app/(auth)/logout-action";
import { BsPerson, BsEnvelope, BsBoxArrowRight } from "react-icons/bs";
import { ProfileClient } from "./ProfileClient";
import { ServerAuthWrapper } from "@/components/ServerAuthWrapper";
import styles from "./styles.module.scss";
import { APIService } from "@/service/api/api";
import { LoginService } from "@/features/Login/service/login.service";
import { maskEmail } from "@/utils/emailMask";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meu Perfil - Sangue Solidário",
  description: "Visualize e gerencie suas informações de perfil",
};

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

  const user = await new LoginService().getUserById(currentUser.id);

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
            <h2 className={styles.sectionTitle}>Informações Pessoais</h2>
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

              {user.bloodType && (
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <span className={styles.bloodIcon}>🩸</span>
                  </div>
                  <div className={styles.infoDetails}>
                    <span className={styles.infoLabel}>Tipo Sanguíneo</span>
                    <span className={styles.infoValue}>{user.bloodType}</span>
                  </div>
                </div>
              )}
            </div>
          </section>

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
