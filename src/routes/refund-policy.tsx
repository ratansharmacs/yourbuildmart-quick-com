import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy - YourBuildMart" },
      { name: "description", content: "Review YourBuildMart refund policy and process for approved return and cancellation requests." },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <InfoPageTemplate
      title="Refund Policy"
      subtitle="Our refund process is designed to be transparent and fair while protecting both customers and supply partners."
      sections={[
        {
          title: "Eligibility",
          description: "Refunds may be considered for approved cancellations, damaged deliveries, or verified product mismatch cases.",
        },
        {
          title: "Verification",
          description: "We may require order details, images, and quality checks before confirming refund eligibility.",
        },
        {
          title: "Processing Time",
          description: "Approved refunds are initiated to the original payment method within standard banking timelines.",
        },
        {
          title: "Non-Refundable Cases",
          description: "Items used, altered, or returned outside the allowed window may not qualify for refunds.",
        },
      ]}
      footerNote="This template content can be further customized with legal-approved policy language before production release."
    />
  );
}
