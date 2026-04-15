"use server";

import { revalidatePath } from "next/cache";
import { getAuthToken } from "@/utils/auth";
import { getServerUrl } from "@/config/microservices";
import {
  ICampaign,
  ICampaignLocation,
  CampaignStatus,
} from "@/features/Campaign/interfaces/Campaign.interface";

const CAMPAIGN_API = getServerUrl("campaign", "campaigns");
const CDN_API = getServerUrl("cdn", "api/v1/images");

async function serverAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface ICreateCampaignInput {
  title: string;
  description: string;
  bannerImage?: string;
  startDate: string;
  endDate: string;
  bloodType?: string;
  location: ICampaignLocation;
  organizerId: string;
  organizerName: string;
  organizerUsername?: string;
  targetDonations?: number;
}

export type IUpdateCampaignInput = Partial<
  Omit<ICreateCampaignInput, "organizerId" | "organizerName" | "organizerUsername">
> & {
  status?: CampaignStatus;
};

export async function createCampaignAction(
  data: ICreateCampaignInput
): Promise<ICampaign> {
  const headers = await serverAuthHeaders();
  const res = await fetch(CAMPAIGN_API, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro ${res.status}: ${res.statusText}`);
  }

  const created = (await res.json()) as ICampaign;
  revalidatePath("/");
  revalidatePath("/campanhas");
  revalidatePath("/hemocentros");
  return created;
}

export async function updateCampaignAction(
  id: string,
  data: IUpdateCampaignInput
): Promise<ICampaign> {
  const headers = await serverAuthHeaders();
  const res = await fetch(`${CAMPAIGN_API}/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro ${res.status}: ${res.statusText}`);
  }

  const updated = (await res.json()) as ICampaign;
  revalidatePath("/");
  revalidatePath("/campanhas");
  revalidatePath("/hemocentros");
  revalidatePath(`/campanha/${id}`);
  return updated;
}

export async function uploadCampaignBannerAction(
  imageBase64: string,
  fileName: string,
  mimeType: string
): Promise<{ url: string; publicId: string }> {
  const token = await getAuthToken();
  if (!token) throw new Error("Não autenticado");

  const buffer = Buffer.from(imageBase64, "base64");
  const formData = new FormData();
  formData.append(
    "image",
    new Blob([buffer], { type: mimeType }),
    fileName
  );

  const res = await fetch(`${CDN_API}?folder=campaigns`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro CDN ${res.status}`);
  }

  return res.json();
}
