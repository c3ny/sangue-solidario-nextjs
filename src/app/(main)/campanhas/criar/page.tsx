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

  // organizerId must be the entity company.id (matches JWT.companyId issued by
  // users-service on login). Falling back to user.id keeps legacy tokens working
  // but new sessions should always carry companyId after re-login.
  const organizerId =
    (user as { companyId?: string }).companyId ?? user.id;

  return (
    <CreateCampaignForm
      organizerId={organizerId}
      organizerName={user.name}
    />
  );
}
