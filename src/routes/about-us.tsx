import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us - YourBuildMart" },
      { name: "description", content: "Learn about YourBuildMart, our mission, and why builders trust us for quality materials." },
    ],
  }),
  component: AboutUsPage,
});

function AboutUsPage() {
  return (
    <InfoPageTemplate
      title="About YourBuildMart"
      subtitle="YourBuildMart was built to simplify material buying for contractors, retailers, and homeowners by combining trusted brands, transparent pricing, and dependable fulfillment."
      stats={[
        { label: "Cities Served", value: "35+" },
        { label: "Products Listed", value: "5,000+" },
        { label: "On-Time Deliveries", value: "98%" },
      ]}
      sections={[
        {
          title: "Our Mission",
          description:
            "Make construction procurement faster, smarter, and more reliable with technology-backed ordering and local market understanding.",
          bullets: [
            "Transparent rates with no hidden charges",
            "Branded inventory sourced from verified partners",
            "Responsive support before and after purchase",
          ],
        },
        {
          title: "How We Work",
          description:
            "From product discovery to doorstep delivery, we optimize every step so your project timeline stays on track.",
          bullets: [
            "Catalog curation based on real contractor demand",
            "Order batching and route-level delivery planning",
            "Quality checks before dispatch",
          ],
        },
      ]}
      ctaText="Explore Products"
      ctaTo="/shop-all"
    />
  );
}
