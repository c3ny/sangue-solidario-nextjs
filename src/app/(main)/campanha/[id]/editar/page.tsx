import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { getCampaignById } from "@/features/Campaign/services/campaign.service";
import { EditCampaignForm } from "./_components/EditCampaignForm";

export const metadata: Metadata = {
  title: "Editar Campanha - Sangue Solidário",
  description: "Edite os detalhes da sua campanha de doação",
};

interface EditCampaignPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarCampanhaPage({ params }: EditCampaignPageProps) {
  const { id } = await params;

  const [user, campaign] = await Promise.all([
    getCurrentUser(),
    getCampaignById(id),
  ]);

  if (!user) {
    redirect(`/login?redirect=/campanha/${id}/editar`);
  }

  if (!campaign) {
    notFound();
  }

  if (campaign.organizerId !== user.id) {
    redirect("/hemocentros");
  }

  return <EditCampaignForm campaign={campaign} />;
}
