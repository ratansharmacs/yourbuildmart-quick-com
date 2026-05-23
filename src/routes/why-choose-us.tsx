import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/why-choose-us")({
  head: () => ({
    meta: [
      { title: "Why Choose Us - YourBuildMart" },
      { name: "description", content: "Discover the reasons customers choose YourBuildMart for construction materials and dependable service." },
    ],
  }),
  component: WhyChooseUsPage,
});

function WhyChooseUsPage() {
  return (
    <InfoPageTemplate
      title="Why Choose YourBuildMart"
      subtitle="We blend market expertise, digital convenience, and dependable service to become your long-term construction supply partner."
      sections={[
        {
          title: "Authentic Brands",
          description: "We source from trusted manufacturers and distributors to ensure quality and consistency.",
          bullets: ["Verified supply chain", "Quality-first product curation", "Clear brand and spec details"],
        },
        {
          title: "Competitive Pricing",
          description: "Our pricing model is designed for both retail buyers and bulk project requirements.",
          bullets: ["Transparent rates", "Bulk quantity advantages", "Frequent promotional deals"],
        },
        {
          title: "Delivery Reliability",
          description: "Efficient dispatch and local route planning help keep your site timelines intact.",
          bullets: ["Time-slot based fulfillment", "Route-level order coordination", "Live support for urgent changes"],
        },
        {
          title: "Support That Understands Construction",
          description: "Our team helps with practical recommendations, policy clarity, and post-order guidance.",
          bullets: ["Pre-purchase consultation", "Issue resolution assistance", "Dedicated service for repeat buyers"],
        },
      ]}
      ctaText="Talk To Our Team"
      ctaTo="/contact-us"
    />
  );
}
