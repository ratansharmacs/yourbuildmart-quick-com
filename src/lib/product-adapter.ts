import type { Product } from "@/components/site/data";
import { resolveApiImage, type CatalogProduct, type ProductDetail } from "@/lib/api";

export function catalogProductToCard(product: CatalogProduct): Product {
  const variant =
    product.variants?.find((item) => item.inventory.available) ||
    product.variants?.[0];
  const price = variant?.price || product.variantMinPrice || product.basePrice || 0;
  const maxPrice = product.variantMaxPrice || price;
  return {
    id: product.urlHandle || product.slug || String(product.id),
    slug: product.urlHandle || product.slug || String(product.id),
    apiId: product.id,
    name: product.name,
    brand: product.brandName || "",
    category: product.categoryName || "products",
    price,
    oldPrice: maxPrice > price ? maxPrice : price,
    variantId: variant?.id,
    rating: 4.6,
    reviews: 42,
    sale: product.inStock ? "In stock" : "Out of stock",
    image: resolveApiImage(product.imagePath || variant?.images?.[0]),
    inStock: variant?.inventory.available ?? product.inStock,
    maxQuantity: variant?.inventory.maxCartQuantity ?? undefined,
  };
}

export function productDetailToCard(product: ProductDetail, variantId?: number): Product {
  const variant = product.variants.find((item) => item.id === variantId) || product.variants[0];
  const card = catalogProductToCard({
    ...product,
    variantMinPrice: product.variantMinPrice || variant?.price || product.basePrice,
    variantMaxPrice: product.variantMaxPrice || variant?.price || product.basePrice,
    priceDisplay: product.priceDisplay || String(variant?.price || product.basePrice),
  });
  return {
    ...card,
    variantId: variant?.id,
    price: variant?.price || card.price,
    oldPrice: product.variantMaxPrice || variant?.price || card.oldPrice,
    image: resolveApiImage(variant?.images?.[0] || product.imagePath),
    maxQuantity: variant?.inventory.maxCartQuantity ?? undefined,
    inStock: variant?.inventory.available ?? product.inStock,
    description: product.description,
  };
}
