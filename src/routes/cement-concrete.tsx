import { createFileRoute } from "@tanstack/react-router";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { cementProducts } from "@/components/site/data";

export const Route = createFileRoute("/cement-concrete")({
  head: () => ({
    meta: [
      { title: "Cement & Concrete - YourBuildMart" },
      { name: "description", content: "Shop cement and concrete products for residential and commercial needs." },
    ],
  }),
  component: CementConcretePage,
});

function CementConcretePage() {
  const products = [...cementProducts, ...cementProducts];
  return (
    <ProductShowcaseTemplate
      badge="Category"
      title="Cement & Concrete"
      subtitle="High-performance cement options suitable for all stages of construction."
      products={products}
    />
  );
}
