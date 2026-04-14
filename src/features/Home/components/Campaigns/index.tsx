import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { listActiveCampaigns } from "@/features/Campaign/services/campaign.service";
import { CampaignCard } from "./CampaignCard";
import { CarouselWrapper } from "./CarouselWrapper";
import styles from "./styles.module.scss";

export async function CampaignsSection() {
  const campaigns = await listActiveCampaigns();

  if (campaigns.length === 0) {
    return null;
  }

  const cards = campaigns.map((campaign) => (
    <CampaignCard key={campaign.id} campaign={campaign} />
  ));

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Campanhas Ativas</h2>
        <Link href="/campanhas" className={styles.viewAll}>
          Ver todas <BsArrowRight className={styles.viewAllIcon} />
        </Link>
      </div>

      <CarouselWrapper items={cards} />
    </section>
  );
}
