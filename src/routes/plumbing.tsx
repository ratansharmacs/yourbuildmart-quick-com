import { createFileRoute } from "@tanstack/react-router";
import { LiveCategoryPage } from "@/components/site/PageTemplates";

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
  return <LiveCategoryPage title="Plumbing" subtitle="Essential products selected for practical plumbing and utility installations." matches={["plumbing", "pipe"]} />;
}
