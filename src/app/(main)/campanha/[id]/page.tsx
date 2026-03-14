import { Metadata } from "next";
import CampaignPage from "./_components/CampaignPage";

export const metadata: Metadata = {
  title: "Campanha de Doação - Sangue Solidário",
  description: "Agende sua doação de sangue e ajude a salvar vidas",
};

export default async function Campaign({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CampaignPage campaignId={id} />;
}
