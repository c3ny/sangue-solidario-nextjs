import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import donationsService from "@/features/Solicitations/services/donations.service";
import SolicitationsComponent from "./_components";
import styles from "./styles.module.scss";

export const dynamic = "force-dynamic";

interface SolicitationsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Solicitations({
  searchParams,
}: SolicitationsPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;

  const [paginatedData] = await Promise.all([
    donationsService.getDonations({
      page: currentPage,
      limit: pageSize,
    }),
  ]);

  if (
    !paginatedData.data.length &&
    !paginatedData.metadata.total &&
    currentPage === 1
  ) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>
          <h2>Não há solicitações no momento</h2>
          <p>Seja o primeiro a criar uma solicitação de doação</p>
          <Link href="/criar-solicitacao" className={styles.createButton}>
            <BsPlus />
            Criar Solicitação
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <section className={styles.section}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Solicitações de Doação</h1>
            <p className={styles.subtitle}>
              Encontre pessoas próximas que precisam de doação de sangue
            </p>
          </div>
          <Link href="/criar-solicitacao" className={styles.createButton}>
            <BsPlus className={styles.buttonIcon} />
            <span>Criar Solicitação</span>
          </Link>
        </div>

        <SolicitationsComponent
          paginatedData={paginatedData}
          donationsCount={paginatedData.metadata.total}
        />
      </section>
    </main>
  );
}
