import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs - YourBuildMart" },
      { name: "description", content: "Frequently asked questions about orders, delivery, returns, and payment at YourBuildMart." },
    ],
  }),
  component: FAQsPage,
});

function FAQsPage() {
  return (
    <InfoPageTemplate
      title="Frequently Asked Questions"
      subtitle="Quick answers to the most common queries from customers, contractors, and procurement teams."
      sections={[
        {
          title: "Ordering",
          description: "How to place and manage orders on YourBuildMart.",
          bullets: [
            "You can place single-item or bulk orders directly from product pages.",
            "Our support team can assist with quote-based or recurring project orders.",
            "Order confirmation and tracking details are shared via phone/email.",
          ],
        },
        {
          title: "Delivery & Returns",
          description: "Typical fulfillment windows and return process.",
          bullets: [
            "Delivery timelines vary by city, product type, and stock availability.",
            "If an item arrives damaged, report it promptly for investigation.",
            "Approved returns are processed under our refund and return policy.",
          ],
        },
        {
          title: "Payments & Invoices",
          description: "Payment modes and billing support.",
          bullets: [
            "We support standard online payment methods and invoice-based billing where applicable.",
            "GST invoice details can be updated at checkout for business purchases.",
            "Contact support for invoice corrections or account-level assistance.",
          ],
        },
        {
          title: "Need More Help?",
          description: "Our team is available for product guidance and policy clarification.",
          bullets: [
            "Email us at care@yourbuildmart.com",
            "Call us on +91 9313984685",
            "Submit your query via our Contact Us form",
          ],
        },
      ]}
      ctaText="Contact Support"
      ctaTo="/contact-us"
    />
  );
}
