import { apiClient, isAPISuccess } from "@/service/api/api.client";
import { getAuthTokenClient } from "@/utils/auth.client";

/**
 * Client-side service for donation operations
 * Uses APIClient for browser-based requests with authentication
 */
export interface IDonation {
  id: string;
  status: string;
  content: string;
  startDate: string;
  finishDate?: string;
  bloodType: string;
  location: {
    latitude: number;
    longitude: number;
  };
  userId: string;
  name?: string;
  image?: string;
}

export interface ICreateDonationData {
  status: string;
  content: string;
  startDate: string;
  finishDate?: string;
  bloodType: string;
  location: {
    latitude: number;
    longitude: number;
  };
  userId: string;
  name?: string;
  image?: string;
}

export interface IPaginatedDonations {
  data: IDonation[];
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IRegistration {
  id: string;
  donationId: string;
  userId: string;
  status: string;
  registeredAt: string;
  confirmedAt?: string;
  completedAt?: string;
  canceledAt?: string;
  notes?: string;
}

export class DonationsClientService {
  /**
   * Get all donations with pagination
   * Note: This endpoint is public and doesn't require authentication
   */
  async getAllDonations(
    page: number = 1,
    limit: number = 10
  ): Promise<IPaginatedDonations | null> {
    try {
      const url = apiClient.getDonationServiceUrl(
        `donations?page=${page}&limit=${limit}`
      );
      const response = await apiClient.get<IPaginatedDonations>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to fetch donations:", response.message);
      return null;
    } catch (error) {
      console.error("Error fetching donations:", error);
      return null;
    }
  }

  /**
   * Get donation by ID
   * Note: This endpoint is public and doesn't require authentication
   */
  async getDonationById(id: string): Promise<IDonation | null> {
    try {
      const token = getAuthTokenClient();

      apiClient.setAuthToken(token ?? "");

      const url = apiClient.getDonationServiceUrl(`donations/${id}`);
      const response = await apiClient.get<IDonation>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to fetch donation:", response.message);
      return null;
    } catch (error) {
      console.error("Error fetching donation:", error);
      return null;
    }
  }

  /**
   * Get donations by blood type
   * Note: This endpoint is public and doesn't require authentication
   */
  async getDonationsByBloodType(
    bloodType: string
  ): Promise<IDonation[] | null> {
    try {
      const url = apiClient.getDonationServiceUrl(
        `donations/blood-type/${bloodType}`
      );
      const response = await apiClient.get<IDonation[]>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error(
        "Failed to fetch donations by blood type:",
        response.message
      );
      return null;
    } catch (error) {
      console.error("Error fetching donations by blood type:", error);
      return null;
    }
  }

  /**
   * Create a new donation
   * 🔒 Requires authentication - JWT token must be set
   */
  async createDonation(
    donationData: ICreateDonationData
  ): Promise<IDonation | null> {
    try {
      const token = await getAuthTokenClient();

      apiClient.setAuthToken(token ?? "");
      const url = apiClient.getDonationServiceUrl("donations");
      const response = await apiClient.post<IDonation>(url, donationData);

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to create donation:", response.message);
      return null;
    } catch (error) {
      console.error("Error creating donation:", error);
      return null;
    }
  }

  /**
   * Update donation status
   * 🔒 Requires authentication - JWT token must be set
   */
  async updateDonationStatus(
    id: string,
    status: string
  ): Promise<IDonation | null> {
    try {
      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        console.error("Authentication required to update donation status");
        return null;
      }

      const url = apiClient.getDonationServiceUrl(`donations/${id}/status`);
      const response = await apiClient.put<IDonation>(url, { status });

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to update donation status:", response.message);
      return null;
    } catch (error) {
      console.error("Error updating donation status:", error);
      return null;
    }
  }

  /**
   * Delete a donation
   * 🔒 Requires authentication - JWT token must be set
   */
  async deleteDonation(id: string): Promise<boolean> {
    try {
      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        console.error("Authentication required to delete donation");
        return false;
      }

      const url = apiClient.getDonationServiceUrl(`donations/${id}`);
      const response = await apiClient.delete(url);

      if (isAPISuccess(response)) {
        return true;
      }

      console.error("Failed to delete donation:", response.message);
      return false;
    } catch (error) {
      console.error("Error deleting donation:", error);
      return false;
    }
  }

  async getDonationsCount(): Promise<number | null> {
    try {
      const url = apiClient.getDonationServiceUrl("donations/count");
      const response = await apiClient.get<{ count: number }>(url);

      if (isAPISuccess(response)) {
        return response.data.count;
      }

      console.error("Failed to fetch donations count:", response.message);
      return null;
    } catch (error) {
      console.error("Error fetching donations count:", error);
      return null;
    }
  }

  /**
   * Create a registration for a donation
   * 🔒 Requires authentication - JWT token must be set
   */
  async createRegistration(
    donationId: string,
    userId: string,
    notes?: string
  ): Promise<IRegistration | null> {
    try {
      // Check if user is authenticated
      const url = apiClient.getDonationServiceUrl("registrations");
      const response = await apiClient.post<IRegistration>(url, {
        donationId,
        userId,
        notes,
      });

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to create registration:", response.message);
      return null;
    } catch (error) {
      console.error("Error creating registration:", error);
      return null;
    }
  }

  async getRegistrationsByDonation(
    donationId: string
  ): Promise<IRegistration[] | null> {
    try {
      const url = apiClient.getDonationServiceUrl(
        `registrations/donation/${donationId}`
      );
      const response = await apiClient.get<IRegistration[]>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to fetch registrations:", response.message);
      return null;
    } catch (error) {
      console.error("Error fetching registrations:", error);
      return null;
    }
  }

  async getRegistrationsByUser(
    userId: string
  ): Promise<IRegistration[] | null> {
    try {
      const url = apiClient.getDonationServiceUrl(
        `registrations/user/${userId}`
      );
      const response = await apiClient.get<IRegistration[]>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to fetch user registrations:", response.message);
      return null;
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      return null;
    }
  }

  /**
   * Update registration status
   * 🔒 Requires authentication - JWT token must be set
   */
  async updateRegistrationStatus(
    id: string,
    status: string
  ): Promise<IRegistration | null> {
    try {
      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        console.error("Authentication required to update registration status");
        return null;
      }

      const url = apiClient.getDonationServiceUrl(`registrations/${id}/status`);
      const response = await apiClient.patch<IRegistration>(url, { status });

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to update registration status:", response.message);
      return null;
    } catch (error) {
      console.error("Error updating registration status:", error);
      return null;
    }
  }

  /**
   * Cancel a registration
   * 🔒 Requires authentication - JWT token must be set
   */
  async cancelRegistration(id: string): Promise<IRegistration | null> {
    try {
      // Check if user is authenticated
      if (!apiClient.isAuthenticated()) {
        console.error("Authentication required to cancel registration");
        return null;
      }

      const url = apiClient.getDonationServiceUrl(`registrations/${id}/cancel`);
      const response = await apiClient.patch<IRegistration>(url);

      if (isAPISuccess(response)) {
        return response.data;
      }

      console.error("Failed to cancel registration:", response.message);
      return null;
    } catch (error) {
      console.error("Error canceling registration:", error);
      return null;
    }
  }
}

export const donationsClientService = new DonationsClientService();
