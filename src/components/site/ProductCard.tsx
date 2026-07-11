import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Share2, ShoppingBag, Star } from "lucide-react";
import type { Product } from "./data";
import { ProductImage } from "./ProductImage";
import { useShop } from "@/context/shop-context";
import { api } from "@/lib/api";
import { productDetailToCard } from "@/lib/product-adapter";

export function ProductCard({ product, variant = "default" }: { product: Product; variant?: "default" | "compact" | "home" }) {
  const linkProps = { to: "/products/$productId", params: { productId: product.id } } as const;
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const navigate = useNavigate();
  const canTryAdd = product.inStock !== false && Boolean(product.variantId || product.apiId);

  const checkoutProduct = async () => {
    if (product.variantId) return product;
    if (!product.apiId) return null;
    const detail = await api.product(product.apiId);
    return productDetailToCard(detail);
  };

  const add = async () => {
    const cartProduct = await checkoutProduct();
    if (!cartProduct?.variantId) {
      await navigate(linkProps);
      return;
    }
    await addToCart(cartProduct, 1);
  };

  const buyNow = async () => {
    const cartProduct = await checkoutProduct();
    if (!cartProduct?.variantId) {
      await navigate(linkProps);
      return;
    }
    await addToCart(cartProduct, 1);
    await navigate({ to: "/checkout/shipping" });
  };

  const share = async () => {
    const url = `${window.location.origin}/products/${product.slug || product.id}`;
    if (navigator.share) await navigator.share({ title: product.name, text: product.name, url });
    else await navigator.clipboard.writeText(url);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg">
      <Link {...linkProps} className="block">
        <div className={`relative overflow-hidden bg-[--peach] ${variant === "compact" ? "h-[140px]" : "h-[178px] md:h-[205px]"}`}>
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold text-brand-foreground">
            {product.sale}
          </span>
          <div className="absolute right-2 top-2 flex flex-row gap-1.5">
            <button aria-label="Toggle wishlist" onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleWishlist(product); }} className={`grid h-7 w-7 place-items-center rounded-full bg-white/90 transition ${isWishlisted(product) ? "text-orange" : "text-foreground/70 hover:text-orange"}`}>
              <Heart className={`h-3.5 w-3.5 ${isWishlisted(product) ? "fill-current" : ""}`} />
            </button>
            <button aria-label="Share product" onClick={(event) => { event.preventDefault(); event.stopPropagation(); void share(); }} className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-foreground/70 transition hover:text-brand">
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <ProductImage product={product} className="h-full w-full object-contain p-3" />
        </div>
        <div className={`flex flex-col ${variant === "compact" ? "gap-0 p-2" : "flex-1 gap-0.5 p-3"}`}>
          <div className="line-clamp-2  text-xs leading-[1.25] md:text-[13px] font-semibold text-foreground transition group-hover:text-brand">
            {product.name}
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="font-semibold text-foreground text-base">₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
            {product.oldPrice != null ? (
              <span className="text-xs text-muted-foreground line-through">₹{typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : product.oldPrice}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-[#E5A400] text-[#E5A400]"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="ml-1 truncate">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
          </div>
        </div>
      </Link>
      <div className={`mx-3 mb-3 mt-auto grid grid-cols-2 ${variant === "compact" ? "gap-1" : "gap-2"}`}>
        <button
          onClick={() => void add()}
          disabled={product.inStock === false}
          className={`flex items-center justify-center gap-1.5 rounded-md bg-orange ${variant === "compact" ? "px-2 py-1 text-[10px]" : "px-2 py-2 text-[11px]"} font-medium text-orange-foreground transition hover:opacity-90 disabled:opacity-50`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {product.inStock === false ? "Out of Stock" : canTryAdd ? "Add to Cart" : "Options"}
        </button>
        <button
          onClick={() => void buyNow()}
          disabled={product.inStock === false}
          className={`rounded-md border border-brand ${variant === "compact" ? "px-2 py-1 text-[10px]" : "px-2 py-2 text-[11px]"} font-semibold text-brand transition hover:bg-secondary disabled:opacity-50`}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
