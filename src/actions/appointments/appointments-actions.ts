"use server";

import { getServerUrl } from "@/config/microservices";
import { getAuthToken, getCurrentUser } from "@/utils/auth";
import {
  IAppointment,
  AppointmentStatus,
} from "@/features/Institution/interfaces/Appointment.interface";
import { logger } from "@/utils/logger";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Translates backend error codes (from appointments-service) into user-friendly
 * Portuguese messages. Falls back to the raw backend message when the code is
 * unknown.
 */
const APPOINTMENT_ERROR_MESSAGES: Record<string, string> = {
  CAMPAIGN_NOT_ACTIVE:
    "Esta campanha não está mais aceitando agendamentos.",
  SCHEDULE_OUTSIDE_CAMPAIGN_WINDOW:
    "A data escolhida está fora do período da campanha.",
  SCHEDULE_PAST_DATE:
    "Não é possível agendar para uma data que já passou.",
  SLOT_FULL:
    "Este horário já está cheio. Escolha outro horário disponível.",
  DONOR_ALREADY_BOOKED:
    "Você já tem um agendamento ativo. Cancele-o no seu perfil antes de criar um novo.",
  INVALID_TRANSITION:
    "Não é possível alterar o status deste agendamento.",
  APPOINTMENT_NOT_FOUND:
    "Agendamento não encontrado.",
  FORBIDDEN:
    "Você não tem permissão para acessar este recurso.",
  CAMPAIGN_UPSTREAM_ERROR:
    "Não foi possível validar a campanha. Tente novamente em instantes.",
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      message?: string | { code?: string; message?: string };
    };
    const code =
      typeof body.message === "object" && body.message
        ? body.message.code
        : undefined;
    const translated = code ? APPOINTMENT_ERROR_MESSAGES[code] : undefined;
    const fallback =
      typeof body.message === "string"
        ? body.message
        : (body.message?.message ?? `Erro ${res.status}: ${res.statusText}`);
    throw new Error(translated ?? fallback);
  }
  return res.json() as Promise<T>;
}

interface AppointmentResponseDto {
  id: string;
  donorUserId: string;
  companyId: string;
  campaignId: string;
  scheduledDate: string;
  scheduledTime: string;
  bloodType: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

function mapToIAppointment(dto: AppointmentResponseDto): IAppointment {
  return {
    id: dto.id,
    institutionId: dto.companyId,
    companyId: dto.companyId,
    campaignId: dto.campaignId,
    donorUserId: dto.donorUserId,
    donorName: dto.donorName,
    donorEmail: dto.donorEmail,
    donorPhone: dto.donorPhone,
    bloodType: dto.bloodType,
    scheduledDate: dto.scheduledDate,
    scheduledTime: dto.scheduledTime,
    notes: dto.notes,
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    cancelledAt: dto.cancelledAt,
    confirmedAt: dto.confirmedAt,
    completedAt: dto.completedAt,
  };
}

function apiBase(): string {
  const url = getServerUrl("appointments");
  if (!url || url === "http://") {
    throw new Error(
      "APPOINTMENTS_SERVICE_URL is not configured. Set it in .env.local.",
    );
  }
  return url.replace(/\/+$/, "");
}

// ---------------------------------------------------------------------------
// Donor profile helper (prefill do form de agendamento)
// ---------------------------------------------------------------------------

export interface DonorPrefillData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  bloodType: string;
  birthDate: string;
}

interface UsersServiceDonorResponse {
  cpf?: string;
  bloodType?: string;
  birthDate?: string;
  gender?: string;
  lastDonationDate?: string | null;
}

