import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { listActiveCompanies } from "@/features/Institution/services/company.service";
import { HemocentroCard } from "./HemocentroCard";
import { CarouselWrapper } from "./CarouselWrapper";
import styles from "./styles.module.scss";

export async function HemocentrosSection() {
  const { data: institutions } = await listActiveCompanies({ limit: 12 });

  if (institutions.length === 0) {
    return null;
  }

  const cards = institutions.map((inst) => (
    <HemocentroCard key={inst.id} institution={inst} />
  ));

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Hemocentros</h2>
        <Link href="/encontrar-hemocentros" className={styles.viewAll}>
          Ver todos <BsArrowRight className={styles.viewAllIcon} />
        </Link>
      </div>

      <CarouselWrapper items={cards} />
    </section>
  );
}
