import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { useCategories, useProducts } from "@/hooks/use-catalog";
import { slugify } from "@/lib/api";
import { catalogProductToCard } from "@/lib/product-adapter";

export const Route = createFileRoute("/shop-all")({
  head: () => ({
    meta: [
      { title: "Shop All - YourBuildMart" },
      { name: "description", content: "Browse all available construction and hardware products by category." },
    ],
  }),
  component: ShopAllPage,
});

function ShopAllPage() {
  const categories = useCategories();
  const products = useProducts({ page: 0, size: 100, sortBy: "crtDt", direction: "DESC" });
  const topLevelCategories = (categories.data || []).filter((category) => category.parentId === null);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container-page flex-1 py-10">
        <p className="text-sm font-medium text-orange">All Categories</p>
        <h1 className="mt-2 text-4xl md:text-5xl">Shop All Products</h1>
        <p className="mt-3 text-muted-foreground">
          Browse the live catalog or choose a category to see its products and subcategories.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Product categories">
          {topLevelCategories.map((category) => (
            <Link
              key={category.id}
              to="/category/$categoryId"
              params={{ categoryId: slugify(category.name) }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
            >
              {category.name} ({category.productCount})
            </Link>
          ))}
        </nav>

        {products.isLoading || categories.isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading catalog...</p>
        ) : null}
        {products.isError ? (
          <p className="mt-10 text-sm text-red-600">{products.error.message}</p>
        ) : null}
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5">
          {(products.data?.content || []).map((product) => (
            <ProductCard key={product.id} product={catalogProductToCard(product)} variant="home" />
          ))}
        </div>
        {!products.isLoading && !products.data?.content.length ? (
          <p className="mt-10 text-muted-foreground">No products are currently available.</p>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
