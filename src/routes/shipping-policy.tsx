import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy - YourBuildMart" },
      { name: "description", content: "Read YourBuildMart shipping and delivery policy for serviceable areas, timelines, and order fulfillment." },
    ],
  }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <InfoPageTemplate
      title="Shipping Policy"
      subtitle="This page outlines how deliveries are planned, scheduled, and completed for orders placed on YourBuildMart."
      sections={[
        {
          title: "Serviceable Areas",
          description: "Delivery is available in selected locations and depends on product category and partner coverage.",
        },
        {
          title: "Estimated Timelines",
          description: "Shipping timelines are shared at order confirmation and may vary by stock, weather, and route conditions.",
        },
        {
          title: "Delivery Attempts",
          description: "Please ensure someone is available at the delivery address. Re-attempts may involve additional scheduling.",
        },
        {
          title: "Damaged Or Missing Items",
          description: "Report issues as soon as possible with order details and photos for faster resolution.",
        },
      ]}
      footerNote="This template content can be further customized with legal-approved policy language before production release."
    />
  );
}
