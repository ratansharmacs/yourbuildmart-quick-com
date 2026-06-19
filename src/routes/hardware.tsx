import { createFileRoute } from "@tanstack/react-router";
import { LiveCategoryPage } from "@/components/site/PageTemplates";

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
  return <LiveCategoryPage title="Hardware" subtitle="Reliable hardware products for kitchens, wardrobes, doors, and interiors." matches={["hardware"]} />;
}
