import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { api, slugify, type CustomerCategory } from "@/lib/api";
import { productsByCategoryFamily } from "@/lib/category-products";
import { catalogProductToCard } from "@/lib/product-adapter";

type PageKind = "category" | "subcategory";

function categoryKind(category: CustomerCategory): PageKind {
  return category.parentId === null ? "category" : "subcategory";
}

export function CategoryProductsPage({ categorySlug, pageKind }: { categorySlug: string; pageKind: PageKind }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("crtDt-DESC");
  const categories = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const category = categories.data?.find((item) => slugify(item.name) === categorySlug || String(item.id) === categorySlug);
  const canonicalSlug = category ? slugify(category.name) : "";
  const actualKind = category ? categoryKind(category) : pageKind;
  const [sortBy, direction] = sort.split("-");

  useEffect(() => {
    if (!category || (categorySlug === canonicalSlug && pageKind === actualKind)) return;
    void navigate({
      to: actualKind === "category" ? "/category/$categoryId" : "/subcategory/$subcategoryId",
      params: actualKind === "category" ? { categoryId: canonicalSlug } : { subcategoryId: canonicalSlug },
      replace: true,
    });
  }, [actualKind, canonicalSlug, category, categorySlug, navigate, pageKind]);

  const products = useQuery({
    queryKey: ["category-products", category?.id, search, sort],
    enabled: Boolean(category && categories.data),
    queryFn: () => productsByCategoryFamily({
      categories: categories.data || [],
      categoryId: category!.id,
      params: { page: 0, size: 48, search, sortBy, direction },
    }),
  });

  const ancestors: CustomerCategory[] = [];
  if (category) {
    let parentId = category.parentId;
    while (parentId !== null) {
      const parent = categories.data?.find((item) => item.id === parentId);
      if (!parent) break;
      ancestors.unshift(parent);
      parentId = parent.parentId;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container-page flex-1 py-6 md:py-10">
        <nav className="mb-3 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="px-2">/</span>
          <span>{actualKind === "category" ? "Category" : "Subcategory"}</span>
          {ancestors.map((ancestor) => (
            <span key={ancestor.id}>
              <span className="px-2">/</span>
              <Link
                to={ancestor.parentId === null ? "/category/$categoryId" : "/subcategory/$subcategoryId"}
                params={ancestor.parentId === null ? { categoryId: slugify(ancestor.name) } : { subcategoryId: slugify(ancestor.name) }}
              >
                {ancestor.name}
              </Link>
            </span>
          ))}
          {category ? <><span className="px-2">/</span><span>{category.name}</span></> : null}
        </nav>

        <p className="text-sm text-brand">Shop by {actualKind}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{category?.name || `${pageKind === "category" ? "Category" : "Subcategory"} Products`}</h1>
        <p className="mt-2 text-muted-foreground">{category?.description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search in this ${actualKind}`} className="h-11 flex-1 rounded-lg border border-border px-4" />
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 rounded-lg border border-border px-3">
            <option value="crtDt-DESC">Newest</option>
            <option value="basePrice-ASC">Price: Low to High</option>
            <option value="basePrice-DESC">Price: High to Low</option>
          </select>
        </div>

        {products.isLoading || categories.isLoading ? <p className="mt-8">Loading products...</p> : null}
        {products.isError ? <p className="mt-8 text-red-600">{products.error.message}</p> : null}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:mt-8 md:grid-cols-4 xl:grid-cols-5">
          {products.data?.content.map((product) => <div key={product.id} className="min-w-0"><ProductCard product={catalogProductToCard(product)} variant="home" /></div>)}
        </div>
        {!products.isLoading && !products.data?.content.length ? <p className="mt-8 text-muted-foreground">No products found in this {actualKind}.</p> : null}
      </main>
      <Footer />
    </div>
  );
}
