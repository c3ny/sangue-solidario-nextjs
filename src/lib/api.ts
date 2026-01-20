import { getClientUrl } from "@/config/microservices";
import { getAuthTokenClient } from "@/utils/auth.client";
import {
  IAppointment,
  AppointmentStatus,
} from "@/features/Institution/interfaces/Appointment.interface";
import {
  ICampaign,
  CampaignStatus,
} from "@/features/Campaign/interfaces/Campaign.interface";

const API_BASE_URL = `${getClientUrl("bloodStock", "api")}`;
const USERS_API_BASE_URL = `${getClientUrl("users", "")}`;
// const APPOINTMENTS_API_BASE_URL = `${getClientUrl("appointments", "api")}`; // Uncomment when API is ready
// const CAMPAIGNS_API_BASE_URL = `${getClientUrl("campaigns", "api")}`; // Uncomment when API is ready

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

/**
 * Get all appointments for a company/institution
 */
export async function getAppointmentsByCompany(
  institutionId: string
): Promise<IAppointment[]> {
  // TODO: Replace with actual API endpoint when available
  // For now, returning mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          institutionId,
          donorName: "João Silva",
          donorEmail: "joao.silva@email.com",
          donorPhone: "(11) 98765-4321",
          bloodType: "O+",
          birthDate: "1990-05-15",
          cpf: "123.456.789-00",
          scheduledDate: "2025-12-10",
          scheduledTime: "09:00",
          status: AppointmentStatus.CONFIRMED,
          notes: "Primeira doação",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          institutionId,
          donorName: "Maria Santos",
          donorEmail: "maria.santos@email.com",
          donorPhone: "(11) 91234-5678",
          bloodType: "A+",
          birthDate: "1985-08-22",
          cpf: "987.654.321-00",
          scheduledDate: "2025-12-10",
          scheduledTime: "10:30",
          status: AppointmentStatus.PENDING,
          notes: "Doador regular",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          institutionId,
          donorName: "Carlos Oliveira",
          donorEmail: "carlos.oliveira@email.com",
          donorPhone: "(11) 99876-5432",
          bloodType: "B+",
          birthDate: "1992-03-10",
          cpf: "456.789.123-00",
          scheduledDate: "2025-12-11",
          scheduledTime: "14:00",
          status: AppointmentStatus.CONFIRMED,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          institutionId,
          donorName: "Ana Paula Costa",
          donorEmail: "ana.costa@email.com",
          donorPhone: "(11) 97654-3210",
          bloodType: "AB+",
          birthDate: "1988-11-30",
          cpf: "321.654.987-00",
          scheduledDate: "2025-12-11",
          scheduledTime: "15:30",
          status: AppointmentStatus.COMPLETED,
          notes: "Doação concluída com sucesso",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          institutionId,
          donorName: "Pedro Henrique",
          donorEmail: "pedro.henrique@email.com",
          donorPhone: "(11) 96543-2109",
          bloodType: "O-",
          birthDate: "1995-07-18",
          cpf: "789.123.456-00",
          scheduledDate: "2025-12-12",
          scheduledTime: "08:30",
          status: AppointmentStatus.CANCELLED,
          notes: "Cancelado pelo doador",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }, 500);
  });

  /*
  // Uncomment when API is ready:
  const authToken = getAuthTokenClient();
  const response = await fetch(
    `${APPOINTMENTS_API_BASE_URL}/appointments/institution/${institutionId}`,
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
    throw new Error(`Erro ao buscar agendamentos: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
  */
}

/**
 * Update appointment status
 * TODO: Implement when API is ready
 */
export async function updateAppointmentStatus(): Promise<IAppointment> {
  // TODO: Replace with actual API endpoint when available
  // Expected parameters: appointmentId: string, status: AppointmentStatus
  throw new Error("API endpoint not yet implemented");

  /*
  // Uncomment when API is ready:
  export async function updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<IAppointment> {
    const authToken = getAuthTokenClient();
    const response = await fetch(
      `${APPOINTMENTS_API_BASE_URL}/appointments/${appointmentId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erro ao atualizar status do agendamento: ${response.statusText}`
      );
    }

    return response.json();
  }
  */
}

/**
 * Get all campaigns
 */
