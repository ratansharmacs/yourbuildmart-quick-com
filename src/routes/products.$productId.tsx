import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Share2, ShoppingBag, Star, ChevronDown, ArrowRight, Bookmark } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, Newsletter } from "@/components/site/Footer";
import { SectionHeader } from "@/components/site/SectionHeader";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";
import { cementProducts, hardwareProducts, wireProducts } from "@/components/site/data";
import { useShop } from "@/context/shop-context";

export const Route = createFileRoute("/products/$productId")({
  head: () => ({
    meta: [
      { title: "Polycab FRLS-H Single Core Wire — YourBuildMart" },
      { name: "description", content: "Polycab FRLS-H single core wire — premium electrical wire at wholesale price." },
    ],
  }),
  component: ProductDetailPage,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center">Product not found.</div>
  ),
});

function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const product =
    [...wireProducts, ...cementProducts, ...hardwareProducts].find((p) => p.id === productId) ?? wireProducts[0];

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("1.5 Sqmm");
  const [color, setColor] = useState("Black");
  const [pack, setPack] = useState("Pack of 2");
  const { addToCart } = useShop();
  const similar = product.category === "cement" ? cementProducts : product.category === "hardware" ? hardwareProducts : wireProducts;

  const sizes = ["1.5 Sqmm", "1 Sqmm", "0.75 Sqmm", "10 Sqmm", "2.5 Sqmm"];
  const colors = ["Black", "Blue", "Green", "Red", "White", "Yellow"];
  const relatedCategories = [
    "Multicore Cables",
    "Submersible Cables",
    "Solar Cables",
    "Communication & Networking Cables",
    "Coaxial Cables",
  ];
  const packs = [
    { label: "Pack of 2", price: 799, save: "Save 8%" },
    { label: "Pack of 3", price: 799, save: "Save 8%" },
    { label: "Pack of 5", price: 799, save: "Save 8%" },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-background pb-24 md:pb-0">
      <Navbar />

      {/* Gallery + Info */}
      <section className="container-page grid gap-4 py-4 md:gap-10 md:py-10 md:grid-cols-2">
        <Gallery product={product} />
        <div className="space-y-5">
          <div className="md:hidden">
            <h1 className="text-[30px] leading-tight text-brand">{product.name}</h1>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md bg-orange px-1.5 py-0.5 font-medium text-orange-foreground">
                  4.6 <Star className="h-3 w-3 fill-orange-foreground text-orange-foreground" />
                </span>
                <span>|</span>
                <span>5 Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="grid h-7 w-7 place-items-center rounded-full bg-[#C3E4E5] text-[#235758]"><Heart className="h-3.5 w-3.5" /></button>
                <button className="grid h-7 w-7 place-items-center rounded-full bg-[#C3E4E5] text-[#235758]"><Share2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-muted-foreground line-through">MRP ₹{product.oldPrice}</span>
              <span className="text-lg font-bold text-[#235758]">₹{product.price}</span>
              <span className="font-medium text-[#1F8A70]">(22% off)</span>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Quantity</p>
                <div className="flex items-center rounded-full border border-border bg-card">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-8 w-8 place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-[30px] leading-none text-brand">₹{Math.round(product.price * qty)}</p>
              </div>
            </div>
          </div>

          <div className="hidden space-y-5 md:block">
            <h1 className="text-3xl md:text-4xl">{product.name}</h1>
            <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 md:gap-x-5">
              <div className="text-[34px] font-bold leading-[100%] tracking-[0%] text-[#235758]" style={{ fontFamily: "Inter" }}>₹299</div>
              <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#C3E4E5] px-2.5 py-1 text-xs font-semibold text-[#235758]">
                  <Star className="h-3.5 w-3.5 fill-[#235758] text-[#235758]" /> 4.8
                </span>
                <span className="inline-flex items-center rounded-full bg-[#C3E4E5] px-2.5 py-1 text-xs font-semibold text-[#235758]">67 Reviews</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#C3E4E5] px-2.5 py-1 text-xs font-semibold text-[#235758]">♥ 109</span>
                <button className="grid h-7 w-7 place-items-center rounded-full bg-[#C3E4E5] text-[#235758]"><Bookmark className="h-3.5 w-3.5" /></button>
                <button className="grid h-7 w-7 place-items-center rounded-full bg-[#C3E4E5] text-[#235758]"><Share2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="h-[25px] w-[51px] text-[21px] font-normal leading-[100%] tracking-[0%] line-through" style={{ fontFamily: "Inter" }}>₹399</div>
              <p><span className="font-semibold text-[#235758]">93%</span> of buyers have recommended this.</p>
            </div>

            <Selector label="Normal Size" options={sizes} value={size} onChange={setSize} />
            <Selector label="Color" options={colors} value={color} onChange={setColor} />

            <div>
              <div className="mb-2 text-sm font-medium text-foreground">Buy More & Save More</div>
              <div className="flex flex-wrap gap-3">
                {packs.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setPack(p.label)}
                    className={`relative min-h-[100px] min-w-[132px] rounded-lg border px-5 pb-3.5 pt-6 text-center transition ${
                      pack === p.label ? "border-brand bg-secondary" : "border-border bg-card"
                    }`}
                  >
                    {p.label !== "Pack of 2" && (
                      <span className="absolute left-1/2 top-0 inline-flex h-5 w-[80%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C3E4E5] px-2 text-[10px] font-medium text-[#235758]">
                        {p.save}
                      </span>
                    )}
                    <div className="mt-2 text-sm font-medium">{p.label}</div>
                    <div className="mt-1 flex items-baseline justify-center gap-2">
                      <span className="font-display text-base text-brand">₹{p.price}</span>
                      <span className="text-xs text-muted-foreground line-through">₹1047</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-border bg-card">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-10 place-items-center"><Minus className="h-4 w-4" /></button>
                <span className="w-10 text-center text-base font-medium">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="grid h-12 w-10 place-items-center"><Plus className="h-4 w-4" /></button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-base font-medium text-brand-foreground hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
            </div>
          </div>

          <Disclosure title="About This Product">
            FAB 1.5 Sqmm Single Core Black FR PVC CCS Copper Insulated House Wire — Length 91m. FRLS-H sheath for fire safety.
          </Disclosure>
          <Disclosure title="Key Features">
            Heat resistant, low smoke, halogen-free, ISI marked, suitable for residential and commercial wiring.
          </Disclosure>
        </div>
      </section>

      {/* Similar items */}
      <section className="bg-secondary py-14">
        <div className="container-page">
          <SectionHeader title="Similar Items You Might Also Like" subtitle="Premium electrical wires at flash sale prices" viewAllTo="/products" />
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
            {similar.map((p) => (
              <div key={p.id} className="min-w-[250px] md:min-w-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container-page py-14">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl">Reviews & Ratings</h2>
            <p className="mt-1 text-xs text-muted-foreground">FAB 1.5 Sqmm Single Core Black FR PVC CCS Copper Insulated House Wire</p>
          </div>
          <button className="self-start rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand">WRITE A REVIEW</button>
        </div>

        <div className="mt-6 grid items-start gap-10 md:grid-cols-[200px_1fr]">
          <div>
            <div className="font-display text-5xl text-foreground">4.6 <Star className="inline h-6 w-6 fill-orange text-orange" /></div>
            <p className="mt-2 text-xs text-muted-foreground">Average Rating based on 36 ratings and 35 reviews</p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-xs">
                <span className="w-3 text-foreground">{s}</span>
                <div className="h-1.5 flex-1 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${[80, 25, 12, 0, 0][i]}%` }} />
                </div>
                <span className="w-16 text-right text-muted-foreground">{[19842, 5159, 2729, 599, 0][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {[
            { name: "Ajay", date: "March 13, 2026", title: "Good Quality", body: "The quality of the wire is good and it is copper wire, buyers can trust it.", rating: 5 },
            { name: "Zokir", date: "March 10, 2026", title: "Great value for money", body: "Excellent product, would recommend to others.", rating: 4 },
          ].map((r) => (
            <div key={r.name} className="border-t border-border pt-6">
              <div className="mb-2 flex items-center gap-1 text-orange">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-orange" : ""}`} />)}
                <span className="ml-2 text-xs text-brand">Verified Purchase</span>
              </div>
              <div className="text-sm font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.date}</div>
              <p className="mt-2 text-sm font-medium text-foreground">{r.title}</p>
              <p className="text-sm text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-brand py-14 text-brand-foreground">
        <div className="container-page max-w-[1120px]">
          <h2 className="mb-6 text-center text-3xl text-brand-foreground md:mb-8">Do you have questions?</h2>
          <div className="space-y-3">
            {[
              { q: "What is your return policy?", a: "We offer a 15-day return window for a full refund or exchange on unused items. Returns must include original packaging and proof of purchase for processing." },
              { q: "Do you offer international shipping?", a: "Currently we ship within India only." },
              { q: "What if I receive a damaged or defective product?", a: "Contact support within 48 hours and we'll arrange a replacement." },
              { q: "Are the product colors on the website accurate?", a: "Colors are as accurate as possible but may vary slightly across screens." },
            ].map((f) => (
              <details key={f.q} className="group rounded-lg bg-white/5 p-4 backdrop-blur md:rounded-none md:border-b md:border-white/20 md:bg-transparent md:p-0 md:backdrop-blur-none">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-medium md:py-3">
                  {f.q}
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm opacity-85 md:mt-0 md:pb-3 md:pr-10">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
            <p className="text-sm opacity-85">My question is not here.</p>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2 text-sm font-medium text-orange-foreground">
              Contact Us <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeader title="Explore House Wires from Top Brands" subtitle="Premium electrical wires at best sale prices" viewAllTo="/products" />
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
          {wireProducts.map((p) => (
            <div key={p.id} className="min-w-[250px] md:min-w-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-14">
        <SectionHeader title="Best Of Your Build Mart" subtitle="Premium products at great value" viewAllTo="/products" />
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
          {hardwareProducts.map((p) => (
            <div key={p.id} className="min-w-[250px] md:min-w-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Bought */}
      <section className="container-page py-14">
        <SectionHeader title="Frequently Bought Together" subtitle="Frequently Bought Together with the visited product" viewAllTo="/products" />
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
          {hardwareProducts.map((p) => (
            <div key={p.id} className="min-w-[250px] md:min-w-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-orange py-5">
        <div className="container-page">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white md:text-base">Shop By Related Categories</h2>
            <Link to="/products" className="text-xs text-white/90 hover:text-white md:text-sm">View All</Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((category) => (
              <button
                key={category}
                className="rounded-full border border-white bg-transparent px-3 py-1 text-[10px] font-medium text-white md:px-3.5 md:py-1.5 md:text-xs"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeader title="Recently Viewed" subtitle="Continue where you left off" viewAllTo="/products" />
        <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
          {wireProducts.map((p) => (
            <div key={`recent-${p.id}`} className="min-w-[250px] md:min-w-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="container-page flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground">Total</p>
            <p className="truncate text-lg font-semibold text-brand">₹{Math.round(product.price * qty)}</p>
          </div>
          <button
            onClick={() => addToCart(product, qty)}
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-brand-foreground"
          >
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </div>
  );
}

function Gallery({ product }: { product: import("@/components/site/data").Product }) {
  return (
    <div>
      <div className="rounded-2xl bg-white p-4 md:bg-[--peach] md:p-6">
        <ProductImage product={product} className="mx-auto aspect-square w-full max-w-md" />
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 md:hidden">
        <span className="h-1.5 w-1.5 rounded-full bg-brand/40" />
        <span className="h-1.5 w-4 rounded-full bg-brand" />
        <span className="h-1.5 w-1.5 rounded-full bg-brand/40" />
      </div>
      <div className="mt-4 hidden items-center gap-3 md:flex">
        <button className="grid h-9 w-9 place-items-center rounded-full border border-border"><ChevronLeft className="h-4 w-4" /></button>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid h-16 w-16 place-items-center rounded-lg border border-border bg-[--peach]">
            <ProductImage product={product} className="h-12 w-12" />
          </div>
        ))}
        <button className="grid h-9 w-9 place-items-center rounded-full border border-border"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

function Selector({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-foreground">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              value === o ? "border-orange bg-orange/10 text-orange" : "border-border bg-card text-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-t border-border py-3">
      <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
        {title}
        <Plus className="h-4 w-4 transition group-open:rotate-45" />
      </summary>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </details>
  );
}
