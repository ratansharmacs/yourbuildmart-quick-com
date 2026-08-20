import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import footerLogo from "@/assets/abh.png";

export function Newsletter() {
  return (
    <section className="container-page py-4 md:py-12">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-4 md:gap-6 md:pt-10 md:flex-row md:items-center">
        <div className="max-w-md">
          <h3 className="text-xl">Subscribe our Newsletter</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet
            elit eu magna.
          </p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-md items-center gap-2 rounded-full border border-border bg-background p-1.5 pl-5"
        >
          <input
            placeholder="Your email address"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-brand-foreground transition hover:opacity-90">
            Subscribe
          </button>
        </form>
        <div className="flex items-center gap-3 self-center md:self-auto">
          <a
            href="#"
            aria-label="Facebook"
            className="grid h-8 w-8 place-items-center rounded-full bg-[#1877F2] text-white"
          >
            <Facebook className="h-4 w-4 fill-current" />
          </a>
          <a
            href="#"
            aria-label="X (formerly Twitter)"
            className="grid h-8 w-8 place-items-center rounded-full bg-black text-sm font-semibold text-white"
          >
            X
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45] text-white"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="grid h-8 w-8 place-items-center rounded-full bg-[#0A66C2] text-white"
          >
            <Linkedin className="h-4 w-4 fill-current" />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const quickLinks = [
    { label: "Shop All", to: "/shop-all" },
    { label: "About Us", to: "/about-us" },
    { label: "Contact us", to: "/contact-us" },
  ] as const;

  const policyLinks = [
    { label: "Terms & Conditions", to: "/terms-and-conditions" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Refund Policy", to: "/refund-policy" },
    { label: "Shipping Policy", to: "/shipping-policy" },
  ] as const;

  const contactLinks = [
    { label: "info@yourbuildmart.com", href: "mailto:info@yourbuildmart.com" },
    { label: "+91 83830 01449", href: "tel:+918383001449" },
    { label: "+91 83284 08325", href: "tel:+918328408325" },
    { label: "Contact us", to: "/contact-us" },
  ] as const;

  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="container-page hidden gap-10 py-14 md:grid md:grid-cols-4">
        <div className="space-y-4">
          <img src={footerLogo} alt="YourBuildMart" className="h-8 w-auto" />
          <p className="text-sm opacity-80">
            Construction materials, trusted brands, and project support in one convenient
            marketplace.
          </p>
          <p className="text-sm opacity-80">info@yourbuildmart.com</p>
        </div>
        <FooterCol title="Quick Links" links={quickLinks} />
        <FooterCol title="Policies" links={policyLinks} />
        <FooterCol title="Contact" links={contactLinks} />
      </div>

      <div className="container-page py-5 md:hidden">
        <div className="flex justify-center pb-4">
          <img src={footerLogo} alt="YourBuildMart" className="h-7 w-auto" />
        </div>
        <div className="space-y-0.5 text-sm">
          <MobileFooterRow title="Quick Links" />
          <MobileFooterRow title="Policies" />
          <MobileFooterRow title="Contact" />
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center">
        <p className="text-sm font-medium tracking-wide text-brand-foreground/90">
          An initiative by VR YBM Private Limited
        </p>
        <p className="mt-1 text-xs text-brand-foreground/60">
          © 2026 YourBuildMart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function MobileFooterRow({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-t border-white/12 py-4">
      <span className="font-medium text-brand-foreground">{title}</span>
      <span className="text-lg leading-none text-brand-foreground">+</span>
    </div>
  );
}

type FooterLinkItem = {
  label: string;
  to?:
    | "/shop-all"
    | "/about-us"
    | "/why-choose-us"
    | "/testimonials"
    | "/faqs"
    | "/contact-us"
    | "/terms-and-conditions"
    | "/privacy-policy"
    | "/refund-policy"
    | "/shipping-policy";
  href?: string;
};

function FooterCol({ title, links }: { title: string; links: readonly FooterLinkItem[] }) {
  return (
    <div>
      <h4 className="font-display text-base text-brand-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm opacity-85">
        {links.map((l) => (
          <li key={l.label}>
            {l.to ? (
              <Link to={l.to} className="transition hover:opacity-100 hover:underline">
                {l.label}
              </Link>
            ) : (
              <a href={l.href} className="transition hover:opacity-100 hover:underline">
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
