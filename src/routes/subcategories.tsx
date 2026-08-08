import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useCategories } from "@/hooks/use-catalog";
import { resolveApiImage, slugify } from "@/lib/api";
import { categories as fallbackCategories } from "@/components/site/data";

export const Route = createFileRoute("/subcategories")({ component: CategoriesPage });
function CategoriesPage() {
  const categories = useCategories();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const allCategories = categories.data || [];
  const parentCategories = allCategories.filter((category) => category.parentId === null);
  const allSubcategories = allCategories.filter((category) => category.parentId !== null);
  const subcategories = selectedCategoryIds.length
    ? allSubcategories.filter(
        (subcategory) =>
          subcategory.parentId !== null &&
          selectedCategoryIds.includes(subcategory.parentId),
      )
    : allSubcategories;

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((selected) =>
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId],
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container-page flex-1 pb-8 pt-7 md:pt-14">
        <div className="flex flex-col items-center text-center">
          <div>
            <h1 className="text-3xl md:text-4xl">Subcategories</h1>
            <p className="mt-4 text-sm text-muted-foreground">Browse all available subcategories and jump straight to the products you need.</p>
          </div>
        </div>

        {categories.isError ? <p className="mt-5 text-red-600">{categories.error.message}</p> : null}
        {categories.isLoading ? <p className="mt-8">Loading subcategories...</p> : null}

        {!categories.isLoading && parentCategories.length ? (
          <section className="mt-9" aria-labelledby="category-filter-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="category-filter-title" className="text-lg font-semibold">
                  Filter by category
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select one or more categories to narrow the list.
                </p>
              </div>
              {selectedCategoryIds.length ? (
                <button
                  type="button"
                  onClick={() => setSelectedCategoryIds([])}
                  className="text-sm font-medium text-orange hover:underline"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
              {parentCategories.map((category) => {
                const selected = selectedCategoryIds.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleCategory(category.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selected
                        ? "border-orange bg-orange text-white shadow-sm"
                        : "border-border bg-card text-foreground hover:border-orange/50 hover:bg-orange/5"
                    }`}
                  >
                    {selected ? <Check className="h-4 w-4" aria-hidden /> : null}
                    {category.name}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {subcategories.map((category, index) => (
            <Link
              key={category.id}
              to="/subcategory/$subcategoryId"
              params={{ subcategoryId: slugify(category.name) }}
              className="group flex min-w-0 flex-col rounded-xl border border-border bg-card p-2 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:gap-3 sm:rounded-2xl sm:p-4 sm:text-left"
            >
              <div className="flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary p-3 sm:h-14 sm:w-14 sm:p-2">
                <img
                  src={category.image ? resolveApiImage(category.image) : fallbackCategories[index % fallbackCategories.length].icon}
                  alt={category.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-2 min-w-0 sm:mt-0">
                <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground sm:truncate sm:text-base">{category.name}</h2>
                <p className="text-xs leading-4 text-muted-foreground sm:text-sm">{category.productCount} products</p>
              </div>
            </Link>
          ))}
        </div>

        {!categories.isLoading && !subcategories.length ? (
          <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No subcategories are available for the selected categories.
          </p>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
