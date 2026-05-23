import { createFileRoute } from "@tanstack/react-router";
import { InfoPageTemplate } from "@/components/site/PageTemplates";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions - YourBuildMart" },
      { name: "description", content: "Read the terms and conditions governing use of the YourBuildMart platform and services." },
    ],
  }),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <InfoPageTemplate
      title="Terms & Conditions"
      subtitle="By accessing and using YourBuildMart, users agree to the terms outlined below."
      sections={[
        {
          title: "Platform Usage",
          description: "Users are expected to provide accurate information and use the platform for lawful transactions only.",
        },
        {
          title: "Pricing & Availability",
          description: "Product pricing and stock details may change based on supply conditions and market fluctuations.",
        },
        {
          title: "Orders & Cancellations",
          description: "Order confirmation, modifications, and cancellations are subject to operational feasibility and policy rules.",
        },
        {
          title: "Limitation Of Liability",
          description: "YourBuildMart is not liable for delays or interruptions caused by circumstances outside reasonable control.",
        },
      ]}
      footerNote="This template content can be further customized with legal-approved policy language before production release."
    />
  );
}
