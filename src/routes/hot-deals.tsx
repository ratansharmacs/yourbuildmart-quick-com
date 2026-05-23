import { createFileRoute } from "@tanstack/react-router";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { cementProducts, hardwareProducts, wireProducts } from "@/components/site/data";

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
  const products = [...cementProducts.slice(0, 3), ...wireProducts.slice(0, 3), ...hardwareProducts.slice(0, 2)];

  return (
    <ProductShowcaseTemplate
      badge="Limited Time"
      title="Hot Deals"
      subtitle="Grab special prices on high-demand products before offers end."
      products={products}
    />
  );
}
