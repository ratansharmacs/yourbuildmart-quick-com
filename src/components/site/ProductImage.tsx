import type { Product } from "./data";
import { useEffect, useState } from "react";

export function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [product.image]);

  if (!product.image || failed) {
    return (
      <div className={`grid place-items-center bg-secondary text-4xl text-brand ${className}`}>
        {product.name.slice(0, 1)}
      </div>
    );
  }
  return (
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
