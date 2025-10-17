import { getCurrentUser } from "@/utils/auth";
import { logout } from "@/app/(auth)/logout-action";
import { redirect } from "next/navigation";
import { BsPerson, BsEnvelope, BsBoxArrowRight } from "react-icons/bs";
import { ProfileClient } from "./ProfileClient";
import styles from "./styles.module.scss";
import { APIService } from "@/service/api/api";
import { LoginService } from "@/features/Login/service/login.service";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meu Perfil - Sangue Solidário",
  description: "Visualize e gerencie suas informações de perfil",
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  const user = await new LoginService().getUserById(currentUser?.id || "");

  const apiService = new APIService();
  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  return (
    <main className={styles.container}>
      <div className={styles.profileWrapper}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <ProfileClient
              user={{
                ...user,
                avatarPath: apiService.getUsersFileServiceUrl(
                  user.avatarPath || ""
                ),
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
                  <span className={styles.infoValue}>
                    {user.email || "Não informado"}
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
              <a href="/solicitacoes" className={styles.actionButton}>
                <span>Ver Solicitações</span>
              </a>
              <a href="/criar-solicitacao" className={styles.actionButton}>
                <span>Criar Solicitação</span>
              </a>
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
