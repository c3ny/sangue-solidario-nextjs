import { listActiveCampaigns } from "@/features/Campaign/services/campaign.service";
import { listActiveCompanies } from "@/features/Institution/services/company.service";
import { isFeatureEnabled } from "@/service/featureFlags/featureFlags.config";
import { BloodDonationClient, BloodDonationItem } from "./BloodDonationClient";

type CampaignItem = Extract<BloodDonationItem, { type: "campaign" }>;
type HemocentroItem = Extract<BloodDonationItem, { type: "hemocentro" }>;

const HOME_LIMIT = 5;
const LOGO_LOOKUP_LIMIT = 100;

export async function BloodDonationSection() {
  const campaignsEnabled = isFeatureEnabled("campaigns");

  const [campaignsRes, hemocentrosDisplay, hemocentrosLookup] = await Promise.all([
    campaignsEnabled ? listActiveCampaigns(HOME_LIMIT) : Promise.resolve([]),
    listActiveCompanies({ limit: HOME_LIMIT }),
    listActiveCompanies({ limit: LOGO_LOOKUP_LIMIT }),
  ]);

  const logoById = new Map<string, string>();
  const logoBySlug = new Map<string, string>();
  for (const inst of hemocentrosLookup.data) {
    if (inst.logoImage) {
      logoById.set(inst.id, inst.logoImage);
      if (inst.slug) logoBySlug.set(inst.slug, inst.logoImage);
    }
  }

  const campaignItems: CampaignItem[] = campaignsRes.map((c) => ({
    type: "campaign",
    id: c.id,
    href: `/campanha/${c.id}`,
    name: c.title,
    creator: c.organizerName,
    organizerLogo:
      logoById.get(c.organizerId) ??
      (c.organizerUsername ? logoBySlug.get(c.organizerUsername) : undefined),
    startDate: c.startDate,
    endDate: c.endDate,
    currentDonations: c.currentDonations,
    goalDonations: c.targetDonations ?? 0,
    isActive: c.status === "ACTIVE",
  }));

  const hemocentroItems: HemocentroItem[] = hemocentrosDisplay.data.map((h) => ({
    type: "hemocentro",
    id: h.id,
    href: `/hemocentro/${h.slug}`,
    name: h.institutionName,
    logo: h.logoImage ?? undefined,
    city: h.city ?? "",
    state: h.uf ?? "",
  }));

  if (campaignItems.length === 0 && hemocentroItems.length === 0) {
    return null;
  }

  return (
    <BloodDonationClient
      campaigns={campaignItems}
      hemocentros={hemocentroItems}
    />
  );
}
