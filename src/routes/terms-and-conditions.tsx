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
      subtitle="These Terms of Service govern access to and use of the YourBuildMart website, mobile applications, products, and related services operated by VRYBM Private Limited. By accessing the platform, creating an account, placing an order, or using a service, you agree to these Terms. If you disagree, discontinue use immediately."
      sections={[
        {
          title: "1. Introduction",
          description: "These Terms apply to all access to and use of YourBuildMart's platforms, products, and related services.",
        },
        {
          title: "2. Eligibility",
          description: "By using the platform, you confirm the following. Parents or legal guardians remain responsible for authorized use by minors under their supervision.",
          bullets: [
            "You are legally capable of entering binding contracts.",
            "The information you provide is accurate and complete.",
            "You will comply with applicable laws and regulations.",
          ],
        },
        {
          title: "3. Acceptance of Services",
          description: "Use of the platform also constitutes acceptance of the Privacy, Refund, Shipping, and any additional policies published by YourBuildMart. Those policies form an integral part of these Terms.",
        },
        {
          title: "4. User Conduct",
          description: "Violation of these requirements may result in suspension or termination of access.",
          bullets: [
            "Do not use the platform unlawfully or violate intellectual property rights.",
            "Do not upload malware, viruses, or harmful code.",
            "Do not attempt unauthorized access to systems or data.",
            "Do not commit fraud or interfere with platform operations.",
          ],
        },
        {
          title: "5. Product Information",
          description: "YourBuildMart makes reasonable efforts to keep descriptions, specifications, images, and prices accurate, but does not guarantee the platform is always free from errors or omissions.",
          bullets: [
            "Images may vary slightly from actual products.",
            "Technical specifications may change without notice.",
            "Availability may change with inventory status.",
          ],
        },
        {
          title: "6. Pricing",
          description: "Prices may change without notice. Pricing changes do not affect orders already confirmed and accepted.",
          bullets: [
            "YourBuildMart may modify prices or introduce promotions.",
            "Pricing errors may be corrected.",
            "Products may be withdrawn from sale.",
          ],
        },
        {
          title: "7. Orders and Acceptance",
          description: "Submitting an order is an offer to purchase. If a paid order is cancelled, the applicable refund will be handled under the Refund Policy.",
          bullets: [
            "YourBuildMart may accept or reject an order.",
            "Purchase quantities may be limited.",
            "Orders suspected of fraud may be cancelled.",
            "Orders from resellers or distributors may be refused where necessary.",
          ],
        },
        {
          title: "8. Account Responsibility",
          description: "Users must protect login credentials, passwords, verification codes, and account access details. Account activity is treated as authorized unless reported otherwise. Notify YourBuildMart immediately about suspected unauthorized activity.",
        },
        {
          title: "9. Third-Party Services",
          description: "The platform may integrate payment gateways, logistics providers, applications, or tools. YourBuildMart is not responsible for third-party content, privacy practices, interruptions, or contractual obligations. Their own terms apply.",
        },
        {
          title: "10. User Submissions and Feedback",
          description: "YourBuildMart may use submitted feedback, suggestions, reviews, comments, ideas, or recommendations for business, marketing, operations, or service improvement without compensation, and may remove inappropriate content.",
          bullets: [
            "You own the content or are authorized to share it.",
            "It does not violate law or third-party rights.",
            "It is not misleading, defamatory, abusive, fraudulent, or offensive.",
          ],
        },
        {
          title: "11. Intellectual Property",
          description: "Logos, trademarks, listings, graphics, images, software, website design, text, and platform content remain the property of YourBuildMart or its licensors and are protected by law. They may not be copied, reproduced, distributed, modified, or commercially exploited without written permission.",
        },
        {
          title: "12. Accuracy of Information",
          description: "Occasional inaccuracies or omissions may relate to specifications, availability, pricing, promotions, delivery timelines, or technical descriptions. YourBuildMart may correct them at any time without notice.",
        },
        {
          title: "13. Prohibited Activities",
          description: "Violations may lead to immediate suspension, account termination, and legal action.",
          bullets: [
            "Unlawful activity or disruption of platform operations.",
            "Reverse engineering, system tampering, or unauthorized data scraping.",
            "Impersonation or submission of false or misleading information.",
            "Distribution of malware, viruses, or harmful code.",
          ],
        },
        {
          title: "14. Disclaimer of Warranties",
          description: "The platform, products, services, and content are provided on an \"as available\" and \"as is\" basis. To the maximum extent permitted by law, YourBuildMart does not warrant continuous availability, error-free operation, uninterrupted access, complete content accuracy, or fitness for a particular purpose beyond statutory obligations. Non-excludable consumer rights remain unaffected.",
        },
        {
          title: "15. Limitation of Liability",
          description: "To the fullest extent permitted by law, YourBuildMart, its directors, officers, employees, affiliates, providers, and representatives are not liable for indirect, incidental, consequential, punitive, or special damages from platform use or unavailability, delays, data loss, business interruption, third-party actions, or product misuse after delivery. Where liability cannot be excluded, it is limited to the maximum extent permitted by law.",
        },
        {
          title: "16. Indemnification",
          description: "Users agree to defend, indemnify, and hold harmless YourBuildMart, VRYBM Private Limited, and their directors, employees, affiliates, agents, contractors, and providers from claims, damages, liabilities, losses, costs, or expenses arising from:",
          bullets: [
            "Violation of these Terms.",
            "Misuse of the platform.",
            "Violation of applicable law.",
            "Infringement of third-party rights.",
          ],
        },
        {
          title: "17. Severability",
          description: "If a competent authority finds a provision invalid, unlawful, or unenforceable, the remaining provisions remain fully valid and enforceable.",
        },
        {
          title: "18. Suspension and Termination",
          description: "YourBuildMart may suspend, restrict, or terminate an account or service where these Terms are violated, fraud is suspected, security is compromised, or legal requirements demand action. Termination does not affect previously accrued rights or obligations.",
        },
        {
          title: "19. Governing Law and Jurisdiction",
          description: "These Terms are governed by the laws of India. Disputes relating to the Terms, platform, products, or services are subject to the exclusive jurisdiction of competent courts in New Delhi, India.",
        },
        {
          title: "20. Amendments to Terms",
          description: "YourBuildMart may revise these Terms. Updated versions become effective when published unless otherwise stated. Continued use after publication constitutes acceptance.",
        },
        {
          title: "21. Contact Information",
          description: "Trade Name: YourBuildMart\nLegal Entity: VRYBM Private Limited\nGSTIN: 07AAJCV7779D1ZS\nOffice: VRYBM Private Limited, 259, FF, Silver Oak Road, Ghitorni, New Delhi - 110030, India\nGrievance Officer: Vivhan Radhu\nPhone: 9899000638\nEmail: contactus@yourbuildmart.com",
        },
      ]}
    />
  );
}
