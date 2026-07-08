import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Grid2x2, House, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, Newsletter } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { useShop } from "@/context/shop-context";

import { categories, cementProducts, hardwareProducts, wireProducts, type Product } from "@/components/site/data";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCategories, useProducts } from "@/hooks/use-catalog";
import { resolveApiImage, slugify } from "@/lib/api";
import { findCategoryByMatches, productsByCategoryFamily } from "@/lib/category-products";
import { catalogProductToCard } from "@/lib/product-adapter";
import heroBags from "@/assets/hero-bags.png";
import differenceBg from "@/assets/Group 1707479903.png";
import differenceBgMobile from "@/assets/Frame 2147230518.png";
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
    <div className="min-h-screen overflow-x-clip bg-background">
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
      <TestimonialsSection />
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

        <div className="fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-[220px] -translate-x-1/2 md:hidden" style={{ top: "clamp(210px, 36vh, 320px)" }}>
          <Link to="/cart" className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-3 py-2 text-brand-foreground shadow-lg">
            <div className="flex -space-x-2">
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-brand bg-white text-[10px] text-brand">1</span>
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-brand bg-white text-[10px] text-brand">2</span>
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-brand bg-white text-[10px] text-brand">3</span>
            </div>
            <span className="text-xs font-medium">View Cart</span>
            <span className="text-xs font-semibold">9</span>
          </Link>
        </div>

        <div className="relative z-10 mt-11 mb-2 flex justify-center md:hidden">
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
  const categoryQuery = useCategories();
  const liveCategories = categoryQuery.data || [];
  return (
    <section className="container-page hidden pb-3 pt-1 md:block md:pb-4 md:pt-1">
      <div className="flex overflow-x-auto rounded-2xl border border-[#DEE7E9] bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(liveCategories.length ? liveCategories : categories).map((c, i) => {
          const isLive = "id" in c;
          const image = isLive && c.image ? resolveApiImage(c.image) : categories[i % categories.length].icon;
          return <Link key={c.name} to={isLive ? "/category/$categoryId" : "/products"} params={isLive ? { categoryId: slugify(c.name) } : undefined as never} className="group relative flex min-w-[280px] items-center gap-3 px-4 py-6">
            <img
              src={image}
              alt={c.name}
              className="h-14 w-14 shrink-0 object-contain transition group-hover:scale-105"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="truncate text-[1.06rem] font-bold text-foreground">{c.name}</p>
              <span className="mt-1 inline-flex items-center rounded-md bg-[#EEF5F6] px-2.5 py-1 text-sm font-medium text-[#5F7177] transition group-hover:-translate-y-0.5 group-hover:bg-[#E3EFF1] group-hover:shadow-sm">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </div>
            {i < (liveCategories.length || categories.length) - 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute right-0 top-1/2 h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-border/65 to-transparent"
              />
            )}
          </Link>;
        })}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const [tab, setTab] = useState<"cement" | "hardware" | "wires">("cement");
  const categoryQuery = useCategories();
  const selectedCategory = categoryQuery.data?.find((category) => {
    const name = category.name.toLowerCase();
    return tab === "wires" ? name.includes("wire") || name.includes("electrical") : name.includes(tab);
  });
  const categoryProducts = useQuery({
    queryKey: ["home-featured", tab, selectedCategory?.id],
    queryFn: () => productsByCategoryFamily({
      categories: categoryQuery.data || [],
      categoryId: selectedCategory!.id,
      params: { page: 0, size: 12, sortBy: "crtDt", direction: "DESC" },
      enrich: false,
    }),
    enabled: Boolean(selectedCategory && categoryQuery.data),
  });
  const fallbackProducts = useProducts({ page: 0, size: 12 });
  const data = categoryProducts.data || fallbackProducts.data;
  const isLoading = categoryProducts.isLoading || fallbackProducts.isLoading;
  const error = categoryProducts.error || fallbackProducts.error;
  const isError = Boolean(error);
  const apiProducts = (data?.content || []).map(catalogProductToCard);
  const list = apiProducts.length
    ? apiProducts
    : tab === "cement" ? cementProducts : tab === "hardware" ? hardwareProducts : wireProducts;
  return (
    <section
      className="relative w-full overflow-hidden pb-7 pt-1 md:pb-8 md:pt-7"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 52%, rgba(255, 126, 17, 0.22) 0%, rgba(255, 184, 108, 0.16) 25%, rgba(255, 184, 108, 0) 48%), linear-gradient(90deg, #FFF9F2 0%, #FFF3E7 50%, #FFF9F2 100%)",
      }}
    >
      <div className="container-page mb-3 flex items-center justify-between md:hidden">
        <div>
          <h2 className="text-xl leading-none text-brand">Featured Products</h2>
          <p className="mt-1 text-[10px] text-muted-foreground">Discover our best-selling construction materials at best prices</p>
        </div>
        <Link to="/products" className="text-[10px] font-medium text-brand">View All Products</Link>
      </div>

      <div className="container-page hidden md:block">
        <SectionHeader
          eyebrow="Hot Deals This Week"
          title="Featured Products"
          subtitle="Discover our best-selling construction materials at unbeatable prices"
          viewAllTo="/products"
          viewAllText="View All Products"
        />
      </div>
      <div className="container-page mt-4 flex items-center justify-center">
        <div className="inline-flex items-center rounded-full border border-[#D8E5E8] bg-[#F7FAFB] p-1 shadow-sm">
          <button
            className={`rounded-full px-6 py-2 text-sm font-medium transition ${
              tab === "cement" ? "bg-[#235758] text-white shadow-sm" : "text-[#5F7177] hover:text-[#235758]"
            }`}
            onClick={() => setTab("cement")}
          >
            Cement
          </button>
          <button
            className={`rounded-full px-6 py-2 text-sm font-medium transition ${
              tab === "hardware" ? "bg-[#235758] text-white shadow-sm" : "text-[#5F7177] hover:text-[#235758]"
            }`}
            onClick={() => setTab("hardware")}
          >
            Hardware
          </button>
          <button
            className={`rounded-full px-6 py-2 text-sm font-medium transition ${
              tab === "wires" ? "bg-[#235758] text-white shadow-sm" : "text-[#5F7177] hover:text-[#235758]"
            }`}
            onClick={() => setTab("wires")}
          >
            Wires
          </button>
        </div>
      </div>

      <div className="container-page mt-4 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-5 md:overflow-visible">
        {isLoading && !list.length ? <p className="text-sm text-muted-foreground">Loading products...</p> : null}
        {isError ? <p className="col-span-full text-sm text-red-600">{error instanceof Error ? error.message : "Products could not be loaded"}</p> : null}
        {list.slice(0, 5).map((p) => (
          <div key={p.id} className="min-w-[220px] md:min-w-0">
            <ProductCard product={p} variant="home" />
          </div>
        ))}
      </div>
    </section>
  );
}

