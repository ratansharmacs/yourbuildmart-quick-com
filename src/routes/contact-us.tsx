import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Footer, Newsletter } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { api } from "@/lib/api";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us - YourBuildMart" },
      { name: "description", content: "Contact YourBuildMart for sales, support, and project-specific construction material requirements." },
    ],
  }),
  component: ContactUsPage,
});

function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-to-b from-[--peach] to-background py-10 md:py-12">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h1 className="text-4xl md:text-5xl">Contact Us</h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Tell us what you need and our team will get back with pricing, availability, and delivery timelines.
            </p>

            <div className="mt-6 space-y-4 text-sm text-foreground/90">
              <p>
                <span className="font-semibold text-brand">Email:</span> care@yourbuildmart.com
              </p>
              <p>
                <span className="font-semibold text-brand">Phone:</span> +91 9313984685
              </p>
              <p>
                <span className="font-semibold text-brand">Hours:</span> Mon-Sat, 9:00 AM to 7:00 PM
              </p>
              <p>
                <span className="font-semibold text-brand">Address:</span> YourBuildMart Supply Hub, Lucknow, Uttar Pradesh
              </p>
            </div>
          </div>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError("");
              const form = new FormData(event.currentTarget);
              try {
                await api.contact({
                  name: String(form.get("name")),
                  email: String(form.get("email")),
                  message: String(form.get("message")),
                });
                event.currentTarget.reset();
                setSubmitted(true);
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "Could not send your message");
              } finally {
                setLoading(false);
              }
            }}
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            <h2 className="text-2xl">Send A Message</h2>
            <p className="mt-2 text-sm text-muted-foreground">We usually respond within one business day.</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-foreground">Full Name</span>
                <input name="name" required minLength={2} maxLength={100} className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none ring-brand/30 focus:ring-2" placeholder="Enter your name" />
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-foreground">Email Address</span>
                <input name="email" type="email" required className="h-11 w-full rounded-lg border border-border bg-background px-3 outline-none ring-brand/30 focus:ring-2" placeholder="Enter your email" />
              </label>
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-foreground">Project Requirement</span>
                <textarea name="message" required minLength={10} maxLength={2000} rows={5} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none ring-brand/30 focus:ring-2" placeholder="Share your product list, quantities, and delivery location" />
              </label>
            </div>

            <button disabled={loading} type="submit" className="mt-5 inline-flex items-center justify-center rounded-full bg-orange px-6 py-2.5 text-sm font-medium text-orange-foreground transition hover:opacity-90 disabled:opacity-50">
              {loading ? "Sending..." : "Submit Inquiry"}
            </button>

            {submitted ? (
              <p className="mt-3 text-sm text-brand">Thanks! Your request has been received and our team will contact you shortly.</p>
            ) : null}
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </form>
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}
