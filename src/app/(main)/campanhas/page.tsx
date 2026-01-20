import { Metadata } from "next";
import { getAllCampaigns } from "@/lib/api";
import { CampaignsList } from "./_components/CampaignsList";

export const metadata: Metadata = {
  title: "Campanhas - Sangue Solidário",
  description:
    "Encontre campanhas de doação de sangue ativas e participe salvando vidas",
};

export default async function CampanhasPage() {
  const campaigns = await getAllCampaigns();

  return <CampaignsList initialCampaigns={campaigns} />;
}
