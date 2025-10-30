import { getClientUrl } from "@/config/microservices";

const API_BASE_URL = `${getClientUrl("bloodStock", "api")}`;

export interface Bloodstock {
  id: string;
  bloodType: string;
  quantity: number;
  updateDate: string;
}

export interface CompanyDTO {
  id: string;
  name: string;
  institutionName: string;
}

export interface BloodstockMovementRequestDTO {
  bloodstockId: string;
  quantity: number;
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

/**
 * Lista o estoque de sangue de um Hemocentro pelo ID.
 * @param companyId O ID (UUID) do Hemocentro.
 * @returns Uma lista de Bloodstock.
 */
export async function getStockByCompany(
  companyId: string
): Promise<Bloodstock[]> {
  const response = await fetch(`${API_BASE_URL}/stock/company/${companyId}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar estoque: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Registra um movimento (entrada/saída) no estoque de sangue.
 * @param companyId O ID (UUID) do Hemocentro.
 * @param movementData Os dados da movimentação (bloodstockId e quantity).
 * @returns O Bloodstock atualizado.
 */
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
    // Aqui você pode adicionar lógica para tratar erros específicos, como InsufficientStockException
    throw new Error(`Erro ao registrar movimento: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Gera um relatório CSV do estoque de sangue de um Hemocentro.
 * @param companyId O ID (UUID) do Hemocentro.
 * @returns Promise que resolve quando o download é iniciado.
 */
export async function generateStockReport(companyId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/stock/report/${companyId}`);

  if (!response.ok) {
    throw new Error(`Erro ao gerar relatório: ${response.statusText}`);
  }

  // Get the blob from the response
  const blob = await response.blob();

  // Create a download link and trigger download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `estoque-report-${companyId}-${
    new Date().toISOString().split("T")[0]
  }.csv`;
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
