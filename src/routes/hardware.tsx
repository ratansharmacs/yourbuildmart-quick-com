import { createFileRoute } from "@tanstack/react-router";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { hardwareProducts } from "@/components/site/data";

export const Route = createFileRoute("/hardware")({
  head: () => ({
    meta: [
      { title: "Hardware - YourBuildMart" },
      { name: "description", content: "Shop quality hardware fittings and accessories at competitive prices." },
    ],
  }),
  component: HardwarePage,
});

function HardwarePage() {
  const products = [...hardwareProducts, ...hardwareProducts];
  return (
    <ProductShowcaseTemplate
      badge="Category"
      title="Hardware"
      subtitle="Reliable hardware products for kitchens, wardrobes, doors, and interiors."
      products={products}
    />
  );
}
