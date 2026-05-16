import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { ProductImage } from "@/components/site/ProductImage";
import { categories, cementProducts, hardwareProducts, wireProducts, type Product } from "@/components/site/data";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — YourBuildMart" },
      { name: "description", content: "Browse product categories and spotlight brands." },
    ],
  }),
  component: CategoriesPage,
});

type SidebarCategory = {
  key: string;
  label: string;
  icon: string;
};

const sidebarCategories: SidebarCategory[] = [
  { key: "hot", label: "Hot Deals", icon: categories[0].icon },
  { key: "cement", label: "Cement & Concrete", icon: categories[0].icon },
  { key: "hardware", label: "Hardware", icon: categories[2].icon },
  { key: "electrical", label: "Electrical", icon: categories[4].icon },
  { key: "plumbing", label: "Plumbing", icon: categories[1].icon },
  { key: "flash", label: "Flash Sale", icon: categories[5].icon },
];

function CategoriesPage() {
  const [active, setActive] = useState<string>("hot");

  const filtered = useMemo<Product[]>(() => {
    if (active === "cement") return cementProducts;
    if (active === "hardware") return hardwareProducts;
    if (active === "electrical") return wireProducts;
    if (active === "plumbing") return hardwareProducts;
    if (active === "flash") return [...wireProducts.slice(0, 2), ...cementProducts.slice(0, 2)];
    return [...cementProducts.slice(0, 2), ...wireProducts.slice(0, 2)];
  }, [active]);

  const cardItems = useMemo(() => [...filtered, ...filtered], [filtered]);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Navbar />
      </div>

      <section className="container-page py-4 md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-brand">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg text-brand">Categories</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-brand"><Heart className="h-4 w-4" /></button>
            <button className="grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-brand"><ShoppingBag className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-[72px_1fr] gap-3">
          <aside className="space-y-2">
            {sidebarCategories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                className={`w-full rounded-xl border px-1 py-2 text-center transition ${
                  active === cat.key ? "border-orange bg-orange/10" : "border-border bg-card"
                }`}
              >
                <img src={cat.icon} alt={cat.label} className="mx-auto mb-1 h-8 w-8 object-contain" />
                <span className={`block text-[9px] leading-tight ${active === cat.key ? "text-orange" : "text-foreground"}`}>{cat.label}</span>
              </button>
            ))}
          </aside>

          <div>
            <h2 className="mb-2 text-sm text-brand">{sidebarCategories.find((c) => c.key === active)?.label ?? "Category"}</h2>
            <div className="grid grid-cols-2 gap-2.5 pb-14">
              {cardItems.map((item, idx) => (
                <Link
                  key={`${item.id}-${idx}`}
                  to="/products/$productId"
                  params={{ productId: item.id }}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative bg-[--peach] p-2">
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-[#2F6FB5] px-2 py-0.5 text-[8px] font-semibold text-white">
                      {item.sale}
                    </span>
                    <ProductImage product={item} className="mx-auto h-20 w-20 object-contain" />
                  </div>
                  <div className="p-2">
                    <div className="line-clamp-2 min-h-[24px] text-[8px] text-foreground">{item.name}</div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[10px] font-semibold text-brand">₹{item.price}</span>
                      <span className="text-[8px] text-muted-foreground line-through">₹{item.oldPrice}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto grid w-full max-w-[430px] grid-cols-2 border-t border-border bg-white px-4 py-2">
          <button className="text-xs text-brand">↕ Sort</button>
          <button className="rounded bg-orange py-2 text-xs font-medium text-orange-foreground">Filter</button>
        </div>
      </section>

      <section className="container-page hidden py-10 md:block">
        <h1 className="text-3xl">Categories</h1>
        <p className="mt-2 text-muted-foreground">This page is optimized for mobile. Please open in mobile view for the full experience.</p>
      </section>
    </div>
  );
}
