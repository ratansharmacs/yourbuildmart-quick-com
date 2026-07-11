import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductRowCarousel } from "@/components/site/ProductRowCarousel";
import { api } from "@/lib/api";
import { catalogProductToCard } from "@/lib/product-adapter";

export function HotDealsSection() {
  const products = useQuery({
    queryKey: ["hot-deal-product-carousel"],
    queryFn: () => api.hotDealProducts({ page: 0, size: 15, sortBy: "crtDt", direction: "DESC" }),
  });
  const cards = (products.data?.content || []).map(catalogProductToCard);

  return (
    <section className="bg-gradient-to-r from-[#FFF5EA] via-[#FFE7C7] to-white py-10 md:py-12">
      <div className="container-page">
        <SectionHeader title="Hot Deals" subtitle="Save big on premium products" viewAllTo="/hot-deals" />
        {products.isLoading ? <p className="text-sm text-muted-foreground">Loading hot deals...</p> : null}
        {products.isError ? <p className="text-sm text-red-600">{products.error.message}</p> : null}
        {cards.length ? <ProductRowCarousel products={cards} /> : null}
      </div>
    </section>
  );
}
