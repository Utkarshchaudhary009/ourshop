import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "@/lib/api/services/serviceService";
import { IService } from "@/lib/types";
import { toast } from "react-hot-toast";

// Query keys
export const serviceKeys = {
  all: ["services"] as const,
  lists: () => [...serviceKeys.all, "list"] as const,
  list: (filters: { category?: string; featured?: boolean }) =>
    [...serviceKeys.lists(), { filters }] as const,
  details: () => [...serviceKeys.all, "detail"] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

// Get all services hook
export const useServices = (options?: {
  category?: string;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: serviceKeys.list(options || {}),
    queryFn: () => getAllServices(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get a single service by ID
export const useService = (id: string) => {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => getServiceById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run query if id is provided
  });
};

// Create a new service
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      serviceData: Omit<IService, "_id" | "createdAt" | "updatedAt">
    ) => createService(serviceData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      toast.success("Service created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create service");
    },
  });
};

// Update an existing service
export const useUpdateService = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      serviceData: Omit<IService, "_id" | "createdAt" | "updatedAt">
    ) => updateService(id, serviceData),
    onSuccess: (updatedService) => {
      // Update queries
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(id) });

      // Direct cache update for optimistic UI
      queryClient.setQueryData(serviceKeys.detail(id), updatedService);

      toast.success("Service updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service");
    },
  });
};

// Delete a service
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.removeQueries({ queryKey: serviceKeys.detail(id) });

      toast.success("Service deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete service");
    },
  });
};
