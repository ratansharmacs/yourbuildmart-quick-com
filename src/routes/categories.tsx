import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { useCategories } from "@/hooks/use-catalog";
import { api, resolveApiImage, slugify } from "@/lib/api";
import { catalogProductToCard } from "@/lib/product-adapter";
import { categories as fallbackCategories } from "@/components/site/data";

export const Route = createFileRoute("/categories")({ component: CategoriesPage });
function CategoriesPage() {
  const categories = useCategories();
  const [active, setActive] = useState<number>();
  useEffect(() => { if (!active && categories.data?.length) setActive(categories.data[0].id); }, [active, categories.data]);
  const products = useQuery({ queryKey: ["category-products", active], queryFn: async () => {
    const page = await api.productsByCategory(active!, { page: 0, size: 48 });
    const content = await Promise.all(page.content.map(async (product) => { try { return { ...product, ...(await api.product(product.id)) }; } catch { return product; } }));
    return { ...page, content };
  }, enabled: Boolean(active) });
  const current = categories.data?.find((item) => item.id === active);
  return <div className="flex min-h-screen flex-col bg-background"><Navbar /><main className="container-page flex-1 py-8"><h1 className="text-4xl">Categories</h1>
    {categories.isError ? <p className="mt-5 text-red-600">{categories.error.message}</p> : null}
    <div className="mt-7 grid gap-6 md:grid-cols-[220px_1fr]"><aside className="flex gap-2 overflow-x-auto md:block md:space-y-2">{categories.data?.map((category, index) => <button key={category.id} onClick={() => setActive(category.id)} className={`flex min-w-36 items-center gap-3 rounded-xl border p-3 text-left md:w-full ${active === category.id ? "border-orange bg-orange/10" : "border-border bg-card"}`}><img src={category.image ? resolveApiImage(category.image) : fallbackCategories[index % fallbackCategories.length].icon} alt="" className="h-10 w-10 object-contain" /><span><strong className="block text-sm">{category.name}</strong><small className="text-muted-foreground">{category.productCount} products</small></span></button>)}</aside>
    <section><div className="flex items-end justify-between"><div><h2 className="text-2xl">{current?.name || "Products"}</h2><p className="text-sm text-muted-foreground">{current?.description}</p></div>{current ? <Link to="/category/$categoryId" params={{ categoryId: slugify(current.name) }} className="text-sm text-brand">View all</Link> : null}</div>{products.isLoading ? <p className="mt-6">Loading products...</p> : null}<div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-3">{products.data?.content.map((product) => <ProductCard key={product.id} product={catalogProductToCard(product)} />)}</div>{!products.isLoading && !products.data?.content.length ? <p className="mt-6 text-muted-foreground">No products in this category.</p> : null}</section></div>
  </main><Footer /></div>;
}
