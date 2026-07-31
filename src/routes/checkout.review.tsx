import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { ProductImage } from "@/components/site/ProductImage";
import { useShop } from "@/context/shop-context";
import { api, type CheckoutPreview, type CheckoutSession } from "@/lib/api";
import { clearCheckoutState, loadCheckoutState, saveCheckoutState } from "@/lib/checkout-state";
import { productDetailToCard } from "@/lib/product-adapter";
import { CheckoutSteps } from "@/routes/checkout.shipping";

export const Route = createFileRoute("/checkout/review")({
  head: () => ({ meta: [{ title: "Order Review - YourBuildMart" }] }),
  component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    cartItems, cartLoading, clearCart, updateCartQuantity, removeFromCart, addToCart,
    toggleWishlist, isWishlisted,
  } = useShop();
  const checkout = useMemo(loadCheckoutState, []);
  const [couponCodes, setCouponCodes] = useState<string[]>(checkout?.couponCodes || []);
  const [couponInput, setCouponInput] = useState("");
  const [preview, setPreview] = useState<CheckoutPreview>();
  const [message, setMessage] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const items = useMemo(
    () =>
      cartItems.flatMap((item) =>
        item.product.variantId
          ? [
              {
                productId: item.product.apiId,
                variantId: item.product.variantId,
                quantity: item.quantity,
                unitPrice: item.product.price,
              },
            ]
          : [],
      ),
    [cartItems],
  );

  const addresses = useQuery({ queryKey: ["addresses"], queryFn: api.addresses });
  const recommendations = useQuery({
    queryKey: ["checkout-recommendations"],
    queryFn: async () => {
      const page = await api.featuredProducts({ page: 0, size: 6 });
      const existing = new Set(cartItems.map((item) => item.product.apiId));
      const products = await Promise.all(
        page.content
          .filter((item) => !existing.has(item.id))
          .slice(0, 4)
          .map((item) => api.product(item.id)),
      );
      return products.map((item) => productDetailToCard(item));
    },
  });

  useEffect(() => {
    if (!checkout) {
      void navigate({ to: "/checkout/shipping" });
      return;
    }
    if (cartLoading || !items.length) return;
    let active = true;
    setUpdating(true);
    const timer = window.setTimeout(() => {
      api
        .checkoutPreview(checkout.addressId, items, checkout.remarks, "CASHFREE", couponCodes)
        .then((result) => {
          if (active) {
            setPreview(result);
            setMessage(result.serviceable ? "" : result.message || "Checkout is not serviceable.");
          }
        })
        .catch((error) => {
          if (active) setMessage(error.message);
        })
        .finally(() => {
          if (active) setUpdating(false);
        });
    }, 200);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [cartLoading, checkout, couponCodes, items, navigate]);

  const applyCoupon = async (requestedCode = couponInput) => {
    const code = requestedCode.trim().toUpperCase();
    if (!code || couponCodes.includes(code)) return;
    setCouponMessage("");
    try {
      const result = await api.validateCoupon(
        code,
        items.map(({ variantId, quantity }) => ({ variantId, quantity })),
        couponCodes,
      );
      if (!result.valid) throw new Error(result.message || "Coupon is not valid.");
      const nextCodes = [...couponCodes, result.couponCode || code];
      setCouponCodes(nextCodes);
      setCouponInput("");
      setCouponMessage(result.message || "Coupon applied successfully.");
      if (checkout) saveCheckoutState({ ...checkout, couponCodes: nextCodes });
    } catch (error) {
      setCouponMessage(error instanceof Error ? error.message : "Coupon could not be applied.");
    }
  };

  const removeCoupon = (code: string) => {
    const nextCodes = couponCodes.filter((item) => item !== code);
    setCouponCodes(nextCodes);
    setCouponMessage("");
    if (checkout) saveCheckoutState({ ...checkout, couponCodes: nextCodes });
  };

  const verifyPayment = async (merchantOrderId: string) => {
    let verified: CheckoutSession | undefined;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      verified = await api.verifyCheckout(merchantOrderId);
      if (verified.paymentStatus !== "PENDING") return verified;
      await new Promise((resolve) => window.setTimeout(resolve, 1500));
    }
    return verified;
  };

  const placeOrder = async () => {
    if (!checkout) return;
    setLoading(true);
    setMessage("");
    try {
      const started = await api.startCheckout(
        checkout.addressId,
        items,
        checkout.remarks,
        "CASHFREE",
        couponCodes,
      );
      if (!started.paymentSessionId || !started.merchantOrderId)
        throw new Error("The payment gateway did not return a valid payment session.");
      if (started.cashfreeMode && started.cashfreeMode.toLowerCase() !== "sandbox")
        throw new Error("Payment was stopped because the backend did not return Cashfree sandbox mode.");
      const cashfree = await loadCashfree({ mode: "sandbox" });
      if (!cashfree) throw new Error("The payment gateway could not be loaded.");
      const gatewayResult = await cashfree.checkout({
        paymentSessionId: started.paymentSessionId,
        redirectTarget: "_modal",
      });
      const verified = await verifyPayment(started.merchantOrderId);
      if (verified?.paymentStatus !== "PAID") {
        const status = verified?.paymentStatus?.replaceAll("_", " ").toLowerCase();
        throw new Error(
          gatewayResult.error?.message ||
            (status ? `Payment ${status}. Please try again.` : "Payment could not be verified."),
        );
      }
      await clearCart();
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      clearCheckoutState();
      if (verified.orders.length === 1)
        await navigate({
          to: "/orders/$orderId",
          params: { orderId: String(verified.orders[0].id) },
        });
      else await navigate({ to: "/orders" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Order could not be placed");
    } finally {
      setLoading(false);
    }
  };

  const address = addresses.data?.find((item) => item.id === checkout?.addressId);
  const localTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="container-page flex-1 py-10">
        <CheckoutSteps active={2} />
        <div className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="flex justify-between gap-4">
                <div>
                  <h1 className="text-3xl">Delivering To</h1>
                  {address ? (
                    <div className="mt-3 text-sm">
                      <strong>{address.contactName}</strong>
                      <p>{address.mobile}</p>
                      <p className="mt-1 text-muted-foreground">
                        {[
                          address.line1,
                          address.line2,
                          address.city,
                          address.state,
                          address.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  ) : null}
                </div>
                <Link to="/checkout/shipping" className="text-sm text-brand">
                  Edit
                </Link>
              </div>
            </section>
            <h2 className="mt-6 text-2xl">Order Items ({cartItems.length})</h2>
            <div className="mt-4 space-y-4">
              {cartItems.map((item) => {
                const originalPrice = item.product.oldPrice ?? item.product.price;
                const savingsPerItem = Math.max(0, originalPrice - item.product.price);
                const discountPercent = originalPrice > item.product.price
                  ? Math.round((savingsPerItem / originalPrice) * 100)
                  : 0;
                const wished = isWishlisted(item.product);
                return (
                <article
                  key={`${item.product.id}-${item.product.variantId}`}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="flex gap-5 p-5">
                    <ProductImage
                      product={item.product}
                      className="h-40 w-40 rounded-xl bg-secondary object-contain"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="text-xl font-semibold text-foreground">{item.product.name}</h3>
                      <div className="mt-2 flex flex-wrap items-baseline gap-2">
                        <strong className="text-xl font-semibold text-foreground">₹{item.product.price.toFixed(2)}</strong>
                        {originalPrice > item.product.price ? <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toFixed(2)}</span> : null}
                        {discountPercent > 0 ? (
                          <span className="rounded-full bg-orange px-2.5 py-1 text-xs font-semibold text-white">
                            {discountPercent}% off
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm font-medium text-orange">
                        {item.product.inStock === false ? "Out of Stock" : "In Stock"}
                        {savingsPerItem > 0 ? ` · You save ₹${(savingsPerItem * item.quantity).toFixed(2)}` : ""}
                      </p>
                      <div className="mt-auto inline-flex w-fit items-center overflow-hidden rounded-full border border-border">
                        <button
                          className="grid h-11 w-12 place-items-center transition-colors hover:bg-orange hover:text-white"
                          onClick={() =>
                            void updateCartQuantity(item.product.id, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <button
                          className="grid h-11 w-12 place-items-center transition-colors hover:bg-orange hover:text-white"
                          onClick={() =>
                            void updateCartQuantity(item.product.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <strong className="self-center text-xl">₹{(item.product.price * item.quantity).toFixed(2)}</strong>
                  </div>
                  <div className="grid grid-cols-2 border-t border-border">
                    <button onClick={() => toggleWishlist(item.product)} className="flex items-center justify-center gap-2 border-r border-border py-4 text-sm font-medium transition-colors hover:bg-orange hover:text-white">
                      <Heart className={`h-5 w-5 ${wished ? "fill-current" : ""}`} />
                      {wished ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                    <button onClick={() => void removeFromCart(item.product.id)} className="flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors hover:bg-red-600 hover:text-white">
                      <Trash2 className="h-5 w-5" /> Remove
                    </button>
                  </div>
                </article>
                );
              })}
            </div>
            {recommendations.data?.length ? (
              <section className="mt-8">
                <h2 className="text-2xl">You May Also Like</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {recommendations.data.map((product) => (
                    <article
                      key={product.id}
                      className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card"
                    >
                      <ProductImage
                        product={product}
                        className="h-36 w-full bg-secondary object-contain"
                      />
                      <div className="flex flex-1 flex-col p-3">
                        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold">{product.name}</h3>
                        <strong className="mt-3 block">₹{product.price.toFixed(2)}</strong>
                        <button
                          onClick={() => void addToCart(product)}
                          className="mt-auto w-full rounded-full bg-orange py-2 text-sm font-medium text-white transition-colors hover:bg-orange/85"
                        >
                          Add
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Coupon Code</h2>
                <Link to="/coupons" className="text-xs text-brand">
                  View All Coupons
                </Link>
              </div>
              {couponCodes.map((code) => (
                <div
                  key={code}
                  className="mt-3 flex justify-between rounded-lg bg-secondary px-3 py-2 text-sm font-medium"
                >
                  <span>{code}</span>
                  <button
                    onClick={() => removeCoupon(code)}
                    aria-label={`Remove ${code}`}
                    className="text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="mt-3 flex gap-2">
                <input
                  value={couponInput}
                  onChange={(event) => setCouponInput(event.target.value)}
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm"
                />
                <button
                  onClick={() => void applyCoupon()}
                  className="rounded-lg bg-brand px-4 text-sm text-white"
                >
                  Apply
                </button>
              </div>
              {couponMessage ? (
                <p
                  className={`mt-2 text-xs ${couponMessage.toLowerCase().includes("success") ? "text-brand" : "text-red-600"}`}
                >
                  {couponMessage}
                </p>
              ) : null}
            </div>
            <h2 className="mt-6 text-xl">
              Order Summary{" "}
              {updating ? (
                <span className="text-xs font-normal text-muted-foreground">Updating...</span>
              ) : null}
            </h2>
            <SummaryRow
              label="Subtotal"
              value={preview ? preview.subtotal - (preview.taxTotal ?? 0) : localTotal}
            />
            {preview?.discountAmount ? (
              <SummaryRow label="Coupon Discount" value={-preview.discountAmount} />
            ) : null}
            <SummaryRow label="Tax (GST)" value={preview?.taxTotal} />
            <SummaryRow label="Shipping" value={preview?.shippingAmount} />
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-semibold">
              <span>Total Payable</span>
              <span>₹{(preview?.grandTotal ?? localTotal).toFixed(2)}</span>
            </div>
            <button
              onClick={() => void placeOrder()}
              disabled={loading || updating || !preview?.serviceable || !cartItems.length}
              className="mt-5 w-full rounded-xl bg-orange py-3 font-semibold text-white disabled:opacity-50"
            >
              {loading
                ? "Opening secure payment..."
                : `Pay securely · ₹${(preview?.grandTotal ?? localTotal).toFixed(2)}`}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Cashfree sandbox payment gateway
            </p>
            {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: number }) {
  return (
    <div className="mt-3 flex justify-between text-sm">
      <span>{label}</span>
      <span>{value == null ? "—" : `${value < 0 ? "−" : ""}₹${Math.abs(value).toFixed(2)}`}</span>
    </div>
  );
}
