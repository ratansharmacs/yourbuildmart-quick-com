import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials - YourBuildMart" },
      { name: "description", content: "See what customers and contractors say about YourBuildMart's pricing, quality, and delivery." },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <InfoPageTemplate
      title="What Customers Say"
      subtitle="Trusted by individual homeowners, contractors, and institutional buyers for dependable service and quality products."
      sections={[
        {
          title: "Residential Projects",
          description:
            '"Ordering was easy and delivery was right on time. Product quality matched what was shown online." - Homeowner, Lucknow',
        },
        {
          title: "Contractor Teams",
          description:
            '"Bulk pricing and quick dispatch helped us finish one week ahead of schedule." - Civil Contractor, Kanpur',
        },
        {
          title: "Retail Partners",
          description:
            '"YourBuildMart has become our preferred source for steady stock and better margins." - Hardware Retailer',
        },
        {
          title: "Project Procurement",
          description:
            '"Policy clarity and responsive support reduced our purchasing friction significantly." - Procurement Manager',
        },
      ]}
      ctaText="Start Shopping"
      ctaTo="/shop-all"
    />
  );
}
