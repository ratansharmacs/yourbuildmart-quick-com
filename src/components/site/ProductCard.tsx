import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Share2, ShoppingBag, Star } from "lucide-react";
import type { Product } from "./data";
import { ProductImage } from "./ProductImage";
import { useShop } from "@/context/shop-context";

export function ProductCard({ product, variant = "default" }: { product: Product; variant?: "default" | "compact" }) {
  const linkProps = { to: "/products/$productId", params: { productId: product.id } } as const;
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const navigate = useNavigate();
  const canAdd = product.inStock !== false && Boolean(product.variantId);

  const add = async () => {
    if (!canAdd) {
      await navigate(linkProps);
      return;
    }
    await addToCart(product, 1);
  };

  const buyNow = async () => {
    if (!canAdd) {
      await navigate(linkProps);
      return;
    }
    await addToCart(product, 1);
    await navigate({ to: "/cart" });
  };

  const share = async () => {
    const url = `${window.location.origin}/products/${product.slug || product.id}`;
    if (navigator.share) await navigator.share({ title: product.name, text: product.name, url });
    else await navigator.clipboard.writeText(url);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
      <Link {...linkProps} className="block">
        <div className="relative aspect-square overflow-hidden bg-[--peach]">
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[10px] font-semibold text-brand-foreground md:text-[11px]">
            {product.sale}
          </span>
          <div className="absolute right-3 top-3 flex flex-row gap-1.5">
            <button aria-label="Toggle wishlist" onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleWishlist(product); }} className={`grid h-7 w-7 place-items-center rounded-full bg-white/90 transition ${isWishlisted(product) ? "text-orange" : "text-foreground/70 hover:text-orange"}`}>
              <Heart className={`h-3.5 w-3.5 ${isWishlisted(product) ? "fill-current" : ""}`} />
            </button>
            <button aria-label="Share product" onClick={(event) => { event.preventDefault(); event.stopPropagation(); void share(); }} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-foreground/70 transition hover:text-brand">
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <ProductImage product={product} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="text-sm font-medium text-foreground transition group-hover:text-brand">
            {product.name}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-foreground">₹{product.price}</span>
            <span className="text-xs text-muted-foreground line-through">₹{product.oldPrice}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-[#E5A400] text-[#E5A400]"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="ml-1">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
          </div>
        </div>
      </Link>
      {variant === "default" && (
        <div className="mx-4 mb-4 mt-1 grid grid-cols-2 gap-2">
          <button
            onClick={() => void add()}
            disabled={product.inStock === false}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-orange px-2 py-2.5 text-xs font-medium text-orange-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.inStock === false ? "Out of Stock" : canAdd ? "Add to Cart" : "Options"}
          </button>
          <button
            onClick={() => void buyNow()}
            disabled={product.inStock === false}
            className="rounded-lg border border-brand px-2 py-2.5 text-xs font-semibold text-brand transition hover:bg-secondary disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
