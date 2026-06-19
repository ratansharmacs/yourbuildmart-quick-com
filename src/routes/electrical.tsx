import { createFileRoute } from "@tanstack/react-router";
import { LiveCategoryPage } from "@/components/site/PageTemplates";

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
  return <LiveCategoryPage title="Electrical" subtitle="Trusted wires and electrical essentials for homes, offices, and sites." matches={["electrical", "wire"]} />;
}
