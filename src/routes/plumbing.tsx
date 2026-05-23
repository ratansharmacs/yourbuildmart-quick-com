import { createFileRoute } from "@tanstack/react-router";
import { ProductShowcaseTemplate } from "@/components/site/PageTemplates";
import { hardwareProducts, wireProducts } from "@/components/site/data";

export const Route = createFileRoute("/plumbing")({
  head: () => ({
    meta: [
      { title: "Plumbing - YourBuildMart" },
      { name: "description", content: "Browse plumbing-related accessories and site-ready essentials." },
    ],
  }),
  component: PlumbingPage,
});

function PlumbingPage() {
  const products = [...hardwareProducts.slice(0, 2), ...wireProducts.slice(0, 2), ...hardwareProducts];
  return (
    <ProductShowcaseTemplate
      badge="Category"
      title="Plumbing"
      subtitle="Essential products selected for practical plumbing and utility installations."
      products={products}
    />
  );
}
