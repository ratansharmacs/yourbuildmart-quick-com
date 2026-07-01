import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer, Newsletter } from "@/components/site/Footer";
import { ProductCard } from "@/components/site/ProductCard";
import { useProduct, useRelatedProducts } from "@/hooks/use-catalog";
import { catalogProductToCard, productDetailToCard } from "@/lib/product-adapter";
import {
  getProductImages,
  parseVariantAttributes,
  type ProductDetail,
  type ProductVariant,
} from "@/lib/api";
import { useShop } from "@/context/shop-context";

export const Route = createFileRoute("/products/$productId")({
  head: () => ({ meta: [{ title: "Product Details - YourBuildMart" }] }),
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = useParams({ from: "/products/$productId" });
  const productQuery = useProduct(productId);
  const relatedQuery = useRelatedProducts(productQuery.data?.id || "");
  const { addToCart } = useShop();
  const [variantId, setVariantId] = useState<number>();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [cartMessage, setCartMessage] = useState("");

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
  const related = (relatedQuery.data?.content || [])
    .filter((item) => item.id !== productQuery.data?.id)
    .map(catalogProductToCard);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container-page grid items-start gap-8 py-8 lg:grid-cols-2 lg:py-12">
        <ProductGallery
          images={images}
          name={detail.name}
          active={activeImage}
          onChange={setActiveImage}
        />

        <div>
          <p className="text-sm font-medium text-orange">{detail.brandName}</p>
          <h1 className="mt-2 text-3xl md:text-5xl">{detail.name}</h1>
          <ExpandableDescription description={detail.description} />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-semibold text-brand">
              ₹{product.price.toFixed(2)}
            </span>
            {product.oldPrice > product.price ? (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product.oldPrice.toFixed(2)}
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

      <section className="bg-secondary py-12">
        <div className="container-page text-center">
          <h2 className="text-3xl">Related Products</h2>
          {relatedQuery.isLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading related products...</p>
          ) : related.length ? (
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {related.map((item) => (
                <div key={item.id} className="w-full max-w-[250px] text-left sm:w-[250px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">No related products found.</p>
          )}
        </div>
      </section>
      <Newsletter />
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
    <div className="flex gap-3">
      {images.length > 1 ? (
        <div className="hidden max-h-[560px] w-20 shrink-0 space-y-2 overflow-y-auto md:block">
          {images.map((item, index) => (
            <button
              key={item}
              onClick={() => onChange(index)}
              className={`aspect-square w-full overflow-hidden rounded-lg border ${
                index === active ? "border-brand" : "border-border"
              }`}
            >
              <img src={item} alt={`${name} ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-3xl bg-[--peach]">
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

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><Navbar />{children}<Footer /></div>;
}
