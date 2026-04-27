import { Metadata } from "next";
import { notFound } from "next/navigation";
import CampaignPage from "./_components/CampaignPage";
import { getCampaignById } from "@/features/Campaign/services/campaign.service";
import { listActiveCompanies } from "@/features/Institution/services/company.service";
import { getCurrentUser } from "@/utils/auth";

export const metadata: Metadata = {
  title: "Campanha de Doação - Sangue Solidário",
  description: "Agende sua doação de sangue e ajude a salvar vidas",
};

export default async function Campaign({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();

  // Look up organizer logo
  const { data: institutions } = await listActiveCompanies({ limit: 100 });
  const organizerLogo =
    institutions.find(
      (inst) =>
        inst.id === campaign.organizerId ||
        (campaign.organizerUsername && inst.slug === campaign.organizerUsername)
    )?.logoImage ?? undefined;

  // Pass the viewer's auth state so the scheduling form can guide non-donors
  // (logged-out, COMPANY, or DONOR with incomplete profile) to the right path
  // instead of letting the appointments-service reject the submission with 403.
  const user = await getCurrentUser();
  const viewer = user
    ? {
        personType: user.personType ?? "",
        isProfileComplete: user.isProfileComplete ?? false,
      }
    : null;

  return (
    <CampaignPage
      campaign={campaign}
      organizerLogo={organizerLogo}
      viewer={viewer}
    />
  );
}
