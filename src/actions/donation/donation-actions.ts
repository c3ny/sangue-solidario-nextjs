"use server";

import { getAuthToken } from "@/utils/auth";
import { getServerUrl } from "@/config/microservices";
import { logger } from "@/utils/logger";

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
  // Aceita extras (name/address vindos do Mapbox) — sanitizados abaixo
  // pra bater com o CreateDonationDto do donation-service (whitelist).
  location: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  userId: string;
  name?: string;
  image?: string;
}) {
  const headers = await serverAuthHeaders();

  const sanitized = {
    status: donationData.status,
    content: donationData.content,
    startDate: donationData.startDate,
    finishDate: donationData.finishDate,
    bloodType: donationData.bloodType,
    quantity: donationData.quantity,
    location: {
      latitude: donationData.location.latitude,
      longitude: donationData.location.longitude,
    },
    userId: donationData.userId,
    name: donationData.name,
    image: donationData.image,
  };

  const res = await fetch(DONATION_API, {
    method: "POST",
    headers,
    body: JSON.stringify(sanitized),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    logger.error("createDonationAction failed", {
      status: res.status,
      statusText: res.statusText,
      body,
      payloadKeys: Object.keys(sanitized),
    });
    throw new Error(
      body.message || `Erro ${res.status}: ${res.statusText}`
    );
  }

  return res.json();
}

/**
 * @deprecated React 19 Flight encoder estoura "Maximum array nesting exceeded"
 * com strings base64 grandes (Server Actions chunkam strings em arrays).
 * Use uploadDonationImageActionFromForm(formData) com File no FormData.
 */
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

/**
 * Upload de imagem via FormData com File real.
 * Server Action recebe FormData (multipart) — não passa pelo Flight encoder
 * que estoura com strings base64 grandes em React 19.
 */
export async function uploadDonationImageActionFromForm(
  formData: FormData
): Promise<{ url: string; publicId: string }> {
  const token = await getAuthToken();
  if (!token) throw new Error("Não autenticado");

  const file = formData.get("image");
  if (!(file instanceof File)) {
    throw new Error("Arquivo de imagem ausente");
  }

  const folder = (formData.get("folder") as string) || "donations";

  const cdnFormData = new FormData();
  cdnFormData.append("image", file, file.name);

  const res = await fetch(`${CDN_API}?folder=${folder}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: cdnFormData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erro CDN ${res.status}`);
  }

  return res.json();
}
