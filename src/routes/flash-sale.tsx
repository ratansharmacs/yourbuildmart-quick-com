import { createFileRoute } from "@tanstack/react-router";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { cementProducts, hardwareProducts, wireProducts } from "@/components/site/data";

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
  const products = [...wireProducts, ...hardwareProducts.slice(0, 2), ...cementProducts.slice(0, 2)];

  return (
    <ProductShowcaseTemplate
      badge="Lightning Deals"
      title="Flash Sale"
      subtitle="Short-duration offers on selected construction essentials."
      products={products}
    />
  );
}
