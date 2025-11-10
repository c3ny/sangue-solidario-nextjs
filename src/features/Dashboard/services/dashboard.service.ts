import { apiClient, isAPISuccess } from "@/service/api/api.client";
import { getAuthTokenClient } from "@/utils/auth.client";
import { getStockByCompany, Bloodstock } from "@/lib/api";

/**
 * Appointment interface with donation details
 */
export interface IAppointment {
  id: string;
  registrationId: string;
  donationId: string;
  userId: string;
  donorName?: string;
  donorEmail?: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";
  registeredAt: string;
  confirmedAt?: string;
  completedAt?: string;
  canceledAt?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  bloodType: string;
  notes?: string;
  donationContent?: string;
}

/**
 * Dashboard statistics
 */
export interface IDashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  totalBloodStock: number;
  criticalBloodTypes: string[];
}

/**
 * Dashboard Service
 * Handles fetching appointments and dashboard data for companies
 */
class DashboardService {
  /**
   * Get all appointments for a company's donations
   * Fetches all donations created by the company, then gets registrations for each
   */
  async getAppointmentsByCompany(companyId: string): Promise<IAppointment[]> {
    try {
      const token = getAuthTokenClient();
      if (!token) {
        throw new Error("Authentication required");
      }

      apiClient.setAuthToken(token);

      // Get all donations created by this company
      const donationsUrl = apiClient.getDonationServiceUrl(
        `donations?page=1&limit=100`
      );
      const donationsResponse = await apiClient.get<{
        data: Array<{
          id: string;
          userId: string;
          bloodType: string;
          content: string;
          startDate: string;
          status: string;
        }>;
      }>(donationsUrl);

      if (!isAPISuccess(donationsResponse)) {
        console.error("Failed to fetch donations:", donationsResponse.message);
        return [];
      }

      // Filter donations by company ID
      const companyDonations = donationsResponse.data.data.filter(
        (donation) => donation.userId === companyId
      );

      // Get registrations for each donation
      const appointments: IAppointment[] = [];

      for (const donation of companyDonations) {
        const registrationsUrl = apiClient.getDonationServiceUrl(
          `registrations/donation/${donation.id}`
        );
        const registrationsResponse = await apiClient.get<
          Array<{
            id: string;
            donationId: string;
            userId: string;
            status: string;
            registeredAt: string;
            confirmedAt?: string;
            completedAt?: string;
            canceledAt?: string;
            notes?: string;
          }>
        >(registrationsUrl);

        if (isAPISuccess(registrationsResponse)) {
          for (const registration of registrationsResponse.data) {
            appointments.push({
              id: `${registration.id}-${donation.id}`,
              registrationId: registration.id,
              donationId: donation.id,
              userId: registration.userId,
              status: registration.status as IAppointment["status"],
              registeredAt: registration.registeredAt,
              confirmedAt: registration.confirmedAt,
              completedAt: registration.completedAt,
              canceledAt: registration.canceledAt,
              appointmentDate: donation.startDate
                ? new Date(donation.startDate).toLocaleDateString("pt-BR")
                : undefined,
              appointmentTime: donation.startDate
                ? new Date(donation.startDate).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : undefined,
              bloodType: donation.bloodType,
              notes: registration.notes,
              donationContent: donation.content,
            });
          }
        }
      }

      return appointments.sort(
        (a, b) =>
          new Date(b.registeredAt).getTime() -
          new Date(a.registeredAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  }

  /**
   * Get blood stock for a company
   */
  async getBloodStock(companyId: string): Promise<Bloodstock[]> {
    try {
      return await getStockByCompany(companyId);
    } catch (error) {
      console.error("Error fetching blood stock:", error);
      return [];
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(companyId: string): Promise<IDashboardStats | null> {
    try {
      const [appointments, bloodStock] = await Promise.all([
        this.getAppointmentsByCompany(companyId),
        this.getBloodStock(companyId),
      ]);

      const totalAppointments = appointments.length;
      const pendingAppointments = appointments.filter(
        (a) => a.status === "PENDING"
      ).length;
      const confirmedAppointments = appointments.filter(
        (a) => a.status === "CONFIRMED"
      ).length;
      const completedAppointments = appointments.filter(
        (a) => a.status === "COMPLETED"
      ).length;

      const totalBloodStock = bloodStock.reduce(
        (sum, stock) => sum + stock.quantity,
        0
      );

      const criticalBloodTypes = bloodStock
        .filter((stock) => stock.quantity < 20)
        .map((stock) => stock.bloodType);

      return {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        totalBloodStock,
        criticalBloodTypes,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(
    registrationId: string,
    status: "CONFIRMED" | "COMPLETED" | "CANCELED"
  ): Promise<boolean> {
    try {
      const token = getAuthTokenClient();
      if (!token) {
        throw new Error("Authentication required");
      }

      apiClient.setAuthToken(token);

      const url = apiClient.getDonationServiceUrl(
        `registrations/${registrationId}/status`
      );
      const response = await apiClient.patch<{ id: string }>(url, { status });

      return isAPISuccess(response);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      return false;
    }
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(registrationId: string): Promise<boolean> {
    try {
      const token = getAuthTokenClient();
      if (!token) {
        throw new Error("Authentication required");
      }

      apiClient.setAuthToken(token);

      const url = apiClient.getDonationServiceUrl(
        `registrations/${registrationId}/cancel`
      );
      const response = await apiClient.patch<{ id: string }>(url);

      return isAPISuccess(response);
    } catch (error) {
      console.error("Error canceling appointment:", error);
      return false;
    }
  }
}

export const dashboardService = new DashboardService();