export async function getAllCampaigns(): Promise<ICampaign[]> {
  // TODO: Replace with actual API endpoint when available
  // For now, returning mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          title: "Campanha de Doação - Hospital São Paulo",
          description:
            "Campanha urgente para reposição de estoque de sangue tipo O+ e A+. Sua doação pode salvar vidas!",
          bannerImage:
            "https://images.unsplash.com/photo-1615461065656-e9b1f8c0e9e1?w=1200&h=400&fit=crop",
          startDate: "2024-12-01",
          endDate: "2024-12-31",
          bloodType: "O+",
          location: {
            name: "Hospital São Paulo",
            address: "Rua Napoleão de Barros, 715",
            city: "São Paulo",
            uf: "SP",
            zipcode: "04024-002",
            latitude: -23.598,
            longitude: -46.6445,
          },
          organizerId: "org1",
          organizerName: "Hospital São Paulo",
          organizerUsername: "hospitalsaopaulo",
          status: CampaignStatus.ACTIVE,
          currentDonations: 45,
          targetDonations: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Doe Sangue, Salve Vidas - Dezembro Solidário",
          description:
            "Durante o mês de dezembro, participe da nossa campanha de doação de sangue. Todos os tipos sanguíneos são bem-vindos!",
          bannerImage:
            "https://images.unsplash.com/photo-1615461065790-d8f7d9e82d6e?w=1200&h=400&fit=crop",
          startDate: "2024-12-05",
          endDate: "2024-12-25",
          location: {
            name: "Hemocentro de São Paulo",
            address: "Av. Dr. Enéas de Carvalho Aguiar, 155",
            city: "São Paulo",
            uf: "SP",
            zipcode: "05403-000",
            latitude: -23.5617,
            longitude: -46.6695,
          },
          organizerId: "org2",
          organizerName: "Hemocentro de São Paulo",
          organizerUsername: "hemocentrosp",
          status: CampaignStatus.ACTIVE,
          currentDonations: 78,
          targetDonations: 150,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Campanha Emergencial - Tipo Sanguíneo AB-",
          description:
            "Necessidade urgente de doadores com tipo sanguíneo AB-. Ajude-nos a salvar vidas com sua doação!",
          bannerImage:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop",
          startDate: "2024-12-10",
          endDate: "2024-12-20",
          bloodType: "AB-",
          location: {
            name: "Hospital Albert Einstein",
            address: "Av. Albert Einstein, 627",
            city: "São Paulo",
            uf: "SP",
            zipcode: "05652-900",
            latitude: -23.5985,
            longitude: -46.7146,
          },
          organizerId: "org3",
          organizerName: "Hospital Albert Einstein",
          organizerUsername: "einstein",
          status: CampaignStatus.ACTIVE,
          currentDonations: 12,
          targetDonations: 30,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "Campanha de Natal - Doe Amor",
          description:
            "Celebre o espírito natalino doando sangue e ajudando quem precisa nesta época especial do ano.",
          bannerImage:
            "https://images.unsplash.com/photo-1607827448387-a67db1383b59?w=1200&h=400&fit=crop",
          startDate: "2024-12-15",
          endDate: "2024-12-24",
          location: {
            name: "Santa Casa de São Paulo",
            address: "Rua Dr. Cesário Mota Júnior, 112",
            city: "São Paulo",
            uf: "SP",
            zipcode: "01221-020",
            latitude: -23.538,
            longitude: -46.6418,
          },
          organizerId: "org4",
          organizerName: "Santa Casa de São Paulo",
          organizerUsername: "santacasasp",
          status: CampaignStatus.ACTIVE,
          currentDonations: 89,
          targetDonations: 120,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          title: "Campanha Concluída - Outubro Rosa",
          description:
            "Campanha realizada durante o mês de outubro em apoio ao Outubro Rosa. Obrigado a todos os doadores!",
          bannerImage:
            "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop",
          startDate: "2024-10-01",
          endDate: "2024-10-31",
          location: {
            name: "Hospital Sírio-Libanês",
            address: "Rua Dona Adma Jafet, 91",
            city: "São Paulo",
            uf: "SP",
            zipcode: "01308-050",
            latitude: -23.5613,
            longitude: -46.6532,
          },
          organizerId: "org5",
          organizerName: "Hospital Sírio-Libanês",
          organizerUsername: "siriolibanes",
          status: CampaignStatus.COMPLETED,
          currentDonations: 200,
          targetDonations: 200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }, 500);
  });

  /*
  // Uncomment when API is ready:
  const response = await fetch(`${CAMPAIGNS_API_BASE_URL}/campaigns`);

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Erro ao buscar campanhas: ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
  */
}
