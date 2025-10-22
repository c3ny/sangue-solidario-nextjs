const API_BASE_URL = "http://localhost:8081/api"; // URL base do seu Back-End Java

// -----------------------------------------------------------------------------
// Tipos de Dados (para referência)
// -----------------------------------------------------------------------------

export interface Bloodstock {
  id: string;
  bloodType: string;
  quantity: number;
  updateDate: string; // LocalDate no Java, string no TS
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

// -----------------------------------------------------------------------------
// Funções de Chamada à API
// -----------------------------------------------------------------------------

/**
 * Busca os detalhes de um Hemocentro (Company) pelo ID.
 * @param companyId O ID (UUID) do Hemocentro.
 * @returns Os dados do Hemocentro.
 */
export async function getCompanyDetails(companyId: string): Promise<CompanyDTO> {
  const response = await fetch(`${API_BASE_URL}/company/${companyId}`);
  if (!response.ok) {
    throw new Error(`Erro ao buscar detalhes da empresa: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Lista o estoque de sangue de um Hemocentro pelo ID.
 * @param companyId O ID (UUID) do Hemocentro.
 * @returns Uma lista de Bloodstock.
 */
export async function getStockByCompany(companyId: string): Promise<Bloodstock[]> {
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
  const response = await fetch(`${API_BASE_URL}/stock/company/${companyId}/movement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movementData),
  });

  if (!response.ok) {
    // Aqui você pode adicionar lógica para tratar erros específicos, como InsufficientStockException
    throw new Error(`Erro ao registrar movimento: ${response.statusText}`);
  }

  return response.json();
}

