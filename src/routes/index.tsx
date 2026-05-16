import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Star, CircleDollarSign, Grid2x2, House, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, Newsletter } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { useShop } from "@/context/shop-context";

import { categories, cementProducts, hardwareProducts, wireProducts, type Product } from "@/components/site/data";
import { useState } from "react";
import heroBags from "@/assets/hero-bags.png";
import differenceBg from "@/assets/Group 1707479903.png";
import differenceBgMobile from "@/assets/Frame 2147230518.png";
import reviewerOne from "@/assets/Icon Strategy.png";
import reviewerTwo from "@/assets/Icon Strategy (1).png";
import reviewerThree from "@/assets/Icon Strategy (2).png";
import shopHettichImg from "@/assets/image 28797.png";
import shopProtectionImg from "@/assets/image 28803.png";
import shopFevicolImg from "@/assets/image 28809.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YourBuildMart — Construction Materials at Wholesale Prices" },
      { name: "description", content: "Bulk cement, hardware, electrical wires & more. Fast delivery, authentic products, no minimum order value." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileTopCategories />
      <Hero />
      <MobileCategoriesSection />
      <Categories />
      <FeaturedProducts />
      <HardwarePriceDrop />
      <DifferenceBand />
      <WiresFlashDrop />
      <ShopByCategory />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[--peach] to-background">
      <div className="container-page pb-2 pt-2 md:hidden">
        <div className="grid gap-2 rounded-3xl bg-gradient-to-br from-orange via-[#f5a23d] to-[#ffd1a4] p-3 text-white shadow-lg">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-orange">
            🔥 Limited Time Offer · Save Up To 30%
          </span>
          <h1 className="text-[31px] leading-[1.1] text-white">Premium Construction Materials</h1>
          <p className="text-xs text-white/95">Experience unbeatable bulk prices on top brands, fast delivery, and authentic products.</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-orange"
            >
              Start Shopping <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/20 px-4 py-2.5 text-xs font-semibold text-white"
            >
              View Catalog
            </Link>
          </div>
        </div>

        <div className="relative z-10 -mt-3 flex justify-center">
          <Link to="/cart" className="flex items-center gap-2 rounded-full bg-brand px-3 py-2 text-brand-foreground shadow-lg">
            <div className="flex -space-x-2">
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-brand bg-white text-[10px] text-brand">1</span>
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-brand bg-white text-[10px] text-brand">2</span>
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-brand bg-white text-[10px] text-brand">3</span>
            </div>
            <span className="text-xs font-medium">View Cart</span>
            <span className="text-xs font-semibold">9</span>
          </Link>
        </div>

        <div className="relative z-10 -mt-1 mb-2 flex justify-center md:hidden">
          <div className="grid w-full max-w-[393px] grid-cols-3 rounded-full bg-[#ffd3a5]/95 p-1.5 text-center shadow-md backdrop-blur">
            <button className="flex flex-col items-center gap-1 rounded-full bg-white px-2 py-2 text-[10px] font-medium text-orange">
              <House className="h-4 w-4" />
              Home
            </button>
            <Link to="/categories" className="flex flex-col items-center gap-1 px-2 py-2 text-[10px] font-medium text-foreground">
              <Grid2x2 className="h-4 w-4" />
              Categories
            </Link>
            <button className="flex flex-col items-center gap-1 px-2 py-2 text-[10px] font-medium text-foreground">
              <ShoppingBag className="h-4 w-4" />
              Buy Again
            </button>
          </div>
        </div>
      </div>

      <div className="container-page hidden items-center gap-8 pb-2 pt-5 md:grid md:grid-cols-2 md:py-6">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-orange/15 px-3 py-1 text-xs font-medium text-orange">
            🔥 Limited Time Offer · Save Up To 30%
          </span>
          <h1 className="text-4xl leading-tight md:text-6xl">
            Premium Construction<br />Materials
          </h1>
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            Experience unbeatable bulk prices on top brands. Fast delivery, authentic products, and exceptional service guaranteed.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-medium text-orange-foreground hover:opacity-90"
            >
              Start Shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-brand bg-background px-5 py-2.5 text-sm font-medium text-brand hover:bg-brand hover:text-brand-foreground"
            >
              View Catalog
            </Link>
          </div>
          <div className="flex gap-10 pt-2">
            <Stat value="500+" label="Products" />
            <Stat value="10K+" label="Happy Clients" />
            <Stat value="24/7" label="Support" />
          </div>
        </div>
        <div className="relative">
          <img
            src={heroBags}
            alt="Premium construction materials — Birla White, UltraTech, Birla Putty"
            className="mx-auto w-full max-w-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-brand">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Categories() {
  return (
    <section className="container-page hidden pb-3 pt-1 md:block md:pb-4 md:pt-1">
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
        {categories.map((c) => (
          <Link key={c.name} to="/products" className="group flex flex-col items-center gap-2">
            <div className="grid h-20 w-20 place-items-center rounded-2xl border border-border bg-card p-2 transition group-hover:scale-105 md:h-24 md:w-24">
              <img
                src={c.icon}
                alt={c.name}
                className="h-12 w-12 object-contain md:h-14 md:w-14"
                loading="lazy"
              />
            </div>
            <span className="text-xs font-medium text-foreground">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [tab, setTab] = useState<"cement" | "hardware" | "wires">("cement");
  const list = tab === "cement" ? cementProducts : tab === "hardware" ? hardwareProducts : wireProducts;
  return (
    <section
      className="container-page relative overflow-hidden rounded-2xl pb-7 pt-1 md:pb-8 md:pt-7"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(250, 237, 225, 0.5) 0%, rgba(250, 237, 225, 0) 36%), radial-gradient(circle at 50% 50%, rgba(250, 237, 225, 0.42) 0%, rgba(250, 237, 225, 0) 40%), radial-gradient(circle at 80% 50%, rgba(250, 237, 225, 0.5) 0%, rgba(250, 237, 225, 0) 36%), linear-gradient(90deg, #FFFFFF 0%, #FAEDE1 50%, #FFFFFF 100%)",
      }}
    >
      <div className="mb-3 rounded-2xl border border-orange/20 bg-[--peach] p-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4 text-orange" />
            <div>
              <p className="text-xs font-semibold text-foreground">Get 2X Cashback + 0 Joining Fee</p>
              <p className="text-[10px] text-muted-foreground">Unlock exclusive rewards</p>
            </div>
          </div>
          <button className="rounded-full bg-brand px-3 py-1.5 text-[10px] font-semibold text-brand-foreground">Join Free</button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between md:hidden">
        <div>
          <h2 className="text-xl leading-none text-brand">Featured Products</h2>
          <p className="mt-1 text-[10px] text-muted-foreground">Discover our best-selling construction materials at best prices</p>
        </div>
        <Link to="/products" className="text-[10px] font-medium text-brand">View All</Link>
      </div>

      <div className="hidden md:block">
        <SectionHeader
          eyebrow="Hot Deals This Week"
          title="Featured Products"
          subtitle="Discover our best-selling construction materials at unbeatable prices"
          viewAllTo="/products"
        />
      </div>
      <div className="mb-4 flex justify-center md:mb-6">
        <div className="inline-flex rounded-full border border-border bg-card p-1">
          {(["cement", "hardware", "wires"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition md:px-5 md:text-sm ${
                tab === t ? "bg-brand text-brand-foreground" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

        <ProductStrip products={list} />
    </section>
  );
}

function HardwarePriceDrop() {
  return (
      <section className="bg-secondary py-6 md:pb-0 md:pt-7">
      <div className="container-page">
        <SectionHeader title="Hardware Price Drop" subtitle="Save big on premium hardware products" viewAllTo="/products" />
          <ProductStrip products={hardwareProducts} />
      </div>
    </section>
  );
}

function DifferenceBand() {
  return (
    <section className="pb-6 pt-0 md:pb-10 md:pt-0">
      <div className="w-full">
        <img src={differenceBgMobile} alt="How We Are Making Difference" className="block w-full md:hidden" />
        <img src={differenceBg} alt="How We Are Making Difference" className="hidden w-full md:block" />
      </div>
    </section>
  );
}

function WiresFlashDrop() {
  return (
    <section className="container-page py-6 md:py-7">
      <SectionHeader title="Wires Flash Drop" subtitle="Premium electrical wires at flash sale prices" viewAllTo="/products" />
      <ProductStrip products={wireProducts} />
    </section>
  );
}

function ShopByCategory() {
  const tiles = [
    { title: "Hettich Hardware", sub: "Hinges, Channels at great prices", image: shopHettichImg },
    { title: "Protection from rain, moisture & sun", sub: "Get Dr. Fixit & Asian waterproofing…", image: shopProtectionImg },
    { title: "Fevicol for all your needs", sub: "SR, Marine, Heatx, HI-PER", image: shopFevicolImg },
  ];
  return (
    <section className="bg-orange/95 py-7 text-orange-foreground md:py-8">
      <div className="container-page">
        <h2 className="mb-2 text-center text-3xl text-orange-foreground">Shop By Category</h2>
        <p className="mb-5 text-center text-sm opacity-90">Explore our wide range of construction materials and hardware</p>

        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible">
          {tiles.map((t) => (
            <div key={t.title} className="min-w-[280px] rounded-2xl bg-card p-4 text-foreground md:min-w-0 md:p-6">
              <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-xl md:h-52">
                <img src={t.image} alt={t.title} className="h-auto w-full rounded-xl" />
              </div>
              <h3 className="text-base">{t.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t.sub}</p>
              <Link to="/products" className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange px-4 py-1.5 text-xs font-medium text-orange">
                Shop Now <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Ava A.", role: "Marketing Manager", image: reviewerOne, quote: "I've been consistently impressed with the quality of product provided by this company. They have exceeded my expectations and delivered exceptional results." },
    { name: "Ava A.", role: "Marketing Manager", image: reviewerTwo, quote: "I've been consistently impressed with the quality of product provided by this company. They have exceeded my expectations and delivered exceptional results." },
    { name: "Ava A.", role: "Marketing Manager", image: reviewerThree, quote: "I've been consistently impressed with the quality of product provided by this company. They have exceeded my expectations and delivered exceptional results." },
    { name: "Noah K.", role: "Project Engineer", image: reviewerOne, quote: "Consistent quality and reliable delivery timeline. The product support team is helpful and responsive." },
  ];
  const [activeReview, setActiveReview] = useState(0);

  return (
    <section className="container-page pb-2 pt-4 md:py-8">
      <SectionHeader title="What Our Client Say About Us" subtitle="Real feedback from our valued customers" viewAllTo="/products" />

      <div className="relative md:hidden">
        <button
          onClick={() => setActiveReview((prev) => (prev - 1 + items.length) % items.length)}
          className="absolute left-[-12px] top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-orange text-orange-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="mx-auto w-full max-w-[290px] rounded-2xl border border-border bg-card px-6 py-6 min-h-[312px]">
          <img src={items[activeReview].image} alt={items[activeReview].name} className="mx-auto mb-4 h-16 w-16 rounded-full " />
          <div className="mb-3 flex justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />)}
          </div>
          <p className="line-clamp-5 text-center text-sm text-muted-foreground">"{items[activeReview].quote}"</p>
          <div className="mt-4 text-center">
            <div className="font-display text-base text-brand">{items[activeReview].name}</div>
            <div className="text-xs text-muted-foreground">{items[activeReview].role}</div>
          </div>
        </div>
        <button
          onClick={() => setActiveReview((prev) => (prev + 1) % items.length)}
          className="absolute right-[-12px] top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-orange text-orange-foreground"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="relative hidden md:block">
        <button className="absolute left-[-42px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-orange text-orange-foreground md:grid">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="grid gap-4 md:grid-cols-4">
          {items.map((t) => (
            <div key={`${t.name}-${t.image}`} className="mx-auto w-full max-w-[290px] rounded-2xl border border-border bg-card px-5 py-5">
              <img src={t.image} alt={t.name} className="mx-auto mb-4 h-16 w-16 rounded-full " />
              <div className="mb-3 flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />)}
              </div>
              <p className="line-clamp-4 text-center text-sm text-muted-foreground">"{t.quote}"</p>
              <div className="mt-6 text-center">
                <div className="font-display text-base text-brand">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="absolute right-[-42px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-orange text-orange-foreground md:grid">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function MobileTopCategories() {
  return (
    <section className="container-page pb-1 pt-0 md:hidden">
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <Link key={`mobile-${c.name}`} to="/products" className="shrink-0 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-border bg-card p-1.5">
              <img src={c.icon} alt={c.name} className="h-7 w-7 object-contain" loading="lazy" />
            </div>
            <span className="mt-1 block text-[10px] font-medium text-foreground">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MobileCategoriesSection() {
  return (
    <section className="container-page pb-3 pt-3 md:hidden">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl leading-none text-brand">Categories</h2>
        </div>
        <Link to="/categories" className="text-[10px] font-medium text-brand">View All</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <Link key={`secondary-${c.name}`} to="/categories" className="shrink-0 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-border bg-card p-1.5">
              <img src={c.icon} alt={c.name} className="h-7 w-7 object-contain" loading="lazy" />
            </div>
            <span className="mt-1 block text-[10px] font-medium text-foreground">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductStrip({ products }: { products: Product[] }) {
  const { searchTerm } = useShop();
  const term = searchTerm.trim().toLowerCase();
  const shown = products.filter((p) => {
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.sale.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
      {shown.map((p) => (
        <div key={p.id} className="min-w-[250px] md:min-w-0">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
