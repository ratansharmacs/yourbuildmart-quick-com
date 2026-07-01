import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { api } from "@/lib/api";
import { catalogProductToCard } from "@/lib/product-adapter";

export const Route = createFileRoute("/flash-sale")({
  head: () => ({
    meta: [
      { title: "Flash Sale - YourBuildMart" },
      { name: "description", content: "Fast-moving flash sale products at reduced prices." },
    ],
  }),
  component: FlashSalePage,
});

function FlashSalePage() {
  const productsQuery = useQuery({
    queryKey: ["flash-sale-products"],
    queryFn: async () => {
      const page = await api.products({ page: 0, size: 48, sortBy: "crtDt", direction: "DESC" });
      return Promise.all(
        page.content.map(async (product) => {
          try {
            return { ...product, ...(await api.product(product.id)) };
          } catch {
            return product;
          }
        }),
      );
    },
  });

  return (
    <ProductShowcaseTemplate
      badge="Lightning Deals"
      title="Flash Sale"
      subtitle="Short-duration offers on selected construction essentials."
      products={(productsQuery.data || []).map(catalogProductToCard)}
      topContent={productsQuery.isLoading ? <p>Loading products...</p> : productsQuery.isError ? <p className="text-red-600">{productsQuery.error.message}</p> : undefined}
    />
  );
}
