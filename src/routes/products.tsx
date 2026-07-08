import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, Newsletter } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useShop } from "@/context/shop-context";
import { useProducts } from "@/hooks/use-catalog";
import { catalogProductToCard } from "@/lib/product-adapter";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Cement — YourBuildMart" },
      { name: "description", content: "Maha, UltraTech, Ramco, Birla PPC & OPC cement in Bangalore at wholesale prices." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { searchTerm, sortOption, setSortOption, filterOption, setFilterOption } = useShop();
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  if (pathname.startsWith("/products/")) {
    return <Outlet />;
  }

  const direction = sortOption === "price-low-high" ? "ASC" : "DESC";
  const sortBy = sortOption.startsWith("price") ? "basePrice" : "crtDt";
  const productsQuery = useProducts({ page: 0, size: 48, search: searchTerm, sortBy, direction });
  const baseGrid = useMemo(
    () => (productsQuery.data?.content || []).map(catalogProductToCard),
    [productsQuery.data],
  );
  const grid = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let next = [...baseGrid].filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.sale.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      if (filterOption === "ultratech") return p.brand.toLowerCase().includes("ultratech");
      if (filterOption === "acc") return p.brand.toLowerCase().includes("acc");
      if (filterOption === "rating4plus") return p.rating >= 4;
      return true;
    });

    if (sortOption === "price-low-high") {
      next.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
      next.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating-high") {
      next.sort((a, b) => b.rating - a.rating);
    }

    return next;
  }, [baseGrid, filterOption, searchTerm, sortOption]);

  const sortLabel =
    sortOption === "price-low-high"
      ? "Price - low to high"
      : sortOption === "price-high-low"
        ? "Price - high to low"
        : sortOption === "rating-high"
          ? "Customer Rating"
          : "What's new";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[--peach] to-background">
      <Navbar />
      <section className="container-page py-12">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-5xl">Products</h1>
          </div>
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <p className="text-sm text-muted-foreground md:whitespace-nowrap md:text-base">
              Browse available construction materials from the live catalog.
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => {
                    setFilterOpen((v) => !v);
                    setSortOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm"
                >
                <SlidersHorizontal className="h-4 w-4" />
                FILTERS
                </button>
                {filterOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-52 rounded-md border border-border bg-card p-1 shadow-lg">
                    <button onClick={() => { setFilterOption("all"); setFilterOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">All</button>
                    <button onClick={() => { setFilterOption("ultratech"); setFilterOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">UltraTech</button>
                    <button onClick={() => { setFilterOption("acc"); setFilterOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">ACC</button>
                    <button onClick={() => { setFilterOption("rating4plus"); setFilterOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">Rating 4.0+</button>
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    setSortOpen((v) => !v);
                    setFilterOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm"
                >
                  Sort by: {sortLabel} <ChevronDown className="h-4 w-4" />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-border bg-card p-1 shadow-lg">
                    <button onClick={() => { setSortOption("whats-new"); setSortOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">What's new</button>
                    <button onClick={() => { setSortOption("price-high-low"); setSortOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">Price - high to low</button>
                    <button onClick={() => { setSortOption("price-low-high"); setSortOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">Price - low to high</button>
                    <button onClick={() => { setSortOption("rating-high"); setSortOpen(false); }} className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-secondary">Customer Rating</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
          {productsQuery.isLoading ? <p className="w-full text-sm text-muted-foreground">Loading products...</p> : null}
          {productsQuery.isError ? (
            <div className="w-full">
              <p className="text-sm text-red-600">{productsQuery.error.message}</p>
              <button
                onClick={() => void productsQuery.refetch()}
                className="mt-3 rounded-full border border-brand px-4 py-2 text-sm text-brand"
              >
                Try Again
              </button>
            </div>
          ) : null}
          {grid.map((p, i) => <ProductCard key={`${p.id}-${i}`} product={p} />)}
          {!productsQuery.isLoading && !grid.length ? <p className="w-full text-sm text-muted-foreground">No products found.</p> : null}
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}
