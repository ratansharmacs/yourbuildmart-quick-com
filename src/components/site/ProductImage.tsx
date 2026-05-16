import type { Product } from "./data";

/**
 * Renders a real product photo on a transparent backdrop. Uses mix-blend-multiply so
 * the product's white background blends into whatever colored card it sits on.
 */
export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      className={`mix-blend-multiply ${className}`}
    />
  );
}
