import { Metadata } from "next";
import { CampaignsList } from "./_components/CampaignsList";
import { isFeatureEnabled } from "@/service/featureFlags/featureFlags.config";
import { listCampaigns } from "@/features/Campaign/services/campaign.service";
import { listActiveCompanies } from "@/features/Institution/services/company.service";
import { CampaignStatus } from "@/features/Campaign/interfaces/Campaign.interface";

export const metadata: Metadata = {
  title: "Campanhas - Sangue Solidário",
  description:
    "Encontre campanhas de doação de sangue ativas e participe salvando vidas",
};

const PAGE_LIMIT = 50;
const LOGO_LOOKUP_LIMIT = 100;

export default async function CampanhasPage() {
  if (!isFeatureEnabled("campaigns")) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <h2>Em breve</h2>
        <p>A funcionalidade de campanhas está em desenvolvimento.</p>
      </div>
    );
  }

  const [campaignsRes, hemocentrosLookup] = await Promise.all([
    listCampaigns({ limit: PAGE_LIMIT, status: CampaignStatus.ACTIVE }),
    listActiveCompanies({ limit: LOGO_LOOKUP_LIMIT }),
  ]);

  const organizerLogos: Record<string, string> = {};
  for (const inst of hemocentrosLookup.data) {
    if (inst.logoImage) {
      organizerLogos[inst.id] = inst.logoImage;
      if (inst.slug) organizerLogos[inst.slug] = inst.logoImage;
    }
  }

  return (
    <CampaignsList
      initialCampaigns={campaignsRes.data}
      organizerLogos={organizerLogos}
    />
  );
}
