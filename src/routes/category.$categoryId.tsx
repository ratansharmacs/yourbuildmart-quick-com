import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { api, slugify } from "@/lib/api";
import { catalogProductToCard } from "@/lib/product-adapter";

export const Route = createFileRoute("/category/$categoryId")({ component: CategoryProductsPage });
function CategoryProductsPage() {
  const { categoryId: categorySlug } = Route.useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("crtDt-DESC");
  const categories = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const category = categories.data?.find((item) => slugify(item.name) === categorySlug || String(item.id) === categorySlug);
  const [sortBy, direction] = sort.split("-");
  const products = useQuery({
    queryKey: ["category-products", category?.id, search, sort],
    enabled: Boolean(category),
    queryFn: async () => {
      const page = await api.productsByCategory(category!.id, { page: 0, size: 48, search, sortBy, direction });
      const content = await Promise.all(page.content.map(async (product) => {
        try { return { ...product, ...(await api.product(product.id)) }; } catch { return product; }
      }));
      return { ...page, content };
    },
  });
  return <div className="flex min-h-screen flex-col bg-background"><Navbar /><main className="container-page flex-1 py-10">
    <p className="text-sm text-brand">Shop by category</p><h1 className="mt-2 text-4xl">{category?.name || "Category Products"}</h1><p className="mt-2 text-muted-foreground">{category?.description}</p>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in this category" className="h-11 flex-1 rounded-lg border border-border px-4" /><select value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 rounded-lg border border-border px-3"><option value="crtDt-DESC">Newest</option><option value="basePrice-ASC">Price: Low to High</option><option value="basePrice-DESC">Price: High to Low</option></select></div>
    {products.isLoading || categories.isLoading ? <p className="mt-8">Loading products...</p> : null}{products.isError ? <p className="mt-8 text-red-600">{products.error.message}</p> : null}
    <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{products.data?.content.map((p) => <ProductCard key={p.id} product={catalogProductToCard(p)} />)}</div>
    {!products.isLoading && !products.data?.content.length ? <p className="mt-8 text-muted-foreground">No products found in this category.</p> : null}
  </main><Footer /></div>;
}
