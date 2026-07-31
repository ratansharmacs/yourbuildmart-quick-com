import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useShop } from "@/context/shop-context";
import { api } from "@/lib/api";
import { loadCheckoutState, saveCheckoutState } from "@/lib/checkout-state";

export const Route = createFileRoute("/coupons")({
  head: () => ({ meta: [{ title: "Available Coupons - YourBuildMart" }] }),
  component: CouponsPage,
});

function CouponsPage() {
  const navigate = useNavigate();
  const { cartItems } = useShop();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [applying, setApplying] = useState("");
  const coupons = useQuery({ queryKey: ["visible-coupons"], queryFn: () => api.visibleCoupons() });

  const apply = async (code: string) => {
    const checkout = loadCheckoutState();
    if (!checkout) {
      await navigate({ to: "/checkout/shipping" });
      return;
    }
    setApplying(code);
    setErrors((current) => ({ ...current, [code]: "" }));
    try {
      const appliedCouponCodes = checkout.couponCodes || [];
      const items = cartItems.flatMap((item) =>
        item.product.variantId
          ? [{ variantId: item.product.variantId, quantity: item.quantity }]
          : [],
      );
      const result = await api.validateCoupon(code, items, appliedCouponCodes);
      if (!result.valid) throw new Error(result.message || "Coupon is not valid.");
      saveCheckoutState({
        ...checkout,
        couponCodes: [
          ...appliedCouponCodes.filter((item) => item !== code),
          result.couponCode || code,
        ],
      });
      await navigate({ to: "/checkout/review" });
    } catch (error) {
      setErrors((current) => ({
        ...current,
        [code]: error instanceof Error ? error.message : "Coupon could not be applied.",
      }));
    } finally {
      setApplying("");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Navbar />
      <main className="container-page flex-1 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm">
            <Link to="/checkout/review" className="text-brand">
              Order Review
            </Link>{" "}
            / Coupons
          </p>
          <h1 className="mt-4 text-4xl">Available Coupons</h1>
          <p className="mt-2 text-muted-foreground">Select a coupon and apply it to your order.</p>
          <div className="mt-8 space-y-5">
            {coupons.data?.content.map((coupon) => (
              <article
                key={coupon.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-5 p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                        {formatDiscount(coupon)}
                      </span>
                      <span className="text-xs uppercase text-muted-foreground">
                        {coupon.discountType || "Coupon"}
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold">{coupon.code}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {coupon.description || "Apply this coupon to your eligible order."}
                    </p>
                  </div>
                  <button
                    disabled={applying === coupon.code}
                    onClick={() => void apply(coupon.code)}
                    className="rounded-xl bg-brand px-5 py-3 text-white disabled:opacity-50"
                  >
                    {applying === coupon.code ? "Applying..." : "Apply Coupon"}
                  </button>
                </div>
                {errors[coupon.code] ? (
                  <p className="mx-6 mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {errors[coupon.code]}
                  </p>
                ) : null}
                <div className="border-t border-border bg-secondary/40 px-6 py-4">
                  <p className="text-xs font-semibold uppercase">Conditions</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {coupon.minimumOrderAmount
                      ? `Minimum order ₹${Number(coupon.minimumOrderAmount).toFixed(2)}`
                      : "No minimum order condition"}
                    {coupon.allowStackable === false
                      ? " · Cannot be combined with other coupons"
                      : ""}
                  </p>
                </div>
              </article>
            ))}
            {coupons.isLoading ? <p>Loading coupons...</p> : null}
            {coupons.error ? <p className="text-red-600">{coupons.error.message}</p> : null}
            {!coupons.isLoading && !coupons.data?.content.length ? (
              <p className="text-muted-foreground">No coupons are currently available.</p>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function formatDiscount(coupon: { discountType?: string; discountValue?: number }) {
  if (coupon.discountValue == null) return "Offer";
  return coupon.discountType?.toUpperCase().includes("PERCENT")
    ? `${coupon.discountValue}% OFF`
    : `₹${coupon.discountValue} OFF`;
}
