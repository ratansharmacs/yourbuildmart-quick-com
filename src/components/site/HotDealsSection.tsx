import { Link } from "@tanstack/react-router";
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
    <section className="bg-gradient-to-r from-[#FFF5EA] via-[#FFE7C7] to-white pb-6 pt-6 md:pb-8 md:pt-12">
      <div className="container-page">
        <div className="mb-3 flex items-center justify-between md:hidden">
          <div><h2 className="text-xl leading-none">Hot Deals</h2><p className="mt-1 text-[10px] text-muted-foreground">Save big on premium products</p></div>
          <Link to="/hot-deals" className="text-[10px] font-medium text-brand">View All Products</Link>
        </div>
        <div className="hidden md:block"><SectionHeader title="Hot Deals" subtitle="Save big on premium products" viewAllTo="/hot-deals" viewAllText="View All Products" /></div>
        {products.isLoading ? <p className="text-sm text-muted-foreground">Loading hot deals...</p> : null}
        {products.isError ? <p className="text-sm text-red-600">{products.error.message}</p> : null}
        {cards.length ? <ProductRowCarousel products={cards} /> : null}
      </div>
    </section>
  );
}
