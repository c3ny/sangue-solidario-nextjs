import { Metadata } from "next";
import CampaignPage from "./_components/CampaignPage";

export const metadata: Metadata = {
  title: "Campanha de Doação - Sangue Solidário",
  description: "Agende sua doação de sangue e ajude a salvar vidas",
};

export default function Campaign({ params }: { params: { id: string } }) {
  return <CampaignPage campaignId={params.id} />;
}
