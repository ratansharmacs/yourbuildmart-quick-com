import { Link } from "@tanstack/react-router";
import { Heart, Share2, ShoppingBag, Star } from "lucide-react";
import type { Product } from "./data";
import { ProductImage } from "./ProductImage";
import { useShop } from "@/context/shop-context";

export function ProductCard({ product, variant = "default" }: { product: Product; variant?: "default" | "compact" }) {
  const linkProps = { to: "/products/$productId", params: { productId: product.id } } as const;
  const { addToCart } = useShop();

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-lg">
      <Link {...linkProps} className="block">
        <div className="relative bg-[--peach] p-4">
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[10px] font-semibold text-brand-foreground md:text-[11px]">
            {product.sale}
          </span>
          <div className="absolute right-3 top-3 flex flex-row gap-1.5">
            <button className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-foreground/70 transition hover:text-orange">
              <Heart className="h-3.5 w-3.5" />
            </button>
            <button className="grid h-7 w-7 place-items-center rounded-full bg-white/90 text-foreground/70 transition hover:text-brand">
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <ProductImage product={product} className="mx-auto aspect-square h-40 w-full max-w-[180px]" />
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
              <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-orange text-orange" : "text-muted"}`} />
            ))}
            <span className="ml-1">{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
          </div>
        </div>
      </Link>
      {variant === "default" && (
        <button
          onClick={() => addToCart(product, 1)}
          className="mx-4 mb-4 mt-1 flex items-center justify-center gap-2 rounded-lg bg-orange px-3 py-2 text-xs font-medium text-orange-foreground transition hover:opacity-90 md:rounded-full"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      )}
    </div>
  );
}
