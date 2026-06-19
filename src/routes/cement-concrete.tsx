import { createFileRoute } from "@tanstack/react-router";
import { LiveCategoryPage } from "@/components/site/PageTemplates";

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
  return <LiveCategoryPage title="Cement & Concrete" subtitle="High-performance cement options suitable for all stages of construction." matches={["cement", "concrete"]} />;
}
