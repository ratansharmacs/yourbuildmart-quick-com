import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer, Newsletter } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile - YourBuildMart" },
      { name: "description", content: "Manage your profile, saved addresses, and order preferences on YourBuildMart." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-to-b from-[--peach] to-background py-10 md:py-12">
        <div className="container-page grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-border bg-card p-5">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand text-lg font-semibold text-brand-foreground">YB</div>
            <h1 className="mt-3 text-2xl">My Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">yourbuildmart.customer@example.com</p>
            <nav className="mt-5 space-y-2 text-sm">
              <Link to="/profile" className="block rounded-lg bg-secondary px-3 py-2 text-foreground">Account Overview</Link>
              <Link to="/cart" className="block rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">My Cart</Link>
              <Link to="/shop-all" className="block rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">Browse Products</Link>
              <Link to="/contact-us" className="block rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground">Support</Link>
            </nav>
          </aside>

          <div className="space-y-4">
            <article className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <h2 className="text-2xl">Account Details</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <ProfileField label="Full Name" value="YourBuildMart Customer" />
                <ProfileField label="Phone" value="+91 9313984685" />
                <ProfileField label="Email" value="yourbuildmart.customer@example.com" />
                <ProfileField label="Preferred City" value="Lucknow" />
              </div>
            </article>

            <article className="rounded-2xl border border-border bg-card p-5 md:p-6">
              <h2 className="text-2xl">Saved Address</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sector 12, Transport Nagar, Lucknow, Uttar Pradesh - 226012
              </p>
            </article>
          </div>
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
