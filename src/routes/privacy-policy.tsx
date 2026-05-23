import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy - YourBuildMart" },
      { name: "description", content: "Understand how YourBuildMart collects, uses, and safeguards user data." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <InfoPageTemplate
      title="Privacy Policy"
      subtitle="Your privacy matters to us. This page explains what data we collect and how we use it to improve your shopping experience."
      sections={[
        {
          title: "Information We Collect",
          description: "We may collect contact details, delivery addresses, and order data needed to process purchases.",
        },
        {
          title: "How We Use Data",
          description: "Data is used for order processing, customer support, communication, and platform improvement.",
        },
        {
          title: "Data Security",
          description: "We follow reasonable operational and technical safeguards to protect customer information.",
        },
        {
          title: "User Rights",
          description: "You can contact support for updates, corrections, or account-related privacy requests.",
        },
      ]}
      footerNote="This template content can be further customized with legal-approved policy language before production release."
    />
  );
}
