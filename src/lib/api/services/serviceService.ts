import { IService } from "@/lib/types";

const API_URL = "/api/services";

/**
 * Get all services with optional filtering
 */
export const getAllServices = async (options?: {
  category?: string;
  featured?: boolean;
}): Promise<IService[]> => {
  try {
    const queryParams = new URLSearchParams();

    if (options?.category) {
      queryParams.append("category", options.category);
    }

    if (options?.featured !== undefined) {
      queryParams.append("featured", options.featured.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch services");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

/**
 * Get a single service by ID
 */
export const getServiceById = async (id: string): Promise<IService> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { cache: "no-store" });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch service");
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new service
 */
export const createService = async (
  serviceData: Omit<IService, "_id" | "createdAt" | "updatedAt">
): Promise<IService> => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create service");
    }

    return response.json();
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
};

/**
 * Update an existing service
 */
export const updateService = async (
  id: string,
  serviceData: Omit<IService, "_id" | "createdAt" | "updatedAt">
): Promise<IService> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update service");
    }

    return response.json();
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a service
 */
export const deleteService = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete service");
    }
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw error;
  }
};
