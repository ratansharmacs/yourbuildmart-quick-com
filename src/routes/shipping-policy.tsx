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
      subtitle="YourBuildMart is committed to providing fast and efficient delivery services across serviceable regions."
      sections={[
        {
          title: "Order Confirmation and Processing",
          description: "Orders are typically reviewed, confirmed, and dispatched within approximately 20 minutes of successful order placement, subject to operational conditions and product availability.",
        },
        {
          title: "Delivery Timelines",
          description: "Orders placed between 7:00 AM and 7:00 PM may be delivered within the selected service window, depending on service location. These timelines apply only to serviceable pincodes across Delhi NCR. Orders outside operational hours are generally scheduled for the next working day.",
          bullets: ["60 minutes", "90 minutes", "120 minutes"],
        },
        {
          title: "Service Availability",
          description: "YourBuildMart currently delivers to eligible and serviceable pincodes across Delhi NCR. Customers can check availability and estimated delivery timelines during checkout or through the platform's serviceability check.",
        },
        {
          title: "Delivery Charges",
          description: "Delivery charges depend on order value and delivery distance.",
          bullets: [
            "Orders up to ₹9,999: applicable charges are calculated using the distance between the fulfilment location and delivery address.",
            "Orders above ₹10,000: complimentary delivery within serviceable areas.",
          ],
        },
        {
          title: "Delivery Operating Hours",
          description: "Deliveries operate from 7:00 AM to 7:00 PM on operational days. Schedules may be affected by weather, traffic restrictions, public holidays, government directives, or circumstances beyond our reasonable control.",
        },
        {
          title: "Order Tracking",
          description: "Mobile application orders can be monitored through the app's real-time tracking feature. Website customers will receive a live tracking link through WhatsApp.",
        },
        {
          title: "Returns and Refunds",
          description: "All return, replacement, and refund requests are governed by the YourBuildMart Refund Policy. Customers should review that policy before ordering.",
        },
        {
          title: "Undeliverable Orders",
          description: "Where re-delivery is required because of customer-related issues, additional delivery charges may apply. Reasonable efforts will be made to contact the customer before cancellation or another delivery attempt.",
          bullets: [
            "Incorrect or incomplete address information.",
            "Customer unavailability.",
            "Restricted site access.",
            "Failure to respond to delivery attempts.",
          ],
        },
        {
          title: "Force Majeure",
          description: "YourBuildMart is not responsible for delays or inability to fulfil deliveries caused by events beyond its reasonable control. Delivery commitments may be adjusted accordingly.",
          bullets: [
            "Natural disasters or severe weather.",
            "Government restrictions or civil disturbances.",
            "Labour disruptions or transportation failures.",
            "Technical outages.",
          ],
        },
        {
          title: "Contact Us",
          description: "For questions about shipping, delivery, or logistics support, contact help@yourbuildmart.com.\n\nTrade Name: YourBuildMart\nLegal Entity: VRYBM Private Limited",
        },
      ]}
    />
  );
}
