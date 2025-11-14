import { getClientUrl } from "@/config/microservices";
import { getAuthTokenClient } from "@/utils/auth.client";

const API_BASE_URL = `${getClientUrl("bloodStock", "api")}`;
const USERS_API_BASE_URL = `${getClientUrl("users", "")}`;

export interface Bloodstock {
  id: string;
  blood_type: string;
  quantity: number;
  updateDate: string;
}

export interface CompanyDTO {
  id: string;
  name: string;
  institutionName: string;
}

export interface Company {
  id: string;
  cnpj: string;
  institutionName: string;
  cnes: string;
  fkUserId: string;
}

export interface BloodstockMovementRequestDTO {
  bloodstockId: string;
  quantity: number;
}

export interface BloodstockMovement {
  id: string;
  bloodstock: {
    id: string;
    blood_type: string;
    quantity: number;
  };
  movement: number;
  quantityBefore: number;
  quantityAfter: number;
  actionBy: string;
  actionDate: string;
  updateDate: string;
  notes?: string;
}

export async function getCompanyByUserId(userId: string): Promise<Company> {
  const authToken = getAuthTokenClient();

  const response = await fetch(
    `${USERS_API_BASE_URL}/users/${userId}/company`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Empresa não encontrada para este usuário");
    }
    if (response.status === 401) {
      throw new Error("Não autenticado. Por favor, faça login novamente.");
    }
    if (response.status === 403) {
      throw new Error("Você não tem permissão para acessar estes dados");
    }
    throw new Error(`Erro ao buscar dados da empresa: ${response.statusText}`);
  }

  return response.json();
}

export async function getCompanyDetails(
  companyId: string
): Promise<CompanyDTO> {
  const response = await fetch(`${API_BASE_URL}/company/${companyId}`);
  if (!response.ok) {
    throw new Error(
      `Erro ao buscar detalhes da empresa: ${response.statusText}`
    );
  }
  return response.json();
}

export async function getStockByCompany(
  companyId: string
): Promise<Bloodstock[]> {
  const authToken = getAuthTokenClient();

  const response = await fetch(`${API_BASE_URL}/stock/company/${companyId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar estoque: ${response.statusText}`);
  }
  return response.json();
}

export async function moveStock(
  companyId: string,
  movementData: BloodstockMovementRequestDTO
): Promise<Bloodstock> {
  const response = await fetch(
    `${API_BASE_URL}/stock/company/${companyId}/movement`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movementData),
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao registrar movimento: ${response.statusText}`);
  }

  return response.json();
}

export async function generateStockReport(companyId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/stock/report/${companyId}`);

  if (!response.ok) {
    throw new Error(`Erro ao gerar relatório: ${response.statusText}`);
  }

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `estoque-report-${companyId}-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Create a new blood stock item without company
 */
export async function createBloodstock(data: {
  bloodType: string;
  quantity: number;
}): Promise<Bloodstock> {
  const authToken = getAuthTokenClient();

  const response = await fetch(`${API_BASE_URL}/stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify({
      blood_type: data.bloodType,
      quantity: data.quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erro ao criar estoque de sangue",
    }));
    throw new Error(
      error.message || `Erro ao criar estoque: ${response.statusText}`
    );
  }

  const result = await response.json();
  return {
    id: result.id,
    blood_type: result.blood_type,
    quantity: result.quantity,
    updateDate: result.update_date || result.updateDate,
  };
}

/**
 * Create a new blood stock item linked to a company
 */
export async function createBloodstockWithCompany(
  companyId: string,
  data: {
    bloodType: string;
    quantity: number;
  }
): Promise<Bloodstock> {
  const authToken = getAuthTokenClient();

  const response = await fetch(`${API_BASE_URL}/stock/company/${companyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: JSON.stringify({
      blood_type: data.bloodType,
      quantity: data.quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Erro ao criar estoque de sangue",
    }));
    throw new Error(
      error.message ||
        `Erro ao criar estoque para empresa: ${response.statusText}`
    );
  }

  const result = await response.json();
  return {
    id: result.id,
    blood_type: result.blood_type,
    quantity: result.quantity,
    updateDate: result.update_date || result.updateDate,
  };
}

/**
 * Get history of stock movements for a company
 */
export async function getStockHistoryByCompany(
  companyId: string
): Promise<BloodstockMovement[]> {
  const authToken = getAuthTokenClient();

  const response = await fetch(
    `${API_BASE_URL}/stock/history/report/${companyId}`,
    {
      headers: {
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Erro ao buscar histórico: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
