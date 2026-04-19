import { APIService, isAPISuccess } from "@/service/api/api";
import { getAuthToken } from "@/utils/auth";
import { Solicitation } from "../interfaces/Solicitations.interface";
import { PaginatedResult } from "@/types/pagination.types";
import { logger } from "@/utils/logger";

export interface GetDonationsParams {
  page?: number;
  limit?: number;
}

class DonationsService extends APIService {
  async getDonations(
    params: GetDonationsParams = {}
  ): Promise<PaginatedResult<Solicitation>> {
    const { page = 1, limit = 10 } = params;
    const token = await getAuthToken();
    const url = this.getDonationServiceUrl(
      `donations?page=${page}&limit=${limit}`
    );

    // Sem cache: listagem publica precisa refletir encerramentos (via /perfil)
    // e expiracoes (autoCompleteExpired) sem atraso do data cache do Next.
    const response = await this.get<PaginatedResult<Solicitation>>(url, {
      ...(token ? { token } : {}),
      cache: "no-store",
    });

    if (isAPISuccess(response)) {
      return response.data;
    }

    logger.error("Failed to fetch donations:", response.message);
    return {
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }

  async getDonationsCount(): Promise<{ count: number }> {
    const token = await getAuthToken();
    const url = this.getDonationServiceUrl("donations/count");
    const response = await this.get<{ count: number }>(url, token ? { token } : undefined);

    if (isAPISuccess(response)) {
      return response.data;
    }

    logger.error("Failed to fetch donations count:", response.message);
    return { count: 0 };
  }

  async getDonation(id: string): Promise<Solicitation | null> {
    const token = await getAuthToken();
    const url = this.getDonationServiceUrl(`donations/${id}`);
    const response = await this.get<Solicitation>(url, token ? { token } : undefined);

    if (isAPISuccess(response)) {
      return response.data;
    }

    logger.error(`Failed to fetch donation ${id}:`, response.message);
    return null;
  }

  async getMyDonations(
    userId: string,
    params: GetDonationsParams = {}
  ): Promise<PaginatedResult<Solicitation>> {
    const { page = 1, limit = 50 } = params;
    const token = await getAuthToken();
    const url = this.getDonationServiceUrl(
      `donations/user/${userId}?page=${page}&limit=${limit}`
    );

    // Sem cache: usuario espera ver suas solicitacoes recem-encerradas
    // imediatamente apos closeDonation (que chama revalidatePath('/perfil')).
    const response = await this.get<PaginatedResult<Solicitation>>(url, {
      ...(token ? { token } : {}),
      cache: "no-store",
    });

    if (isAPISuccess(response)) {
      return response.data;
    }

    logger.error("Failed to fetch user's donations:", response.message);
    return {
      data: [],
      metadata: { page: 1, limit, total: 0, totalPages: 0 },
    };
  }
}

const donationsService = new DonationsService();

export default donationsService;
