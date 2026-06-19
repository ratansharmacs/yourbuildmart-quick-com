import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useProducts(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const page = await api.products(params);
      const content = await Promise.all(
        page.content.map(async (product) => {
          try {
            const detail = await api.product(product.id);
            return {
              ...product,
              imagePath: detail.imagePath,
              variants: detail.variants,
            };
          } catch {
            return product;
          }
        }),
      );
      return { ...page, content };
    },
    retry: false,
  });
}

export function useProduct(id: number | string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => /^\d+$/.test(String(id)) ? api.product(id) : api.productBySlug(String(id)),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useRelatedProducts(id: number | string) {
  return useQuery({
    queryKey: ["products", id, "related"],
    queryFn: () => api.relatedProducts(id),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: api.categories });
}

export function useBrands() {
  return useQuery({ queryKey: ["brands"], queryFn: api.brands });
}
