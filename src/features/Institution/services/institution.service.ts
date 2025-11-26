import { APIService, isAPISuccess } from "@/service/api/api";
import {
  IInstitution,
  IInstitutionAppointment,
  IAppointmentFormData,
  IInstitutionStats,
} from "../interfaces/Institution.interface";

const apiService = new APIService();

/**
 * Institution Service
 * Handles all API calls related to institutions (hospitals, blood centers)
 */
class InstitutionService {
  /**
   * Get institution by username
   */
  async getInstitutionByUsername(username: string): Promise<IInstitution> {
    try {
      // TODO: Replace with actual API endpoint
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/institutions/username/${username}`;
      const response = await apiService.get<IInstitution>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Institution not found");
    } catch (error) {
      console.error("Error fetching institution:", error);
      throw error;
    }
  }

  /**
   * Get institution by ID
   */
  async getInstitutionById(id: string): Promise<IInstitution> {
    try {
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/institutions/${id}`;
      const response = await apiService.get<IInstitution>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Institution not found");
    } catch (error) {
      console.error("Error fetching institution:", error);
      throw error;
    }
  }

  /**
   * Get all institutions with pagination
   */
  async getAllInstitutions(
    page = 1,
    limit = 10
  ): Promise<{
    data: IInstitution[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/institutions?page=${page}&limit=${limit}`;
      const response = await apiService.get<{
        data: IInstitution[];
        metadata: any;
      }>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch institutions");
    } catch (error) {
      console.error("Error fetching institutions:", error);
      throw error;
    }
  }

  /**
   * Search institutions by city/state
   */
  async searchInstitutions(query: string): Promise<IInstitution[]> {
    try {
      const url = `${
        process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL
      }/institutions/search?q=${encodeURIComponent(query)}`;
      const response = await apiService.get<IInstitution[]>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Search failed");
    } catch (error) {
      console.error("Error searching institutions:", error);
      throw error;
    }
  }

  /**
   * Create a new appointment
   */
  async createAppointment(
    institutionId: string,
    appointmentData: IAppointmentFormData
  ): Promise<IInstitutionAppointment> {
    try {
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/appointments`;
      const response = await apiService.post<IInstitutionAppointment>(url, {
        institutionId,
        ...appointmentData,
      });

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Failed to create appointment");
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  /**
   * Get appointments by institution
   */
  async getAppointmentsByInstitution(
    institutionId: string
  ): Promise<IInstitutionAppointment[]> {
    try {
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/appointments/institution/${institutionId}`;
      const response = await apiService.get<IInstitutionAppointment[]>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch appointments");
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }

  /**
   * Get appointments by donor
   */
  async getAppointmentsByDonor(
    donorId: string
  ): Promise<IInstitutionAppointment[]> {
    try {
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/appointments/donor/${donorId}`;
      const response = await apiService.get<IInstitutionAppointment[]>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch appointments");
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/appointments/${appointmentId}/cancel`;
      const response = await apiService.put<void>(url, {});

      if (!isAPISuccess(response)) {
        throw new Error(response.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      throw error;
    }
  }

  /**
   * Get institution statistics
   */
  async getInstitutionStats(institutionId: string): Promise<IInstitutionStats> {
    try {
      const url = `${process.env.NEXT_PUBLIC_INSTITUTION_SERVICE_URL}/institutions/${institutionId}/stats`;
      const response = await apiService.get<IInstitutionStats>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      throw new Error(response.message || "Failed to fetch statistics");
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  }
}

export default new InstitutionService();
