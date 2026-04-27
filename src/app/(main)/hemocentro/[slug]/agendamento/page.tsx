import { Metadata } from "next";
import { notFound } from "next/navigation";
import AppointmentPage from "./_components/AppointmentPage";
import {
  IInstitution,
} from "@/features/Institution/interfaces/Institution.interface";
import { ICampaign } from "@/features/Campaign/interfaces/Campaign.interface";
import { getDonorPrefillAction } from "@/actions/appointments/appointments-actions";
import { logger } from "@/utils/logger";

export const metadata: Metadata = {
  title: "Agendamento de Doação - Sangue Solidário",
  description: "Agende sua doação de sangue",
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function loadInstitution(slug: string): Promise<IInstitution | null> {
  try {
    const { getCompanyBySlug } = await import(
      "@/features/Institution/services/company.service"
    );
    return await getCompanyBySlug(slug);
  } catch (error) {
    logger.error("Error fetching institution for agendamento:", error);
    return null;
  }
}

async function loadActiveCampaigns(
  institutionId: string,
): Promise<ICampaign[]> {
  try {
    const { getCampaignsByInstitution } = await import(
      "@/features/Campaign/services/campaign.service"
    );
    const campaigns = await getCampaignsByInstitution(institutionId);
    return campaigns.filter((c) => c.status === "ACTIVE");
  } catch (error) {
    logger.error("Error fetching active campaigns for agendamento:", error);
    return [];
  }
}

export default async function Appointment({ params }: PageProps) {
  const { slug } = await params;

  const institution = await loadInstitution(slug);
  if (!institution) {
    notFound();
  }

  const [activeCampaigns, donorPrefill] = await Promise.all([
    loadActiveCampaigns(institution.id),
    getDonorPrefillAction(),
  ]);

  return (
    <AppointmentPage
      slug={slug}
      institution={institution}
      activeCampaigns={activeCampaigns}
      donorPrefill={donorPrefill}
    />
  );
}
