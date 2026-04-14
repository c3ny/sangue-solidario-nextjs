import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { CreateCampaignForm } from "./_components/CreateCampaignForm";

export const metadata: Metadata = {
  title: "Criar Campanha - Sangue Solidário",
  description: "Crie uma nova campanha de doação de sangue",
};

export default async function CriarCampanhaPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/campanhas/criar");
  }

  if (user.personType !== "COMPANY") {
    redirect("/hemocentros");
  }

  return (
    <CreateCampaignForm
      organizerId={user.id}
      organizerName={user.name}
    />
  );
}
