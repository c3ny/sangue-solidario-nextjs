import { Metadata } from "next";
import { CampaignsList } from "./_components/CampaignsList";
import { isFeatureEnabled } from "@/service/featureFlags/featureFlags.config";

export const metadata: Metadata = {
  title: "Campanhas - Sangue Solidário",
  description:
    "Encontre campanhas de doação de sangue ativas e participe salvando vidas",
};

export default async function CampanhasPage() {
  if (!isFeatureEnabled("campaigns")) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h2>Em breve</h2>
        <p>A funcionalidade de campanhas está em desenvolvimento.</p>
      </div>
    );
  }

  return <CampaignsList initialCampaigns={[]} />;
}