export async function getDonorPrefillAction(): Promise<DonorPrefillData | null> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) return null;

    const token = await getAuthToken();
    if (!token) return null;

    const usersBase = getServerUrl("users").replace(/\/+$/, "");
    let donorData: UsersServiceDonorResponse = {};

    try {
      const res = await fetch(`${usersBase}/users/${user.id}/donor`, {
        headers: await authHeaders(),
        cache: "no-store",
      });
      if (res.ok) {
        donorData = (await res.json()) as UsersServiceDonorResponse;
      }
    } catch (err) {
      logger.error("Failed to fetch donor profile:", err);
    }

    return {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      cpf: donorData.cpf ?? "",
      bloodType: donorData.bloodType ?? "",
      birthDate: donorData.birthDate ?? "",
    };
  } catch (err) {
    logger.error("getDonorPrefillAction error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getAppointmentsByCompanyAction(
  companyId: string,
  query: { status?: AppointmentStatus; from?: string; to?: string; page?: number; limit?: number } = {},
): Promise<IAppointment[]> {
  try {
    const params = new URLSearchParams();
    if (query.status) params.set("status", query.status);
    if (query.from) params.set("from", query.from);
    if (query.to) params.set("to", query.to);
    params.set("page", String(query.page ?? 1));
    params.set("limit", String(query.limit ?? 50));

    const res = await fetch(
      `${apiBase()}/appointments/institution/${companyId}?${params.toString()}`,
      { headers: await authHeaders(), cache: "no-store" },
    );
    const page = await handleResponse<PaginatedResponse<AppointmentResponseDto>>(res);
    return page.data.map(mapToIAppointment);
  } catch (err) {
    logger.error("getAppointmentsByCompanyAction error:", err);
    return [];
  }
}

export async function getMyAppointmentsAction(): Promise<IAppointment[]> {
  try {
    const user = await getCurrentUser();
    if (!user?.id) return [];

    const res = await fetch(
      `${apiBase()}/appointments/donor/${user.id}?page=1&limit=50`,
      { headers: await authHeaders(), cache: "no-store" },
    );
    const page = await handleResponse<PaginatedResponse<AppointmentResponseDto>>(res);
    return page.data.map(mapToIAppointment);
  } catch (err) {
    logger.error("getMyAppointmentsAction error:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export interface CreateAppointmentInput {
  campaignId: string;
  scheduledDate: string;
  scheduledTime: string;
  bloodType: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  notes?: string;
}

export type AppointmentActionError = {
  /** Backend error code (CAMPAIGN_NOT_ACTIVE, DONOR_ALREADY_BOOKED, etc.) — undefined for unknown failures. */
  code?: string;
  /** Human-readable message in PT-BR (already translated for known codes). */
  message: string;
};

export type AppointmentMutationResult =
  | { ok: true; appointment: IAppointment }
  | { ok: false; error: AppointmentActionError };

/**
 * @deprecated Use AppointmentMutationResult. Kept as alias for callers that
 * import the legacy name.
 */
export type CreateAppointmentResult = AppointmentMutationResult;

/**
 * Wraps a mutation HTTP call in the Result pattern. Returning a discriminated
 * union instead of throwing keeps the Next.js dev overlay quiet for expected
 * business-rule rejections (DONOR_ALREADY_BOOKED, INVALID_TRANSITION, etc.).
 * Network failures still surface as { ok: false } with a generic message.
 */
async function runMutation(
  call: () => Promise<Response>,
  contextLabel: string,
): Promise<AppointmentMutationResult> {
  try {
    const res = await call();

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as {
        message?: string | { code?: string; message?: string };
      };
      const code =
        typeof body.message === "object" && body.message
          ? body.message.code
          : undefined;
      const translated = code ? APPOINTMENT_ERROR_MESSAGES[code] : undefined;
      const fallback =
        typeof body.message === "string"
          ? body.message
          : (body.message?.message ?? `Erro ${res.status}: ${res.statusText}`);
      return { ok: false, error: { code, message: translated ?? fallback } };
    }

    const dto = (await res.json()) as AppointmentResponseDto;
    return { ok: true, appointment: mapToIAppointment(dto) };
  } catch (err) {
    logger.error(`${contextLabel} network error:`, err);
    return {
      ok: false,
      error: {
        message:
          err instanceof Error
            ? err.message
            : "Erro de rede. Tente novamente em instantes.",
      },
    };
  }
}

export async function createAppointmentAction(
  input: CreateAppointmentInput,
): Promise<AppointmentMutationResult> {
  return runMutation(
    async () =>
      fetch(`${apiBase()}/appointments`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify(input),
      }),
    "createAppointmentAction",
  );
}

export async function cancelAppointmentAction(
  id: string,
  reason?: string,
): Promise<AppointmentMutationResult> {
  return runMutation(
    async () =>
      fetch(`${apiBase()}/appointments/${id}/cancel`, {
        method: "PUT",
        headers: await authHeaders(),
        body: JSON.stringify(reason ? { reason } : {}),
      }),
    "cancelAppointmentAction",
  );
}

export async function confirmAppointmentAction(
  id: string,
): Promise<AppointmentMutationResult> {
  return runMutation(
    async () =>
      fetch(`${apiBase()}/appointments/${id}/confirm`, {
        method: "PATCH",
        headers: await authHeaders(),
      }),
    "confirmAppointmentAction",
  );
}

export async function completeAppointmentAction(
  id: string,
): Promise<AppointmentMutationResult> {
  return runMutation(
    async () =>
      fetch(`${apiBase()}/appointments/${id}/complete`, {
        method: "PATCH",
        headers: await authHeaders(),
      }),
    "completeAppointmentAction",
  );
}

export async function noShowAppointmentAction(
  id: string,
): Promise<AppointmentMutationResult> {
  return runMutation(
    async () =>
      fetch(`${apiBase()}/appointments/${id}/no-show`, {
        method: "PATCH",
        headers: await authHeaders(),
      }),
    "noShowAppointmentAction",
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface CompanyAppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

export async function getCompanyAppointmentStatsAction(
  companyId: string,
): Promise<CompanyAppointmentStats> {
  try {
    const res = await fetch(`${apiBase()}/institutions/${companyId}/stats`, {
      headers: await authHeaders(),
      cache: "no-store",
    });
    return await handleResponse<CompanyAppointmentStats>(res);
  } catch (err) {
    logger.error("getCompanyAppointmentStatsAction error:", err);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
    };
  }
}
