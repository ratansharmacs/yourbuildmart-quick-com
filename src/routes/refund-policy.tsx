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
      subtitle="At YourBuildMart, we strive to deliver products that meet the highest standards of quality and reliability. If you encounter an issue with your order, we are committed to resolving it quickly and fairly."
      sections={[
        {
          title: "Return Eligibility",
          description: "Customers may request a return within 24 hours of receiving the order under the circumstances described below.",
          bullets: [
            "Product quality concerns: if a delivered product does not meet expected quality standards or has a defect, we will arrange a replacement after verification.",
            "Damaged or missing items: customers may request a return or replacement when an item arrives damaged or broken, or an item is missing at delivery.",
          ],
        },
        {
          title: "Important Conditions",
          description: "The return facility applies only when the product remains unused and its original packaging is intact. Return requests will not be approved in the following situations:",
          bullets: [
            "Incorrect product selection made by the customer.",
            "Excess quantities ordered by mistake.",
            "Change of requirement after delivery.",
            "Products that have been opened, used, installed, altered, or are no longer in their original condition.",
            "Products returned without original packaging.",
          ],
        },
        {
          title: "Refund Processing",
          description: "Once a return request is approved, the refund will be processed without unnecessary delay. The time taken for the refund to reflect may vary depending on the payment provider, bank, or financial institution.",
          bullets: [
            "Refund to the original payment method used during purchase; or",
            "Credit to the customer's YourBuildMart account for future purchases.",
          ],
        },
      ]}
    />
  );
}
