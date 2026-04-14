import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, getAuthToken } from "@/utils/auth";
import { getMyCompany } from "@/features/Institution/services/company.service";
import { InstitutionProfileForm } from "@/features/Institution/components/InstitutionProfileForm";
import {
  updateMyCompanyAction,
  uploadBannerAction,
  uploadLogoAction,
} from "./actions";
import styles from "./styles.module.scss";

export const metadata = {
  title: "Editar Perfil Público — Sangue Solidário",
};

export default async function EditProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/hemocentros/perfil");
  }

  if (user.personType !== "COMPANY") {
    redirect("/");
  }

  const token = await getAuthToken();
  const company = token ? await getMyCompany(token) : null;

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Editar Perfil Público</h1>
            <p className={styles.subtitle}>
              Estas informações aparecem na página pública do seu hemocentro
            </p>
          </div>
          {company && (
            <Link
              href={`/hemocentro/${company.username}`}
              className={styles.previewLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver meu perfil público ↗
            </Link>
          )}
        </div>

        {company ? (
          <InstitutionProfileForm
            institution={company}
            updateAction={updateMyCompanyAction}
            uploadBannerAction={uploadBannerAction}
            uploadLogoAction={uploadLogoAction}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>Não foi possível carregar os dados da empresa. Tente novamente.</p>
            <Link href="/hemocentros" className={styles.backLink}>
              Voltar ao painel
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
