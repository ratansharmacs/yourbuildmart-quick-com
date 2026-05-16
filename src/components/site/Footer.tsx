import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import footerLogo from "@/assets/abh.png";

export function Newsletter() {
  return (
    <section className="container-page py-4 md:py-12">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-4 md:gap-6 md:pt-10 md:flex-row md:items-center">
        <div className="max-w-md">
          <h3 className="text-xl">Subscribe our Newsletter</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.
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
          <a href="#" aria-label="Facebook" className="grid h-7 w-7 place-items-center rounded-full bg-[#235758] text-white"><Facebook className="h-3.5 w-3.5" /></a>
          <a href="#" aria-label="Twitter" className="grid h-7 w-7 place-items-center rounded-full bg-[#235758] text-white"><Twitter className="h-3.5 w-3.5" /></a>
          <a href="#" aria-label="Instagram" className="grid h-7 w-7 place-items-center rounded-full bg-[#235758] text-white"><Instagram className="h-3.5 w-3.5" /></a>
          <a href="#" aria-label="LinkedIn" className="grid h-7 w-7 place-items-center rounded-full bg-[#235758] text-white"><Linkedin className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="container-page hidden gap-10 py-14 md:grid md:grid-cols-4">
        <div className="space-y-4">
          <img src={footerLogo} alt="YourBuildMart" className="h-8 w-auto" />
          <p className="text-sm opacity-80">
            Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
          </p>
          <p className="text-sm opacity-80">(219) 555-0114 or Proxy@gmail.com</p>
        </div>
        <FooterCol title="Quick Links" links={["Shop All", "About Us", "Why Choose Us", "Testimonials", "FAQs", "Contact us"]} />
        <FooterCol title="Policies" links={["Terms & Conditions", "Privacy Policy", "Refund Policy", "Shipping Policy"]} />
        <FooterCol
          title="Contact"
          links={["care@yourbuildmart.com", "+91 9313984685", "Why Choose Us", "Testimonials", "FAQs", "Contact us"]}
        />
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

      <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © 2026 YourBuildMart. All rights reserved.
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

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-display text-base text-brand-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm opacity-85">
        {links.map((l) => (
          <li key={l}>
            <Link to="/" className="transition hover:opacity-100 hover:underline">{l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
