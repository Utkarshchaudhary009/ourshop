import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IPortfolio } from "@/lib/types";

// Query keys
export const PortfolioKeys = {
  all: ["portfolios"] as const,
  lists: () => [...PortfolioKeys.all, "list"] as const,
  list: (filters: Record<string, string> = {}) =>
    [...PortfolioKeys.lists(), filters] as const,
  details: () => [...PortfolioKeys.all, "detail"] as const,
  detail: (slug: string) => [...PortfolioKeys.details(), slug] as const,
  featured: () => [...PortfolioKeys.all, "featured"] as const,
};

// API functions
const fetchPortfolios = async (
  params = {}
): Promise<{ portfolios: IPortfolio[] }> => {
  const searchParams = new URLSearchParams(params as Record<string, string>);
  const response = await fetch(`/api/portfolio?${searchParams}`);
  if (!response.ok) throw new Error("Failed to fetch portfolios");
  return response.json();
};

const fetchPortfolioBySlug = async (
  slug: string
): Promise<{ portfolios: IPortfolio[] }> => {
  const response = await fetch(`/api/portfolio?slug=${slug}`);
  if (!response.ok) throw new Error("Failed to fetch Portfolio");
  return response.json();
};

const fetchFeaturedportfolios = async (): Promise<{
  portfolios: IPortfolio[];
}> => {
  const response = await fetch("/api/portfolio?featured=true");
  if (!response.ok) throw new Error("Failed to fetch featured portfolios");
  return response.json();
};

const createPortfolio = async (
  Portfolio: Omit<IPortfolio, "_id">
): Promise<IPortfolio> => {
  console.log("at db2 of portfolios");
  const response = await fetch("/api/portfolio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Portfolio),
  });
  if (!response.ok) throw new Error("Failed to create Portfolio");
  return response.json();
};

const updatePortfolio = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<IPortfolio>;
}): Promise<IPortfolio> => {
  const response = await fetch(`/api/portfolio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update Portfolio");
  return response.json();
};

const deletePortfolio = async (id: string): Promise<void> => {
  const response = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete Portfolio");
  return response.json();
};

// Hooks
export function usePortfolios(filters = {}) {
  return useQuery({
    queryKey: PortfolioKeys.list(filters),
    queryFn: () => fetchPortfolios(filters),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

export function usePortfolio(slug: string) {
  return useQuery({
    queryKey: PortfolioKeys.detail(slug),
    queryFn: () => fetchPortfolioBySlug(slug),
    enabled: !!slug, // Only run when slug is available
    staleTime: 1000 * 60 * 10, // Consider data fresh for 10 minutes
  });
}

export function useFeaturedportfolios() {
  return useQuery({
    queryKey: PortfolioKeys.featured(),
    queryFn: fetchFeaturedportfolios,
    staleTime: 1000 * 60 * 30, // Consider data fresh for 30 minutes
  });
}

export function useCreatePortfolio() {
  console.log("at db 1");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PortfolioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: PortfolioKeys.featured() });
    },
  });
}

export function useUpdatePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePortfolio,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PortfolioKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: PortfolioKeys.detail(data._id as string),
      });
      queryClient.invalidateQueries({ queryKey: PortfolioKeys.featured() });
    },
  });
}

export function useDeletePortfolio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PortfolioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: PortfolioKeys.featured() });
    },
  });
}
