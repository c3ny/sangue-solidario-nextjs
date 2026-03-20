"use server";

import { getAuthToken } from "@/utils/auth";
import { getServerUrl } from "@/config/microservices";

const DONATION_API = getServerUrl("donation", "donations");
const CDN_API = getServerUrl("cdn", "api/v1/images");

async function serverAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function createDonationAction(donationData: {
  status: string;
  content: string;
  startDate: string;
  finishDate?: string;
  bloodType: string;
  quantity?: number;
  location: { latitude: number; longitude: number };
  userId: string;
  name?: string;
  image?: string;
}) {
  const headers = await serverAuthHeaders();
  const res = await fetch(DONATION_API, {
    method: "POST",
    headers,
    body: JSON.stringify(donationData),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function uploadDonationImageAction(
  imageBase64: string,
  fileName: string,
  mimeType: string,
  folder: string = "donations"
) {
  const token = await getAuthToken();
  if (!token) throw new Error("Não autenticado");

  // Convert base64 to blob on server
  const buffer = Buffer.from(imageBase64, "base64");
  const formData = new FormData();
  formData.append("image", new Blob([buffer], { type: mimeType }), fileName);

  const res = await fetch(`${CDN_API}?folder=${folder}`, {
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