function HardwarePriceDrop() {
  return <BackendCategoryStrip match="hardware" title="Hardware Price Drop" subtitle="Save big on premium hardware products" className="bg-secondary py-6 md:pb-0 md:pt-7" fallback={hardwareProducts} centerOnMd />;
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
  return <BackendCategoryStrip match="wire" title="Wires Flash Drop" subtitle="Premium electrical wires at flash sale prices" className="py-6 md:py-7" fallback={wireProducts} />;
}

function BackendCategoryStrip({ match, title, subtitle, className, fallback, centerOnMd }: { match: string; title: string; subtitle: string; className: string; fallback: Product[]; centerOnMd?: boolean }) {
  const categoriesQuery = useCategories();
  const matches = match === "wire" ? ["wire", "electrical"] : [match];
  const category = categoriesQuery.data ? findCategoryByMatches(categoriesQuery.data, matches) : undefined;
  const products = useQuery({
    queryKey: ["home-category", category?.id],
    queryFn: () => productsByCategoryFamily({
      categories: categoriesQuery.data || [],
      categoryId: category!.id,
      params: { page: 0, size: 8, sortBy: "crtDt", direction: "DESC" },
      enrich: false,
    }),
    enabled: Boolean(category && categoriesQuery.data),
  });
  const cards = products.data?.content.map(catalogProductToCard) || fallback;
  return <section className={className}><div className="container-page"><SectionHeader title={title} subtitle={subtitle} viewAllTo={category ? `/category/${category.id}` : "/products"} /><ProductStrip products={cards} centerOnMd={centerOnMd} /></div></section>;
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

function MobileTopCategories() {
  const categoryQuery = useCategories();
  const liveCategories = categoryQuery.data || [];
  const shownCategories = liveCategories.length ? liveCategories : categories;

  return (
    <section className="container-page pb-1 pt-0 md:hidden">
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shownCategories.map((c, i) => {
          const isLive = "id" in c;
          const image = isLive && c.image ? resolveApiImage(c.image) : categories[i % categories.length].icon;
          return (
          <Link key={`mobile-${c.name}`} to={isLive ? "/category/$categoryId" : "/products"} params={isLive ? { categoryId: slugify(c.name) } : undefined as never} className="shrink-0 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#D8E5E8] bg-[#EEF5F6] p-2">
              <img src={image} alt={c.name} className="h-11 w-11 object-contain" loading="lazy" />
            </div>
            <span className="mt-1.5 block text-xs font-medium text-foreground">{c.name}</span>
          </Link>
          );
        })}
      </div>
    </section>
  );
}

function MobileCategoriesSection() {
  const categoryQuery = useCategories();
  const liveCategories = categoryQuery.data || [];
  const shownCategories = liveCategories.length ? liveCategories : categories;

  return (
    <section className="container-page pb-3 pt-3 md:hidden">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl leading-none text-brand">Categories</h2>
        </div>
        <Link to="/categories" className="text-[10px] font-medium text-brand">View All</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shownCategories.map((c, i) => {
          const isLive = "id" in c;
          const image = isLive && c.image ? resolveApiImage(c.image) : categories[i % categories.length].icon;
          return (
          <Link key={`secondary-${c.name}`} to={isLive ? "/category/$categoryId" : "/categories"} params={isLive ? { categoryId: slugify(c.name) } : undefined as never} className="shrink-0 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#D8E5E8] bg-[#EEF5F6] p-2">
              <img src={image} alt={c.name} className="h-[52px] w-[52px] object-contain" loading="lazy" />
            </div>
            <div className="mt-1.5">
              <span className="block text-xs font-bold text-foreground">{c.name}</span>
              <button className="mt-1 block rounded bg-[#EEF5F6] px-2 py-1 text-xs font-medium text-[#235758] hover:bg-[#E3EFF1]">View All</button>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}

function ProductStrip({ products, centerOnMd }: { products: Product[]; centerOnMd?: boolean }) {
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
    <div className={`flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible ${centerOnMd ? "md:flex md:flex-wrap md:justify-center" : "md:grid md:grid-cols-5"}`}>
      {shown.slice(0, 5).map((p) => (
        <div key={p.id} className="min-w-[220px] md:min-w-0">
          <ProductCard product={p} variant="home" />
        </div>
      ))}
    </div>
  );
}
