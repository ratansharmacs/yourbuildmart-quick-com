import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useCategories } from "@/hooks/use-catalog";
import { resolveApiImage, slugify } from "@/lib/api";
import { categories as fallbackCategories } from "@/components/site/data";

export const Route = createFileRoute("/subcategories")({ component: CategoriesPage });
function CategoriesPage() {
  const categories = useCategories();
  const subcategories = categories.data?.filter((category) => category.parentId !== null) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container-page flex-1 pb-8 pt-14">
        <div className="flex flex-col items-center text-center">
          <div>
            <h1 className="text-4xl">Subcategories</h1>
            <p className="mt-4 text-sm text-muted-foreground">Browse all available subcategories and jump straight to the products you need.</p>
          </div>
        </div>

        {categories.isError ? <p className="mt-5 text-red-600">{categories.error.message}</p> : null}
        {categories.isLoading ? <p className="mt-8">Loading subcategories...</p> : null}

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {subcategories.map((category, index) => (
            <Link
              key={category.id}
              to="/subcategory/$subcategoryId"
              params={{ subcategoryId: slugify(category.name) }}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary p-2">
                <img
                  src={category.image ? resolveApiImage(category.image) : fallbackCategories[index % fallbackCategories.length].icon}
                  alt={category.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-foreground">{category.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{category.productCount} products</p>
              </div>
            </Link>
          ))}
        </div>

        {!categories.isLoading && !subcategories.length ? (
          <p className="mt-8 text-muted-foreground">No subcategories available.</p>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
