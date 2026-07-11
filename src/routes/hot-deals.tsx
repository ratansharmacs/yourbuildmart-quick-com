import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { api } from "@/lib/api";
import { catalogProductToCard } from "@/lib/product-adapter";

export const Route = createFileRoute("/hot-deals")({
  head: () => ({
    meta: [
      { title: "Hot Deals - YourBuildMart" },
      { name: "description", content: "Limited-time offers across top construction categories." },
    ],
  }),
  component: HotDealsPage,
});

function HotDealsPage() {
  const productsQuery = useQuery({ queryKey: ["hot-deals-products"], queryFn: async () => {
    const first = await api.hotDealProducts({ page: 0, size: 100, sortBy: "crtDt", direction: "DESC" });
    const pages = await Promise.all(Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, index) => api.hotDealProducts({ page: index + 1, size: 100, sortBy: "crtDt", direction: "DESC" })));
    const catalog = [first, ...pages].flatMap((page) => page.content);
    return catalog;
  } });

  return (
    <ProductShowcaseTemplate
      badge="Limited Time"
      title="Hot Deals"
      subtitle="Grab special prices on high-demand products before offers end."
      products={(productsQuery.data || []).map(catalogProductToCard)}
      topContent={productsQuery.isLoading ? <p>Loading products...</p> : productsQuery.isError ? <p className="text-red-600">{productsQuery.error.message}</p> : undefined}
    />
  );
}
