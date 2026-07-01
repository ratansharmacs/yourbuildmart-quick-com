import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";
import { useShop } from "@/context/shop-context";
import { useProducts } from "@/hooks/use-catalog";
import { catalogProductToCard } from "@/lib/product-adapter";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart and Checkout - YourBuildMart" }] }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartLoading,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
  } = useShop();
  const suggestionsQuery = useProducts({ page: 0, size: 8 });

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.product.oldPrice * item.quantity,
    0,
  );
  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discount = Math.max(0, originalTotal - subTotal);
  const suggestions = useMemo(() => {
    const cartProductIds = new Set(
      cartItems.map((item) => item.product.apiId || Number(item.product.id)),
    );
    return (suggestionsQuery.data?.content || [])
      .filter((product) => !cartProductIds.has(product.id))
      .map(catalogProductToCard)
      .slice(0, 4);
  }, [cartItems, suggestionsQuery.data]);

  const checkoutItems = cartItems.flatMap((item) =>
    item.product.variantId
      ? [{
          productId: item.product.apiId,
          variantId: item.product.variantId,
          quantity: item.quantity,
          unitPrice: item.product.price,
        }]
      : [],
  );

  const checkout = async () => {
    await navigate({ to: "/checkout/shipping" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container-page flex-1 py-10">
        <h1 className="text-4xl md:text-5xl">Your Cart</h1>
        <p className="mt-3 text-brand">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>

        {cartLoading ? <p className="mt-8">Loading cart...</p> : null}

        {!cartLoading && !cartItems.length ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-full bg-brand px-6 py-3 text-sm text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : null}

        {!cartLoading && cartItems.length ? (
          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <div className="space-y-5">
                {cartItems.map((item) => (
                  <article
                    key={`${item.product.id}-${item.product.variantId}`}
                    className="overflow-hidden rounded-2xl border border-brand bg-card"
                  >
                    <div className="grid gap-5 p-5 sm:grid-cols-[180px_minmax(0,1fr)]">
                      <Link
                        to="/products/$productId"
                        params={{ productId: item.product.id }}
                        className="block aspect-square overflow-hidden rounded-xl bg-secondary"
                      >
                        <ProductImage
                          product={item.product}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-col">
                        <Link
                          to="/products/$productId"
                          params={{ productId: item.product.id }}
                          className="text-lg font-semibold text-brand"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-3 text-2xl font-semibold">
                          ₹{item.product.price.toFixed(2)}
                        </p>
                        <p className="mt-2 text-sm font-medium text-green-700">
                          {item.product.inStock === false ? "Out of Stock" : "In Stock"}
                        </p>
                        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              onClick={() =>
                                void updateCartQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="grid h-11 w-12 place-items-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-10 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                void updateCartQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="grid h-11 w-12 place-items-center"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <strong className="text-xl text-brand">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-t border-brand">
                      <button
                        onClick={() => toggleWishlist(item.product)}
                        className="flex items-center justify-center gap-2 border-r border-brand py-4 text-sm font-medium"
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted(item.product) ? "fill-orange text-orange" : ""}`} /> {isWishlisted(item.product) ? "Wishlisted" : "Add to Wishlist"}
                      </button>
                      <button
                        onClick={() => void removeFromCart(item.product.id)}
                        className="flex items-center justify-center gap-2 py-4 text-sm font-medium"
                      >
                        <Trash2 className="h-5 w-5" /> Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-8 grid gap-4 text-sm font-medium sm:grid-cols-3">
                <TrustItem icon={ShieldCheck} label="Safe & Secure Payments" />
                <TrustItem icon={Truck} label="Free Shipping over ₹499" />
                <TrustItem icon={BadgeCheck} label="Quality Checked Products" />
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-brand bg-card">
              <h2 className="border-b border-border px-6 py-5 text-lg font-semibold">
                PRICE DETAILS
              </h2>
              <div className="p-6">
                <div className="flex justify-between text-sm">
                  <span>Price ({itemCount} items)</span>
                  <span>₹{originalTotal.toFixed(2)}</span>
                </div>
                <div className="mt-5 flex justify-between text-sm">
                  <span>Discount</span>
                  <span className="text-green-700">- ₹{discount.toFixed(2)}</span>
                </div>
                <div className="my-5 border-t border-dashed border-border" />
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{subTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => void checkout()}
                  disabled={!checkoutItems.length}
                  className="mt-6 w-full rounded-xl bg-brand py-4 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Checkout
                </button>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    to="/products"
                    className="rounded-xl border border-brand px-3 py-3 text-center text-sm font-medium text-brand"
                  >
                    Continue Shopping
                  </Link>
                  <button
                    onClick={() => void clearCart()}
                    className="rounded-xl border border-brand px-3 py-3 text-sm font-medium text-brand"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </aside>
          </div>
        ) : null}

        <section className="mt-14">
          <h2 className="text-3xl">You May Also Like</h2>
          {suggestionsQuery.isLoading ? (
            <p className="mt-5 text-sm text-muted-foreground">
              Loading suggestions...
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-5">
            {suggestions.map((product) => (
              <div key={product.id} className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.938rem)]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: typeof ShieldCheck;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-6 w-6 text-brand" />
      <span>{label}</span>
    </div>
  );
}
