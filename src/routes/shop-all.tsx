import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { cementProducts, hardwareProducts, wireProducts } from "@/components/site/data";

export const Route = createFileRoute("/shop-all")({
  head: () => ({
    meta: [
      { title: "Shop All - YourBuildMart" },
      { name: "description", content: "Browse all major construction and hardware categories in one place." },
    ],
  }),
  component: ShopAllPage,
});

function ShopAllPage() {
  const products = [
    ...cementProducts,
    ...hardwareProducts,
    ...wireProducts,
    ...cementProducts.slice(0, 2),
    ...wireProducts.slice(0, 2),
  ];

  return (
    <ProductShowcaseTemplate
      badge="All Categories"
      title="Shop All Products"
      subtitle="Explore cement, electricals, hardware, and project essentials in one catalog view."
      products={products}
      topContent={
        <div className="flex flex-wrap gap-2">
          <Link to="/cement-concrete" className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary">Cement & Concrete</Link>
          <Link to="/hardware" className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary">Hardware</Link>
          <Link to="/electrical" className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary">Electrical</Link>
          <Link to="/plumbing" className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-secondary">Plumbing</Link>
        </div>
      }
    />
  );
}
