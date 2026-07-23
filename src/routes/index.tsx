import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Grid2x2, House, ShoppingBag, Truck, ShieldCheck, CreditCard, Clipboard } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, Newsletter } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductRowCarousel } from "@/components/site/ProductRowCarousel";
import { HotDealsSection } from "@/components/site/HotDealsSection";
import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { useShop } from "@/context/shop-context";

import { categories, cementProducts, hardwareProducts, wireProducts, type Product } from "@/components/site/data";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCategories } from "@/hooks/use-catalog";
import { api, resolveApiImage, slugify } from "@/lib/api";
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
      <Navbar className="bg-gradient-to-r from-white via-[#FFF5EA] to-[#FFE7C7]" />
      <MobileTopCategories />
      <Hero />
      <MobileCategoriesSection />
      <Categories />
      <FeaturedProducts />
      <HotDealsSection />
      <DifferenceBand />
      {/* WiresFlashDrop and ShopByCategory disabled on homepage per request */}
      <TestimonialsSection />
      <Newsletter />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[--peach] to-background" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,243,231,0.75) 45%, rgba(255,210,164,0.4) 100%)" }}>
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
            <Link to="/subcategories" className="flex flex-col items-center gap-1 px-2 py-2 text-[10px] font-medium text-foreground">
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
  const source = (liveCategories.length ? liveCategories : categories) as any[];
  let shownList = source.filter((c: any) => c.parentId !== null);
  if (!shownList.length) shownList = source; // fallback if API doesn't return subcategories
  const shown = shownList.slice(0, 10); // show at most 10 categories
  const pageSize = 5;
  const pages: any[] = [];
  for (let i = 0; i < shown.length; i += pageSize) pages.push(shown.slice(i, i + pageSize));
  const [pageIndex, setPageIndex] = useState(0);
  const page = pages[pageIndex] || [];
  return (
    <section className="container-page hidden pb-3 pt-1 md:block md:pb-4 md:pt-3">
      <SectionHeader title="Explore subcategories" align="center" viewAllTo="/subcategories" viewAllText="View All Subcategories" />

      <div className="relative">
        <div className="rounded-2xl border border-[#DEE7E9] bg-white p-4">
          <div className="grid grid-cols-5 gap-4">
            {page.map((c: any, i: number) => {
              const isLive = "id" in c;
              const image = isLive && c.image ? resolveApiImage(c.image) : categories[i % categories.length].icon;
              return (
                <Link key={`cat-${c.name}-${i}`} to={isLive ? "/subcategory/$subcategoryId" : "/products"} params={isLive ? { subcategoryId: slugify(c.name) } : undefined as never} className="group block">
                  <div className="rounded-2xl p-4 text-left hover:bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary p-2">
                        <img src={image} alt={c.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">{c.name}</p>
                        <span className="mt-1 inline-flex items-center rounded-md bg-[#EEF5F6] px-2.5 py-1 text-sm font-medium text-[#5F7177]">View All <ArrowRight className="ml-1 h-3.5 w-3.5" /></span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {pages.length > 1 ? (
          <>
            <button aria-label="Prev" onClick={() => setPageIndex((p) => Math.max(0, p - 1))} className="absolute left-0 top-1/2 z-10 inline-grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button aria-label="Next" onClick={() => setPageIndex((p) => Math.min(pages.length - 1, p + 1))} className="absolute right-0 top-1/2 z-10 inline-grid h-10 w-10 translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        ) : null}
      </div>

      {/* viewAll link is rendered by SectionHeader on desktop */}
    </section>
  );
}

function FeaturedProducts() {
  const products = useQuery({
    queryKey: ["home-featured-products"],
    queryFn: () => api.featuredProducts({ page: 0, size: 15, sortBy: "crtDt", direction: "DESC" }),
  });
  const list = (products.data?.content || []).map(catalogProductToCard);
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
      {/* Removed capsule filter (cement / hardware / wires) per request */}

      <div className="container-page mt-4">
        {products.isLoading ? <p className="text-sm text-muted-foreground">Loading featured products...</p> : null}
        {products.isError ? <p className="text-sm text-red-600">{products.error.message}</p> : null}
        {list.length ? <ProductRowCarousel products={list} /> : null}
      </div>
    </section>
  );
}

function HardwarePriceDrop() {
  return <BackendCategoryStrip match="hardware" title="Price Drop" subtitle="Save big on premium hardware products" className="bg-gradient-to-r from-white via-[#FFF5EA] to-[#FFE7C7] py-10 md:py-12" fallback={hardwareProducts} centerOnMd />;
}

function DifferenceBand() {
  return (
    <section className="flex justify-center ">
      <div className="mx-auto hidden md:block" style={{ width: 1513 }}>
          <div style={{ height: 242, backgroundColor: '#235758', borderRadius: 8 }} className="relative">
            <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center text-center text-white" style={{ paddingLeft: 100, paddingRight: 100 }}>
              <div style={{ width: 660, height: 50, margin: '0 auto' }}>
                <h2 style={{ fontFamily: 'Overlock, serif', fontWeight: 900, fontStyle: 'normal', fontSize: 36, lineHeight: '40px', letterSpacing: 0, color: '#ffffff', textAlign: 'center', margin: 0 }}>How We Are Making Difference</h2>
              </div>

              <div className="mt-6 flex w-full items-center justify-between">
                <div className="flex w-full items-center justify-between">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-20 w-20 rounded-full bg-white p-4 grid place-items-center"><Truck className="h-9 w-9 text-[#235758]" /></div>
                    <div className="text-sm font-medium text-white">Fast Delivery</div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-20 w-20 rounded-full bg-white p-4 grid place-items-center"><ShieldCheck className="h-9 w-9 text-[#235758]" /></div>
                    <div className="text-sm font-medium text-white">Genuine Products</div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-20 w-20 rounded-full bg-white p-4 grid place-items-center"><CreditCard className="h-9 w-9 text-[#235758]" /></div>
                    <div className="text-sm font-medium text-white">Pay on Delivery</div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-20 w-20 rounded-full bg-white p-4 grid place-items-center"><Clipboard className="h-9 w-9 text-[#235758]" /></div>
                    <div className="text-sm font-medium text-white">No Min Order</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Mobile / narrow fallback */}
      <div className="mx-auto w-full max-w-full rounded-lg md:hidden bg-[#235758] py-8">
        <div className="container-page text-center text-white">
          <h2 className="text-2xl">How We Are Making Difference</h2>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="h-12 w-12 rounded-full bg-white p-2 grid place-items-center"><Truck className="h-6 w-6 text-[#235758]" /></div>
            <div className="h-12 w-12 rounded-full bg-white p-2 grid place-items-center"><ShieldCheck className="h-6 w-6 text-[#235758]" /></div>
            <div className="h-12 w-12 rounded-full bg-white p-2 grid place-items-center"><CreditCard className="h-6 w-6 text-[#235758]" /></div>
            <div className="h-12 w-12 rounded-full bg-white p-2 grid place-items-center"><Clipboard className="h-6 w-6 text-[#235758]" /></div>
          </div>
          <div className="mt-3 text-sm font-medium">Fast Delivery · Genuine Products · Pay on Delivery · No Min Order</div>
        </div>
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
  return <section className={className}><div className="container-page"><SectionHeader title={title} subtitle={subtitle} viewAllTo={category ? `/category/${slugify(category.name)}` : "/products"} /><ProductStrip products={cards} centerOnMd={centerOnMd} /></div></section>;
}

function ShopByCategory() {
  const tiles = [
    { title: "Hettich Hardware", sub: "Hinges, Channels at great prices", image: shopHettichImg },
    { title: "Protection from rain, moisture & sun", sub: "Get Dr. Fixit & Asian waterproofing…", image: shopProtectionImg },
    { title: "Fevicol for all your needs", sub: "SR, Marine, Heatx, HI-PER", image: shopFevicolImg },
  ];
  return (
    <section className="bg-orange/95 py-7 text-orange-foreground md:py-8">
      <div className="container-page pt-4">
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
  const shownCategories = liveCategories.length ? liveCategories.filter((c: any) => c.parentId === null) : categories;

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
        <Link to="/subcategories" className="text-[10px] font-medium text-brand">View All</Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {shownCategories.map((c, i) => {
          const isLive = "id" in c;
          const image = isLive && c.image ? resolveApiImage(c.image) : categories[i % categories.length].icon;
          return (
          <Link key={`secondary-${c.name}`} to={isLive && c.parentId !== null ? "/subcategory/$subcategoryId" : isLive ? "/category/$categoryId" : "/subcategories"} params={isLive && c.parentId !== null ? { subcategoryId: slugify(c.name) } : isLive ? { categoryId: slugify(c.name) } : undefined as never} className="shrink-0 text-center">
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

  const pageSize = 5;
  const pages: Product[][] = [];
  for (let i = 0; i < shown.length; i += pageSize) pages.push(shown.slice(i, i + pageSize));
  const [pageIndex, setPageIndex] = useState(0);
  const page = pages[pageIndex] || [];

  return (
    <div>
      <div className={`flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible ${centerOnMd ? "md:flex md:flex-wrap md:justify-center" : "md:grid md:grid-cols-5"}`}>
        {page.map((p) => (
          <div key={p.id} className="min-w-[220px] md:min-w-0">
            <ProductCard product={p} variant="home" />
          </div>
        ))}
      </div>

      {pages.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button aria-label="Prev products" onClick={() => setPageIndex((v) => Math.max(0, v - 1))} className="h-8 w-8 rounded-full bg-white shadow">‹</button>
          <div className="flex items-center gap-2">
            {pages.map((_, i) => (
              <button key={i} onClick={() => setPageIndex(i)} className={`h-2 w-8 rounded-full ${i === pageIndex ? "bg-brand" : "bg-muted-foreground/40"}`}></button>
            ))}
          </div>
          <button aria-label="Next products" onClick={() => setPageIndex((v) => Math.min(pages.length - 1, v + 1))} className="h-8 w-8 rounded-full bg-white shadow">›</button>
        </div>
      ) : null}
    </div>
  );
}
