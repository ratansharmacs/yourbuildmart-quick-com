import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  Star,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, Newsletter } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductRowCarousel } from "@/components/site/ProductRowCarousel";
import { HotDealsSection } from "@/components/site/HotDealsSection";
// TestimonialsSection disabled on product page per request
// import { TestimonialsSection } from "@/components/site/TestimonialsSection";
import { useProduct } from "@/hooks/use-catalog";
import { catalogProductToCard, productDetailToCard } from "@/lib/product-adapter";
import {
  api,
  getProductImages,
  parseVariantAttributes,
  slugify,
  type CustomerCategory,
  type ProductDetail,
  type ProductVariant,
} from "@/lib/api";
import { useShop } from "@/context/shop-context";
import type { Product } from "@/components/site/data";

export const Route = createFileRoute("/products/$productId")({
  head: () => ({ meta: [{ title: "Product Details - YourBuildMart" }] }),
  component: ProductDetailPage,
});

const RECENTLY_VIEWED_KEY = "ybm_recently_viewed_products";

function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const productQuery = useProduct(productId);
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: api.categories });
  const categoryInfo = categoriesQuery.data?.find((category) => category.id === productQuery.data?.categoryId);
  const similarProductsQuery = useQuery({
    queryKey: ["product-page", "similar-priority", productQuery.data?.id, categoryInfo?.id, categoriesQuery.data],
    enabled: Boolean(productQuery.data && categoryInfo && categoriesQuery.data),
    queryFn: async () => {
      const currentId = productQuery.data!.id;
      const load = async (categoryId: number) => {
        const page = await api.productsByCategory(categoryId, { page: 0, size: 15, sortBy: "crtDt", direction: "DESC" });
        return page.content.filter((item) => item.id !== currentId);
      };

      const sameCategory = await load(categoryInfo!.id);
      if (sameCategory.length) return sameCategory;

      if (categoryInfo!.parentId !== null) {
        const parentProducts = await load(categoryInfo!.parentId);
        if (parentProducts.length) return parentProducts;
      }

      const peers = (categoriesQuery.data || []).filter((item) =>
        item.id !== categoryInfo!.id && item.parentId === categoryInfo!.parentId && item.productCount > 0,
      );
      const currentIndex = (categoriesQuery.data || []).findIndex((item) => item.id === categoryInfo!.id);
      peers.sort((a, b) =>
        Math.abs((categoriesQuery.data || []).findIndex((item) => item.id === a.id) - currentIndex) -
        Math.abs((categoriesQuery.data || []).findIndex((item) => item.id === b.id) - currentIndex),
      );
      for (const peer of peers) {
        const adjacentProducts = await load(peer.id);
        if (adjacentProducts.length) return adjacentProducts;
      }
      return [];
    },
  });
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [variantId, setVariantId] = useState<number>();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    const firstAvailable = productQuery.data?.variants.find(
      (variant) => variant.inventory.available,
    );
    setVariantId(firstAvailable?.id || productQuery.data?.variants[0]?.id);
    setQuantity(1);
    setActiveImage(0);
  }, [productQuery.data]);

  const product = useMemo(
    () => productQuery.data ? productDetailToCard(productQuery.data, variantId) : null,
    [productQuery.data, variantId],
  );
  const selectedVariant = productQuery.data?.variants.find(
    (variant) => variant.id === variantId,
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = readRecentlyViewed();
    setRecentlyViewed(stored);
    if (!product) return;
    const next = [product, ...stored.filter((item) => item.id !== product.id)].slice(0, 12);
    window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    setRecentlyViewed(next.filter((item) => item.id !== product.id));
  }, [product]);

  if (productQuery.isLoading) {
    return <PageShell><p className="container-page py-16">Loading product...</p></PageShell>;
  }
  if (productQuery.isError || !product || !productQuery.data) {
    return (
      <PageShell>
        <div className="container-page py-16">
          <h1 className="text-3xl">Product unavailable</h1>
          <p className="mt-2 text-sm text-red-600">
            {productQuery.error?.message || "This product could not be found."}
          </p>
          <Link to="/products" className="mt-5 inline-flex items-center gap-2 text-brand">
            Back to products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </PageShell>
    );
  }

  const detail = productQuery.data;
  const images = getProductImages(detail);
  const sameCategory = (similarProductsQuery.data || []).map(catalogProductToCard);
  const similarProducts = uniqueProducts(sameCategory);
  const categorySlug = categoryInfo ? slugify(categoryInfo.name) : detail.categoryName ? slugify(detail.categoryName) : String(detail.categoryId);
  const inventoryLimit =
    selectedVariant?.inventory.maxCartQuantity ??
    selectedVariant?.inventory.totalStock ??
    10;
  const maxQuantity = Math.max(1, Math.min(10, inventoryLimit));

  const handleAdd = async () => {
    setCartMessage("");
    try {
      await addToCart(product, quantity);
      setCartMessage("Added to cart.");
    } catch (caught) {
      setCartMessage(caught instanceof Error ? caught.message : "Could not add this product");
    }
  };

  const shareProduct = async () => {
    const url = `${window.location.origin}/products/${product.slug || product.id}`;
    if (navigator.share) await navigator.share({ title: product.name, text: product.name, url });
    else await navigator.clipboard.writeText(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
        <main className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start px-4 py-8 md:px-8 lg:grid-cols-[400px_minmax(0,620px)] lg:justify-center lg:gap-16 lg:py-12">        
          <ProductGallery
          images={images}
          name={detail.name}
          active={activeImage}
          onChange={setActiveImage}
        />

        <div className="min-w-0 lg:w-full lg:max-w-[700px]">          
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-medium text-orange">{detail.brandName}</p>
            <div className="flex shrink-0 items-center gap-2">
              <button
                aria-label="Toggle wishlist"
                onClick={() => toggleWishlist(product)}
                className={`inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-semibold transition ${isWishlisted(product) ? "bg-orange/15 text-orange" : "bg-secondary text-brand hover:bg-secondary/80"}`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted(product) ? "fill-current" : ""}`} />
                {product.reviews}
              </button>
              <button aria-label="Bookmark product" className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-brand hover:bg-secondary/80">
                <Bookmark className="h-4 w-4" />
              </button>
              <button aria-label="Share product" onClick={() => void shareProduct()} className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-brand hover:bg-secondary/80">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <h1 className="mt-2 text-3xl md:text-5xl">{detail.name}</h1>
          <ExpandableDescription description={detail.description} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold text-brand">
              ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </span>
            {product.oldPrice != null ? (
              <span className="text-sm text-muted-foreground line-through">
                ₹{typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : product.oldPrice}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedVariant?.inventory.stockLabel ||
              (selectedVariant?.inventory.available ? "In stock" : "Out of stock")}
          </p>

          {detail.featureBadges?.length ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {detail.featureBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-brand">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#CFF08A]">
                    <Check className="h-3 w-3" />
                  </span>
                  {badge}
                </div>
              ))}
            </div>
          ) : null}

          <VariantSelectors
            detail={detail}
            selectedVariant={selectedVariant}
            onSelect={(variant) => {
              setVariantId(variant.id);
              setQuantity(1);
              const variantImage = variant.images[0];
              if (variantImage) {
                const index = images.findIndex((image) => image.includes(variantImage.path));
                if (index >= 0) setActiveImage(index);
              }
            }}
          />

          <div className="mt-7 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="grid h-12 w-10 place-items-center"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                className="grid h-12 w-10 place-items-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => void handleAdd()}
              disabled={!selectedVariant?.inventory.available}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-white disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </button>
          </div>
          {cartMessage ? <p className="mt-3 text-sm text-brand">{cartMessage}</p> : null}

          {detail.overview?.trim() ? (
            <p className="mt-6 whitespace-pre-line text-sm text-muted-foreground">
              {detail.overview}
            </p>
          ) : null}
          <ProductAccordions product={detail} />
        </div>
      </main>

      {/* Similar items */}
      <ProductRail
        title="Similar Items You Might Also Like"
        subtitle={`More ${detail.categoryName || "products"} selected for this product`}
        products={similarProducts}
        loading={similarProductsQuery.isLoading}
        background="figmaSoft"
        viewAllTo={`/${categoryInfo?.parentId === null ? "category" : "subcategory"}/${categorySlug}`}
      />

      {/* Move Recently Viewed up right after similar items */}
      <ProductRail
        title="Recently Reviewed"
        subtitle="Continue where you left off"
        products={recentlyViewed}
        background="soft"
        centerFill
        hideWhenEmpty
        viewAllTo="/products"
      />

      <HotDealsSection />

      {/* Facts / FAQ section */}
      <ProductFaq product={detail} />

      {/* Skip: ReviewsAndRatings, TestimonialsSection, WiresFlashDrop, Best Of, Frequently Bought Together, RelatedCategoriesStrip, Newsletter */}

      <Footer />
    </div>
  );
}

function ProductGallery({
  images,
  name,
  active,
  onChange,
}: {
  images: string[];
  name: string;
  active: number;
  onChange: (index: number) => void;
}) {
  const image = images[active];
  const previous = () => onChange(active > 0 ? active - 1 : images.length - 1);
  const next = () => onChange(active < images.length - 1 ? active + 1 : 0);

  return (
    <div className="mx-auto flex w-full max-w-[680px] justify-center gap-2 lg:mx-0 lg:w-auto lg:max-w-none">
      {images.length > 1 ? (
        <div className="hidden w-16 shrink-0 space-y-2 overflow-y-auto md:block lg:max-h-[500px]">
          {images.map((item, index) => (
            <button
              key={item}
              onClick={() => onChange(index)}
              className={`aspect-square w-full overflow-hidden rounded-md border bg-white ${
                index === active ? "border-brand" : "border-border"
              }`}
            >
              <img src={item} alt={`${name} ${index + 1}`} className="h-full w-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative aspect-[5/4] min-w-0 flex-1 overflow-hidden rounded-2xl bg-[--peach] lg:h-[500px] lg:w-[400px] lg:flex-none lg:aspect-[4/5]">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-5xl text-brand">{name.slice(0, 1)}</div>
        )}
        {images.length > 1 ? (
          <>
            <button onClick={previous} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow">
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function VariantSelectors({
  detail,
  selectedVariant,
  onSelect,
}: {
  detail: ProductDetail;
  selectedVariant?: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}) {
  const selected = parseVariantAttributes(selectedVariant?.attrsCombo || "");

  const selectAttribute = (attributeName: string, value: string) => {
    const wanted = { ...selected, [attributeName]: value };
    const exact = detail.variants.find((variant) => {
      const attributes = parseVariantAttributes(variant.attrsCombo);
      return Object.entries(wanted).every(([name, selectedValue]) => attributes[name] === selectedValue);
    });
    const fallback = detail.variants.find(
      (variant) => parseVariantAttributes(variant.attrsCombo)[attributeName] === value,
    );
    if (exact || fallback) onSelect(exact || fallback!);
  };

  return (
    <div className="mt-6 space-y-5">
      {[...detail.attrs]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((attribute) => (
          <div key={attribute.attributeName}>
            <h2 className="text-sm font-semibold">{attribute.attributeName}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {attribute.values.map((value) => {
                const available = detail.variants.some(
                  (variant) =>
                    variant.inventory.available &&
                    parseVariantAttributes(variant.attrsCombo)[attribute.attributeName] === value,
                );
                return (
                  <button
                    key={value}
                    onClick={() => selectAttribute(attribute.attributeName, value)}
                    disabled={!available}
                    className={`rounded-lg border px-4 py-2 text-sm disabled:opacity-40 ${
                      selected[attribute.attributeName] === value
                        ? "border-brand bg-secondary font-semibold text-brand"
                        : "border-border"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}

function ExpandableDescription({ description }: { description?: string }) {
  const [expanded, setExpanded] = useState(false);
  const content = description?.trim();

  if (!content) return null;

  const shouldTruncate = content.length > 150;
  const collapsed = shouldTruncate ? `${content.slice(0, 150).trimEnd()}...` : content;

  return (
    <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
      <p className={expanded ? "whitespace-pre-line" : ""}>
        {expanded ? content : collapsed}
        {shouldTruncate ? (
          <>
            {" "}
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="inline font-semibold text-brand"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>
          </>
        ) : null}
      </p>
    </div>
  );
}

function ProductAccordions({ product }: { product: ProductDetail }) {
  const sections = [
    { label: "Key Features", content: product.keyFeatures },
    { label: "What's Inside", content: product.whatsInside },
    { label: "How To Use", content: product.howToUse },
  ].filter((section) => section.content?.trim());

  if (!sections.length) return null;

  return (
    <div className="mt-5 space-y-3">
      {sections.map((section) => (
        <details key={section.label} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-secondary px-5 py-4 font-medium text-brand">
            {section.label}
            <Plus className="h-5 w-5 transition group-open:rotate-45" />
          </summary>
          <p className="mt-2 whitespace-pre-line rounded-xl bg-secondary/40 px-5 py-4 text-sm text-muted-foreground">
            {section.content}
          </p>
        </details>
      ))}
    </div>
  );
}

function ProductRail({
  title,
  subtitle,
  products,
  loading = false,
  background = "white",
  chips = [],
  emptyText = "No products found for this section.",
  viewAllTo,
  glow = false,
  centerFill = false,
  hideWhenEmpty = false,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  loading?: boolean;
  background?: "white" | "soft" | "light" | "figmaSoft";
  chips?: string[];
  emptyText?: string;
  viewAllTo?: string;
  glow?: boolean;
  centerFill?: boolean;
  hideWhenEmpty?: boolean;
}) {
  const bg =
    background === "figmaSoft"
      ? "bg-[#fbf6f2]"
      : background === "soft"
      ? "bg-secondary"
      : background === "light"
        ? "bg-gradient-to-b from-white to-[--peach]"
        : "bg-background";
  const sectionStyle = glow
    ? {
        backgroundImage:
          "radial-gradient(ellipse at 50% 46%, rgba(255, 126, 17, 0.2) 0%, rgba(255, 184, 108, 0.13) 28%, rgba(255, 184, 108, 0) 55%)",
      }
    : undefined;

  if (hideWhenEmpty && !loading && !products.length) return null;

  const shownProducts = centerFill && products.length <= 5 ? centerFillProducts(products) : products;

  return (
    <section className={`${bg} py-10 md:py-12`} style={sectionStyle}>
      <div className="container-page">
        <div className="relative mb-6 text-center">
          <h2 className="text-3xl md:text-4xl">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          {viewAllTo ? (
            <Link
              to={viewAllTo}
              className="absolute right-0 top-2 hidden items-center gap-1 text-sm font-medium text-brand hover:underline md:inline-flex"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
        {chips.length ? (
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {chips.slice(0, 8).map((chip) => (
              <span key={chip} className="rounded-full border border-orange/40 bg-white px-3 py-1 text-[11px] font-medium text-brand">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        {loading ? <p className="text-center text-sm text-muted-foreground">Loading products...</p> : null}
        {!loading && !products.length ? <p className="text-center text-sm text-muted-foreground">{emptyText}</p> : null}
        {shownProducts.length ? <ProductRowCarousel products={shownProducts} /> : null}
      </div>
    </section>
  );
}

function ReviewsAndRatings({ product }: { product: ProductDetail }) {
  const rating = 4.6;
  const total = Math.max(35, product.variantCount * 18 + 17);
  const breakdown = [
    { stars: 5, percent: 66 },
    { stars: 4, percent: 22 },
    { stars: 3, percent: 11 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
  ];

  return (
    <section className="bg-background py-10 md:py-12">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl">Reviews & Ratings</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {product.name} by {product.brandName} has been reviewed by customers looking for reliable {product.categoryName}.
            </p>
          </div>
          <button className="w-fit rounded-md bg-brand px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">
            Write a Review
          </button>
        </div>
        <div className="mt-6 grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-5xl font-semibold text-brand">{rating.toFixed(1)}</span>
              <Star className="h-6 w-6 fill-orange text-orange" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Average rating based on {total} ratings and reviews.</p>
          </div>
          <div className="space-y-2">
            {breakdown.map((item) => (
              <div key={item.stars} className="grid grid-cols-[24px_1fr_40px] items-center gap-3 text-xs text-muted-foreground">
                <span>{item.stars}</span>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-[#24B7B3]" style={{ width: `${item.percent}%` }} />
                </div>
                <span>{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-base font-semibold text-foreground">Reviews with images</h3>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {getProductImages(product).slice(0, 8).map((image, index) => (
              <div key={`${image}-${index}`} className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-secondary">
                <img src={image} alt={`${product.name} review ${index + 1}`} className="h-full w-full rounded-lg object-contain p-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductFaq({ product }: { product: ProductDetail }) {
  const firstAttr = [...product.attrs].sort((a, b) => a.displayOrder - b.displayOrder)[0];
  const questions = [
    {
      q: `Is ${product.name} suitable for regular construction use?`,
      a: `${product.name} is listed under ${product.categoryName} and is intended for customers comparing dependable ${product.brandName} products. Check the selected variant and stock label before adding it to cart.`,
    },
    {
      q: `Which variants are available for ${product.name}?`,
      a: firstAttr
        ? `Available ${firstAttr.attributeName.toLowerCase()} options include ${firstAttr.values.slice(0, 5).join(", ")}. Choose the required option on this page to see the matching price and inventory status.`
        : `Variant availability is shown near the add-to-cart area. Select the available option before checkout.`,
    },
    {
      q: `How should I choose the right quantity?`,
      a: `Start with the quantity needed for your site and use the stock limit shown on the page. The cart quantity is capped by current inventory for the selected variant.`,
    },
    {
      q: `Can I compare this with similar ${product.categoryName} products?`,
      a: `Yes. The similar items and frequently bought together sections below use the product category, brand, and backend related-products data to help you compare alternatives quickly.`,
    },
  ];

  return (
    <section className="bg-[#235758] py-10 text-white md:py-14">
      <div className="container-page max-w-5xl">
        <h2 className="text-3xl text-white md:text-4xl">Do you have questions?</h2>
        <div className="mt-6 divide-y divide-white/20">
          {questions.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-white">
                {item.q}
                <Plus className="h-5 w-5 shrink-0 transition group-open:rotate-45" />
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-white/85">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <span className="text-sm font-semibold text-white">My question is not here.</span>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#235758] transition hover:bg-white/90"
          >
            Connect Us <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RelatedCategoriesStrip({ categories }: { categories: CustomerCategory[] }) {
  if (!categories.length) return null;

  return (
    <section className="bg-orange py-7 text-orange-foreground">
      <div className="container-page">
        <h2 className="text-base font-semibold text-white">Shop By Related Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/category/$categoryId"
              params={{ categoryId: slugify(category.name) }}
              className="rounded-md border border-white/50 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white hover:text-orange"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function uniqueProducts(products: Product[]) {
  const seen = new Set<string>();
  return products.filter((product) => {
    const key = product.apiId ? `api-${product.apiId}` : product.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function centerFillProducts(products: Product[]) {
  if (products.length <= 2) return products;
  const [first, second, third, ...rest] = products;
  return third ? [second, first, third, ...rest] : [second, first, ...rest];
}

function readRecentlyViewed() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Product => Boolean(item?.id && item?.name));
  } catch {
    return [];
  }
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><Navbar />{children}<Footer /></div>;
}
