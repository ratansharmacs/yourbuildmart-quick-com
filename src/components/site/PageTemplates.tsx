import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer, Newsletter } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/components/site/data";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { findCategoryByMatches, productsByCategoryFamily } from "@/lib/category-products";
import { catalogProductToCard } from "@/lib/product-adapter";

type Stat = {
  label: string;
  value: string;
};

type InfoSection = {
  title: string;
  description: string;
  bullets?: string[];
};

export function InfoPageTemplate({
  title,
  subtitle,
  stats,
  sections,
  ctaText,
  ctaTo,
  footerNote,
}: {
  title: string;
  subtitle: string;
  stats?: Stat[];
  sections: InfoSection[];
  ctaText?: string;
  ctaTo?: "/products" | "/shop-all" | "/contact-us";
  footerNote?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-to-b from-[--peach] to-background pb-10 pt-8 md:pb-12 md:pt-12">
        <div className="container-page">
          <span className="inline-flex items-center rounded-full bg-orange/15 px-3 py-1 text-xs font-medium text-orange">
            YourBuildMart
          </span>
          <h1 className="mt-4 text-4xl leading-tight md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">{subtitle}</p>

          {stats?.length ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-2xl text-brand">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-border bg-card p-5 md:p-6">
                <h2 className="text-2xl">{section.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
                {section.bullets?.length ? (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>

          {ctaText && ctaTo ? (
            <div className="mt-8">
              <Link
                to={ctaTo}
                className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-medium text-orange-foreground transition hover:opacity-90"
              >
                {ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : null}

          {footerNote ? <p className="mt-4 text-xs text-muted-foreground">{footerNote}</p> : null}
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}

export function ProductShowcaseTemplate({
  title,
  subtitle,
  products,
  badge,
  topContent,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  badge?: string;
  topContent?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="bg-gradient-to-b from-[--peach] to-background py-10 md:py-12">
        <div className="container-page">
          {badge ? (
            <span className="inline-flex items-center rounded-full bg-orange/15 px-3 py-1 text-xs font-medium text-orange">
              {badge}
            </span>
          ) : null}
          <h1 className="mt-4 text-4xl leading-tight md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
          {topContent ? <div className="mt-6">{topContent}</div> : null}

          <div className="mt-8 flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-5">
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className="min-w-[220px] md:min-w-0">
                <ProductCard product={product} variant="home" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}

export function LiveCategoryPage({ title, subtitle, matches }: { title: string; subtitle: string; matches: string[] }) {
  const categories = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const category = categories.data ? findCategoryByMatches(categories.data, matches) : undefined;
  const products = useQuery({
    queryKey: ["nav-category-products", category?.id],
    enabled: Boolean(category && categories.data),
    queryFn: () => productsByCategoryFamily({
      categories: categories.data || [],
      categoryId: category!.id,
      params: { page: 0, size: 100, sortBy: "crtDt", direction: "DESC" },
    }),
  });
  return <ProductShowcaseTemplate badge="Category" title={category?.name || title} subtitle={category?.description || subtitle} products={(products.data?.content || []).map(catalogProductToCard)} topContent={categories.isLoading || products.isLoading ? <p>Loading products...</p> : !category ? <p className="text-sm text-muted-foreground">This category is not currently available from the backend.</p> : undefined} />;
}
