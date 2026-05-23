import { createFileRoute } from "@tanstack/react-router";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { wireProducts } from "@/components/site/data";

export const Route = createFileRoute("/electrical")({
  head: () => ({
    meta: [
      { title: "Electrical - YourBuildMart" },
      { name: "description", content: "Explore electrical wires and related essentials for safe installations." },
    ],
  }),
  component: ElectricalPage,
});

function ElectricalPage() {
  const products = [...wireProducts, ...wireProducts];
  return (
    <ProductShowcaseTemplate
      badge="Category"
      title="Electrical"
      subtitle="Trusted wires and electrical essentials for homes, offices, and sites."
      products={products}
    />
  );
}
