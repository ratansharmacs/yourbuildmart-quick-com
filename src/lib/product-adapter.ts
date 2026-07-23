import type { Product } from "@/components/site/data";
import { resolveApiImage, type CatalogProduct, type ProductDetail, type ProductVariant } from "@/lib/api";

export function getProductSavings(product: Pick<Product, "price" | "oldPrice">) {
  const basePrice = product.oldPrice || 0;
  const amount = Math.max(0, basePrice - product.price);
  const percent = basePrice > product.price
    ? Math.round((amount / basePrice) * 100)
    : 0;

  return { amount, percent };
}

export function catalogProductToCard(product: CatalogProduct): Product {
  const availableVariants = (product.variants || []).filter(
    (item) => item.inventory.available,
  );
  const variantPool = availableVariants.length ? availableVariants : (product.variants || []);
  const variant = variantPool.reduce<ProductVariant | undefined>(
    (lowest, item) => !lowest || item.price < lowest.price ? item : lowest,
    undefined,
  );
  const price = product.variantMinPrice || variant?.price || product.basePrice || 0;
  return {
    id: product.urlHandle || product.slug || String(product.id),
    slug: product.urlHandle || product.slug || String(product.id),
    apiId: product.id,
    name: product.name,
    brand: product.brandName || "",
    category: product.categoryName || "products",
    price,
    oldPrice: product.basePrice || undefined,
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
  const availableVariants = product.variants.filter((item) => item.inventory.available);
  const variantPool = availableVariants.length ? availableVariants : product.variants;
  const minimumPriceVariant = variantPool.reduce<ProductVariant | undefined>(
    (lowest, item) => !lowest || item.price < lowest.price ? item : lowest,
    undefined,
  );
  const variant = product.variants.find((item) => item.id === variantId) || minimumPriceVariant;
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
    oldPrice: product.basePrice || undefined,
    image: resolveApiImage(variant?.images?.[0] || product.imagePath),
    maxQuantity: variant?.inventory.maxCartQuantity ?? undefined,
    inStock: variant?.inventory.available ?? product.inStock,
    description: product.description,
  };
}
