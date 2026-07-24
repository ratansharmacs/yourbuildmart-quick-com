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
      subtitle="This Privacy Policy explains how YourBuildMart, operated by VRYBM Private Limited, collects, stores, uses, shares, and safeguards personal information obtained through our website, mobile applications, services, and customer interactions. By using a YourBuildMart platform, you acknowledge this Policy and consent to the practices described. If you disagree, discontinue use of our services."
      sections={[
        {
          title: "1. Updates to This Privacy Policy",
          description: "We may revise this Policy to reflect operational changes, technological developments, legal requirements, or service improvements. Revised versions and their effective dates will be published on our website. Continued use after an update constitutes acceptance.",
        },
        {
          title: "2. Information We Collect",
          description: "The information collected depends on how you interact with us. Required information is necessary to process orders and provide services; not providing it may restrict certain features.",
          bullets: [
            "Directly provided information: name, email, mobile number, billing and delivery addresses, account credentials, order information, customer-service communications, wishlist and cart activity.",
            "Automatically collected information: IP address, browser and device information, operating system, referral source, usage patterns, website interactions, and session information.",
            "Third-party information: information from payment gateways, logistics partners, analytics and marketing providers, customer-support vendors, and technology infrastructure partners.",
          ],
        },
        {
          title: "3. How We Use Personal Information",
          description: "YourBuildMart may process personal information for:",
          bullets: [
            "Order fulfilment, delivery management, returns, refunds, and order updates.",
            "Account creation, authentication, administration, and platform access.",
            "Customer support, complaint resolution, and service-quality improvement.",
            "Promotions, offers, recommendations, newsletters, and service communications where legally permitted.",
            "Behavior analysis, platform improvement, operational optimization, and customer experience.",
            "Security, fraud detection, investigation, and prevention.",
            "Compliance with laws, regulatory requirements, proceedings, and enforcement obligations.",
          ],
        },
        {
          title: "4. Cookies and Similar Technologies",
          description: "Cookies and similar technologies support website functionality and user experience. Browsers generally allow cookie management or disabling, but doing so may affect website functions.",
          bullets: [
            "Remembering preferences and login sessions.",
            "Performance monitoring, analytics, and service optimization.",
            "Personalizing content and advertising.",
          ],
        },
        {
          title: "5. Sharing of Information",
          description: "YourBuildMart does not sell personal information in the ordinary course of business. We may disclose information where necessary to protect our rights, investigate fraud, comply with law, or enforce policies.",
          bullets: [
            "Payment processors, delivery and logistics partners.",
            "Technology, analytics, and marketing providers.",
            "Group companies and affiliates.",
            "Regulatory authorities where legally required.",
          ],
        },
        {
          title: "6. User Reviews and Public Content",
          description: "Reviews, ratings, comments, or other content voluntarily posted in public areas may be visible to others. Customers should avoid sharing personal information publicly.",
        },
        {
          title: "7. Third-Party Websites",
          description: "Our platform may link to external services. YourBuildMart is not responsible for their privacy practices, content, security, or policies. Review the policies of third-party services you visit.",
        },
        {
          title: "8. Children's Privacy",
          description: "Services are intended for people capable of entering legally binding transactions. We do not knowingly collect children's personal information and will take reasonable steps to remove information collected inadvertently.",
        },
        {
          title: "9. Data Security",
          description: "We use commercially reasonable technical, administrative, and organizational safeguards against unauthorized access, loss, misuse, alteration, or disclosure. No electronic transmission or storage system can be guaranteed completely secure.",
        },
        {
          title: "10. Data Retention",
          description: "Information is retained only as long as reasonably necessary. Retention periods vary by information type and applicable legal requirements.",
          bullets: [
            "Providing services and maintaining customer accounts.",
            "Meeting legal and regulatory obligations.",
            "Resolving disputes and enforcing contractual rights.",
            "Supporting legitimate business purposes.",
          ],
        },
        {
          title: "11. Delivery Partner Application Privacy Notice",
          description: "The Delivery Partner Application collects additional information required for fulfilment and delivery operations.",
          bullets: [
            "Precise location through GPS, network positioning, and related technologies for nearby assignments, live customer tracking, delivery monitoring, route distance, and compensation operations.",
            "Background location may continue while the app is not actively open to support assignments, real-time visibility, and route monitoring.",
            "Delivery partners can stop collection by going offline or changing device permissions, though this may limit delivery opportunities and features.",
            "Device model, operating system and app versions, device identifiers, and diagnostic information may be collected for stability, troubleshooting, and performance.",
          ],
        },
        {
          title: "12. Your Privacy Rights",
          description: "Subject to applicable law, users may exercise the following rights. Withdrawal of consent does not affect earlier lawful processing, and necessary transactional messages may continue.",
          bullets: [
            "Access information held by YourBuildMart and understand its use.",
            "Correct inaccurate, incomplete, or outdated information.",
            "Request deletion where retention is no longer necessary or legally required.",
            "Request data portability in a structured format where applicable.",
            "Restrict certain processing where legally permitted.",
            "Withdraw consent and opt out of promotional communications.",
          ],
        },
        {
          title: "13. Exercising Your Rights",
          description: "Submit privacy requests through the contact details in this Policy. We may reasonably verify identity. Authorized representatives may act where legally permitted and appropriately authorized.",
        },
        {
          title: "14. Complaints and Grievances",
          description: "Contact us if you have concerns about the collection, use, storage, or processing of personal information. We will make reasonable efforts to investigate and respond within an appropriate timeframe.",
        },
        {
          title: "15. International Data Processing",
          description: "Information may be processed, stored, or accessed outside the user's country. Where applicable, reasonable safeguards and contractual protections will be implemented as required by law.",
        },
        {
          title: "16. Contact Information",
          description: "Trade Name: YourBuildMart\nLegal Entity: VRYBM Private Limited\nWarehouse and Registered Office: 259, FF, Silver Oak Road, Ghitorni, New Delhi - 110030, India\nEmail: info@yourbuildmart.com",
        },
      ]}
    />
  );
}
